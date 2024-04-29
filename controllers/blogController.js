import mongoose from "mongoose";

const Blogs = mongoose.model("blogs", { title: String, snippet: String, body: String }, "blogs");

export const searchall = (req, res) => {
  Blogs.find().then((result) => {
    res.send(result);
  });
};

export const searchbytitle = (req, res) => {
  const { searchTerm } = req.body;
  const regex = new RegExp("\\b" + searchTerm + "\\b", "i");

  Blogs.find({ title: { $regex: regex } })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};
