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
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.status(200).send({
        status: "200",
        message: "Login successful",
        user: {
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          country: user.country,
        },
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { login };
