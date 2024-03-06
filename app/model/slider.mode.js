const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: [String], required: true },
    link: { type: String, default: "main" },
  },
  { timestamps: true }
);
module.exports = {
  SliderModel: mongoose.model("slider", Schema),
};
