const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    titleF: { type: String, required: true, unique: true },
    titleE: { type: String, required: true, unique: true },
    image: { type: String },
    cat: {
      type: Object,
      default: {
        name: { type: String },
        range: {
          type: Object,
          default: { min: { type: Number }, max: { type: Number } },
        },
        feature: { type: Object },
      },
    },
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);
module.exports = {
  CategoryModel: mongoose.model("category", Schema),
};
