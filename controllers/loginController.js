import User from "../models/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email && !password) {
      return res.status(400).send({ message: "Missing required information" });
    }

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send({ message: "Email not found" });

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) return res.status(400).send({ message: "Invalid password" });

    if (user && validatePassword) {
      const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "30s",
      });
      const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "1d",
      });

      await User.findOneAndUpdate({ email: user.email }, { refreshToken: refreshToken }, { new: true });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: "200",
        message: "Login successful",
        user: {
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          country: user.country,
        },
        accessToken,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { login };
