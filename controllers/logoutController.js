import User from "../models/schema.js";

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt) return res.status(204).send({ message: "Missing Cookies" });

    const validateRefreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken: validateRefreshToken });
    if (!user) {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      return res.status(204).send({ message: "No content." });
    }
    user.refreshToken = user.refreshToken.filter((token) => token !== validateRefreshToken);
    await user.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { handleLogout };
