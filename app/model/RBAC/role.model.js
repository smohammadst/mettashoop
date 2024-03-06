const mongoose = require("mongoose");

const Role = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    description: {type: String, default: ""},
    permission: {
      type: [mongoose.Types.ObjectId],
      ref: "permission",
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

module.exports = {
  RoleModel: mongoose.model("role", Role),
};
