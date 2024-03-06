const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productID: { type: mongoose.Types.ObjectId, ref: "product" },
});
const BasketSchema = new mongoose.Schema({
  products: { type: [ProductSchema], default: [] },
});

const User = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    otp: {
      type: Object,
      default: {
        code: 0,
        expiresIn: 0,
      },
    },
    Products: { type: [mongoose.Types.ObjectId], ref: "product", default: [] },
    address: { type: [mongoose.Types.ObjectId], ref: "address", default: [] },
    token: { type: String, default: "" },
    Role: { type: String, default: "USER" },
    basket: { type: BasketSchema },
    statusSendProduct: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
User.index({
  first_name: "text",
  last_name: "text",
  mobile: "text",
});

const UserModel = mongoose.model("user", User);

module.exports = {
  UserModel,
};
