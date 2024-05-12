import { User } from "../models/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const cookies = req.cookies;
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
      const roles = Object.values(user.roles).filter(Boolean);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: user.email,
            roles: roles,
          },
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7h",
        }
      );
      const newRefreshToken = jwt.sign({ email: user.email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "5d",
      });

      const newRefreshTokenArray = !cookies?.jwt
        ? user.refreshToken
        : user.refreshToken.filter((token) => token !== cookies.jwt);

      if (cookies?.jwt) res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

      user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await user.save();

      res.cookie("jwt", newRefreshToken, {
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
          city: user.city,
          address: user.address,
          state: user.state,
          zip: user.zip,
          roles: roles,
        },
        accessToken,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { login };
