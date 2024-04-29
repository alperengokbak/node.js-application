import User from "../models/schema.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).send({ message: "Users not found" });
    } else {
      return res.status(200).send({ status: "200", users: users });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
