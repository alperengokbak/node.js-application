import e from "express";
import User from "../models/schema.js";
const saltRounds = 10;
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { full_name, username, password, email, country, roles } = req.body;

  try {
    if (!full_name || !username || !password || !email || !country) {
      return res.status(400).send({ message: "Missing required information" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) return res.status(400).send({ message: "Email already exists" });

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) return res.status(400).send({ message: "Username already exists" });

    // Validate email and password
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!emailPattern.test(email)) {
      return res.status(400).send({ message: "Invalid email address" });
    }

    if (!passwordPattern.test(password)) {
      return res.status(400).send({
        message:
          "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number",
      });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const registeredUser = await User.create({ full_name, username, password: hashPassword, email, country, roles });

    res.status(201).send({ message: "User created successfully", user: registeredUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register };
