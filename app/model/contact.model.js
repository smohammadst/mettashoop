const { default: mongoose } = require("mongoose");

const Contact = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = {
  ContactModel: mongoose.model("contact", Contact),
};
