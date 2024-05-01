import User from "../models/schema.js";

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt) return res.status(204).send({ message: "Missing Cookies" });

    const validateRefreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken: validateRefreshToken });
    if (!user) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.status(204).send({ message: "No content." });
    }
    await User.findOneAndDelete({ refreshToken: validateRefreshToken });

    res.clearCookie("jwt", { httpOnly: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { handleLogout };
