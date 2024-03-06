const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    title: {type:String},
    product: {type:[mongoose.Types.ObjectId]}
  },
  { timestamps: true }
);
module.exports = {
  GetSliderModel: mongoose.model("getslider", Schema),
};
