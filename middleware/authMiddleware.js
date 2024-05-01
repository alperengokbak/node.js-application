import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ status: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ status: "Invalid Token", error: err });
      req.user = decoded.UserInfo.email;
      req.roles = decoded.UserInfo.roles;
      next();
    });
  } catch (error) {
    return res.status(400).json({ status: "Unauthorized" });
  }
};

export default authMiddleware;
