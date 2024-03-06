const { default: mongoose } = require("mongoose");

const Address = new mongoose.Schema(
  {
    userID: { type: mongoose.Types.ObjectId, ref: "user" },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    province: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("address", Address);

module.exports = { AddressModel };
