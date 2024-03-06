const mongoose = require("mongoose");
const AnswerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    comment: { type: String, required: true },
    show: { type: Boolean, required: true, default: false },
    likes: { type: [mongoose.Types.ObjectId], ref: "user" },
  },
  {
    timestamps: { createdAt: true },
  }
);
const CommentModel = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    comment: { type: String, required: true },
    show: { type: Boolean, required: true, default: false },
    email: { type: String, required: true },
    likes: { type: [mongoose.Types.ObjectId], ref: "user" },
    star: { type: Number, default: 0 },
    answers: { type: [AnswerSchema], default: [] },
  },
  {
    timestamps: { createdAt: true },
  }
);
const Concat = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    show: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true } }
);

module.exports = {
  CommentModel,
  ConcatModel: mongoose.model("contact", Concat),
};
