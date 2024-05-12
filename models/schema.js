import { add } from "date-fns";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: [String],
  },
});

const User = mongoose.model("User", userSchema);

const helpSchema = new Schema({
  full_name: { type: String, ref: "User" },
  email: { type: String, ref: "User" },
  message: { type: String, required: true },
});

const Help = mongoose.model("Help", helpSchema);

export { User, Help };
