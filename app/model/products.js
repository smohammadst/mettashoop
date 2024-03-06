const { default: mongoose } = require("mongoose");
const { CommentModel } = require("./public.schema");

const Notification = new mongoose.Schema(
  {
    phone: { type: String, default: "" },
    date: { type: String, default: "" },
    color: { type: String, default: "" }
  }, {
  toJSON: { virtuals: true }
}
)
const ProductSchema = new mongoose.Schema(
  {
    barcode: { type: String },
    title: { type: String, required: true },
    short_text: { type: String, required: true },
    text: { type: String, required: true },
    images: { type: [String], required: true },
    tags: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
    },
    cat: { type: String, required: true },
    comments: { type: [CommentModel], default: [] },
    likes: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    count: { type: Number },
    status: { type: Boolean, default: false },
    features: {
      type: Object,
      default: {
        length: "",
        height: "",
        width: "",
        weight: "",
      },
    },
    property: { type: Object, default: {} },
    ImportantFeatures: {
      type: Object,
      default: {
        brand: "",
        colors: [],
      },
    },
    sumStar: { type: Number, default: 0 },
    theFinalPrice: { type: Number, default: 0 },
    sale: { type: Number, default: 0 },
    productID: { type: String },
    maliat: { type: Number, default: 0 },
    result: { type: Number, default: 0 },
    notification: { type: Boolean, default: false },
    list_notification: { type: [Notification], default: [] }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

ProductSchema.index({ title: "text", tags: "text" });
ProductSchema.virtual("imagesURL").get(function () {
  return this.images.map(
    (image) =>
      `${process.env.BASE_URL}/${image}`
  );
});
ProductSchema.virtual("productURL").get(function () {
  let result = `${process.env.PRODUCT_URL}/${this.category}/${this._id}/${this.title}`
  return result
});
module.exports = {
  ProductModel: mongoose.model("product", ProductSchema),
};