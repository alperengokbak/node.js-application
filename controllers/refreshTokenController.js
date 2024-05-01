import User from "../models/schema.js";
import jwt from "jsonwebtoken";

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt) return res.status(401).send({ message: "Missing Cookies" });

    const validateRefreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken: validateRefreshToken });
    if (!user) return res.status(403).send({ message: "Invalid Refresh Token" });

    if (user) {
      jwt.verify(validateRefreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err || user.email !== decoded.email) return res.status(403).send({ message: "Invalid Refresh Token" });
        const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
          expiresIn: "30s",
        });
        res.json({ accessToken });
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { handleRefreshToken };
