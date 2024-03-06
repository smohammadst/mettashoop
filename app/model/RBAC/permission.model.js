const mongoose = require("mongoose");

const Permission = new mongoose.Schema(
  {
    title: { type: Sting, unique: true },
    description: { type: String, default: "" },
  },
  {
    toJSON: { virtuals: true },
  }
);

module.exports = {
  PermissionModel: mongoose.model("permission", Permission),
};
