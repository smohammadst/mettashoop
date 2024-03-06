const { default: mongoose } = require("mongoose");
const { UserModel } = require("./user.model");
const MelipayamakApi = require('melipayamak');
const { PaymentModel } = require("./payments");
const username = '09353040700';
const password = 'cahefm';
const api = new MelipayamakApi(username, password);

const SaleProduct = new mongoose.Schema(
  {
    sale: {
      type: Array,
    },
    verify: { type: Boolean },
    addressStr: { type: String },
    postalCode: { type: String },
    city: { type: String },
    state: { type: String },
    send: { type: Boolean, default: false },
    authority: { type: String, default: "" },
    userID: { type: mongoose.Types.ObjectId, ref: "user" },
    code: { type: String, default: "" }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
SaleProduct.pre("findOneAndUpdate", async function (next) {
  const sale = await this.model.findOne(this.getQuery());
  let list = [];
  let stringTitle = ""
  sale.sale.forEach(p => {
    list.push(p.title)
  })
  stringTitle = String(list)
  const id = sale.userID;
  const userID = await UserModel.findOne({ _id: id });
  const payment = await PaymentModel.findOne({ authority: sale.authority });
  let timestamp = payment.paymentDate
  timestamp = "" + timestamp
  let second = timestamp.substr(-2);
  let minute = timestamp.substr(-4, 2);
  let hour = timestamp.substr(-6, 2);
  let day = timestamp.substr(-8, 2);
  let month = timestamp.substr(-10, 2);
  let year = timestamp.substr(0, 4);
  const sms = api.sms()
  const to = "09353040700";
  const from = "50004001040700";
  let text = `
  خریدی انجام شده به نام ${userID.first_name}${userID.last_name} به سایت مراجعه کنید
  تاریخ خرید: ${year}/${month}/${day} ${hour}:${minute}:${second}
  قیمت نهایی : ${payment.amount}
  محصولات خریداری شده:${stringTitle}
  `
  sms.send(to, from, text).then(e => {
    console.log(e)
  }).catch(err => {
    console.log("err" + err)
  });
  const to1 = "" + userID.phone;
  const from1 = "50004001040700";
  let text1 = `
  ,خرید شما با موفقیت انجام شد. سپاس از خرید شما ${userID.first_name}${userID.last_name}
  تاریخ خرید: ${year}/${month}/${day} ${hour}:${minute}:${second}
  قیمت نهایی : ${payment.amount}
  محصولات خریداری شده:${stringTitle}
  `
  sms.send(to1, from1, text1).then(e => {
    console.log(e)
  }).catch(err => {
    console.log("err" + err)
  })
  const to3 = "09010674017";
  const from3 = "50004001040700";
  let text3 = `
  خریدی انجام شده به نام ${userID.first_name}${userID.last_name} به سایت مراجعه کنید
  تاریخ خرید: ${year}/${month}/${day} ${hour}:${minute}:${second}
  قیمت نهایی : ${payment.amount}
  محصولات خریداری شده:${stringTitle}
  `
  sms.send(to3, from3, text3).then(e => {
    console.log(e)
  }).catch(err => {
    console.log("err" + err)
  });
  const to2 = "" + userID.phone;
  const from2 = "50004001040700";
  let text2 = `
  سپاس از شما بابت خرید از سایت متاشاپ
  `
  sms.send(to2, from2, text2).then(e => {
    console.log(e)
  }).catch(err => {
    console.log("err" + err)
  })
})

const SaleProductModel = mongoose.model("saleProduct", SaleProduct);

module.exports = { SaleProductModel };
