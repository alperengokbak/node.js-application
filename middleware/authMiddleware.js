import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header["authorization"];
  if (!token) return res.status(401).json({ status: "Unauthorized" });
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ status: "Unauthorized" });
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(400).json({ status: "Unauthorized" });
  }
};

export default authMiddleware;
