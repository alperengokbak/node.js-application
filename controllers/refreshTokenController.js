import User from "../models/schema.js";
import jwt from "jsonwebtoken";

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt) return res.status(401).send({ message: "Missing Cookies" });
    const validateRefreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    const user = await User.findOne({ refreshToken: validateRefreshToken });

    // Detected refresh token reuse.
    if (!user) {
      jwt.verify(validateRefreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.status(403).send({ message: "Invalid Refresh Token" });
        const hackedUser = await User.findOne({ email: decoded.email });
        hackedUser.refreshToken = [];
        await hackedUser.save();
      });
      return res.status(403).send({ message: "Invalid Refresh Token" });
    }

    const newRefreshTokenArray = user.refreshToken.filter((token) => token !== validateRefreshToken);

    if (user) {
      jwt.verify(validateRefreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) {
          user.refreshToken = [...newRefreshTokenArray];
          await user.save();
        }
        if (err || user.email !== decoded.email) return res.status(403).send({ message: "Invalid Refresh Token" });

        const roles = Object.values(user.roles);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: decoded.email,
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

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await user.save();

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ roles, accessToken });
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { handleRefreshToken };
