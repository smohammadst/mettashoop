const { default: mongoose } = require("mongoose");

const AboutWe = new mongoose.Schema({
  plaque: { type: Number, required: true },
  postalCode: { type: Number, required: true, required: true },
  province: { type: String, required: true, required: true },
  city: { type: String, required: true, required: true },
});

const AboutWeModel = mongoose.model("About", AboutWe);

module.exports = { AboutWeModel };
