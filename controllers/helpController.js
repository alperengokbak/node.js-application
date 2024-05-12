import { Help, User } from "../models/schema.js";

const helpDesk = async (req, res) => {
  const { full_name, email, message } = req.body;

  try {
    if (!full_name || !email || !message) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existUser = await User.findOne({ email: email, full_name: full_name });

    console.log(existUser);

    if (!existUser) {
      return res.status(400).json({ message: "You have not registered yet." });
    }

    const newHelp = new Help({
      full_name,
      email,
      message,
    });

    const help = await newHelp.save();
    res.status(201).json({ message: "Your message has been sent.", help });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { helpDesk };
