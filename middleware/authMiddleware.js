import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ status: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ status: "Invalid Token" });
      req.user = decoded.email;
      next();
    });
  } catch (error) {
    return res.status(400).json({ status: "Unauthorized" });
  }
};

export default authMiddleware;
