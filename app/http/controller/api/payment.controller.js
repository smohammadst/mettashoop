const { default: axios } = require("axios");
const createHttpError = require("http-errors");
const moment = require("moment-jalali");
const { StatusCodes: HttpStatus, StatusCodes } = require("http-status-codes");
const {
  invoiceNumberGenerator, copyObject,
} = require("../../../module/functions");
const Controller = require("../controller");
const { PaymentModel } = require("../../../model/payments");
const { ProductModel } = require("../../../model/products");
const { SaleProductModel } = require("../../../model/saleProduct");
const mongoose = require("mongoose");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const MelipayamakApi = require('melipayamak');
const { UserModel } = require("../../../model/user.model");
const username = '09353040700';
const password = 'cahefm';
const api = new MelipayamakApi(username, password);

class PaymentController extends Controller {
  async PaymentGateway(req, res, next) {
    try {
      let { basket, sendPrice } = req.body;
      const user = req.user;
      let amount = 0;
      let sale
      let result = 0
      let saleList = []
      for (var i = 0; i < basket.length; i++) {
        if (basket[0]) {
          sale = await SaleProductModel.create({
            verify: false,
            addressStr: basket[0].address,
            city: basket[0].city,
            state: basket[0].state,
            postalCode: basket[0].postalCode,
            send: false,
            userID: user._id,
          });
        }
        const findProduct = await ProductModel.findOne({
          _id: mongoose.Types.ObjectId(basket[i]._id),
        });
        if (!findProduct) return createHttpError.NotFound("کالایی یافت نشد");
        if (findProduct.theFinalPrice > 0) {
          amount += ((findProduct.theFinalPrice * basket[i].quantity) + findProduct.maliat);
          result += findProduct.result
          saleList.push({
            color: basket[i].color,
            theFinalPrice: findProduct.theFinalPrice,
            title: findProduct.title,
            productID: findProduct._id,
            count: basket[i].quantity,
          })
        }
      }
      if (amount == 0) throw createHttpError[404]("محصول را نمیتوانید خریداری کنید")
      await SaleProductModel.updateOne(
        { _id: sale._id },
        {
          $set: {
            sale: saleList
          }
        }
      );
      amount += +sendPrice
      amount = amount * 10;
      amount = Math.floor(amount)
      const zarinpal_request_url =
        "https://api.zarinpal.com/pg/v4/payment/request.json";
      const zarinpalGatewayURL = "https://www.zarinpal.com/pg/StartPay";
      const description = `هزینه بسته بندی و مالیات :${result}`;
      const zapripal_options = {
        merchant_id: process.env.ZARINPAL_MERCHANTID,
        amount,
        description,
        metadata: {
          email: user?.email || "example@domain.com",
          mobile: user.phone,
        },
        callback_url: "https://gajetmajet.iran.liara.run/payment/verify",
      };
      const RequestResult = await axios
        .post(zarinpal_request_url, zapripal_options)
        .then((result) => result.data);
      const { authority, code } = RequestResult.data;
      // console.log("auth: " + authority);
      // console.log("code: " + code);
      await SaleProductModel.updateOne(
        { _id: sale._id },
        { $set: { authority } }
      );
      await PaymentModel.create({
        invoiceNumber: invoiceNumberGenerator(),
        paymentDate: moment().format("jYYYYjMMjDDHHmmss"),
        amount,
        user: user._id,
        description,
        authority,
        verify: false,
        basket,
        address: user.address[0],
      });
      if (code == 100 && authority) {
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {
            code,
            basket,
            gatewayURL: `${zarinpalGatewayURL}/${authority}`,
          },
        });
      }
      throw createHttpError.BadRequest("اتصال به درگاه پرداخت انجام نشد");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async verifyPayment(req, res, next) {
    try {
      const { Authority: authority } = req.query;
      const verifyURL = "https://api.zarinpal.com/pg/v4/payment/verify.json";
      const payment = await PaymentModel.findOne({ authority });
      if (!payment)
        throw createHttpError.NotFound("تراکنش در انتظار پرداخت یافت نشد");
      if (payment.verify)
        throw createHttpError.BadRequest("تراکنش مورد نظر قبلا پرداخت شده");
      const verifyBody = JSON.stringify({
        authority,
        amount: payment.amount,
        merchant_id: process.env.ZARINPAL_MERCHANTID,
      });
      const verifyResult = await fetch(verifyURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: verifyBody,
      }).then((result) => result.json());
      if (verifyResult.data.code == 100) {
        await SaleProductModel.findOneAndUpdate(
          { authority },
          { $set: { verify: true } }
        );
        await PaymentModel.updateOne(
          { authority },
          {
            $set: {
              refID: verifyResult.data.ref_id,
              cardHash: verifyResult.data.card_hash,
              verify: true,
            },
          }
        );
        const result = await SaleProductModel.findOne({ authority });
        for (var i = 0; i < result.sale.length; i++) {
          await ProductModel.updateOne(
            { _id: result.sale[i].productID },
            { $inc: { sale: 1, count: -result.sale[i].count } }
          );
        }
        return res.redirect("https://metaashopp.com/Success").status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {
            message: "پرداخت شما با موفقیت انجام شد",
          },
        });
      }
      return res.redirect("https://metaashopp.com/Fail").json({
        data: {
          massage: "پرداخت انجام نشد در صورت کسر وجه طی ۷۲ ساعت به حساب شما بازمیگردد"
        }
      })
    } catch (error) {
      next(error);
    }
  }
  async getAllPayment(req, res, next) {
    try {
      let result = await SaleProductModel.find({}).sort({ createdAt: -1 }).populate({
        path: "userID",
        select: ["first_name", "last_name", "phone"]
      });

      let saleProduct = []
      for (var i = 0; i < result.length; i++) {
        if (result[i].verify == true) {
          let payment = await PaymentModel.findOne({ authority: result[i].authority });
          let sale = await SaleProductModel.findOne({ authority: result[i].authority })
          const copyObjectSale = copyObject(result[i])
          const address = {
            address: copyObjectSale.addressStr,
            postalCode: copyObjectSale.postalCode,
            city: copyObjectSale.city,
            state: copyObjectSale.state
          }
          copyObjectSale["address"] = address;
          copyObjectSale["date"] = payment.paymentDate;
          copyObjectSale["factor"] = sale.code;
          copyObjectSale["theFinalPrice"] = payment.amount
          saleProduct.push(copyObjectSale)
        }
      }
      return res.status(StatusCodes.OK).json({
        data: {
          saleProduct,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async sendProduct(req, res, next) {
    try {
      const { id, code } = req.body;
      console.log(code);
      const result = await SaleProductModel.findOne({ _id: id });
      const findUser = await UserModel.findOne({ _id: result.userID });
      if (!findUser) throw createHttpError.NotFound("کاربری یافت نشد")
      result.send = true;
      result.code = "" + code
      result.save();
      const sms = api.sms()
      const to = "" + findUser.phone;
      const from = "50004001040700";
      const text = `کد رهگیری:${code}میباشد\nبسته ی شما به پست تحویل داده شد و به زودی به دست شما میرسد`
      sms.send(to, from, text).then(e => {
        console.log(e)
      }).catch(err => {
        console.log("err" + err)
      });
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          message: "بسته ارسال شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async productPurchased(req, res, next) {
    try {
      const userID = req.user._id;
      const result = await SaleProductModel.find({ userID, verify: true }).populate({ path: "sale.productID" });
      const listProduct = []
      for (var i = 0; i < result.length; i++) {
        for (let x = 0; x < result[i].sale.length; x++) {
          const element = result[i].sale[x].productID;
          const product = await ProductModel.findOne({ _id: element })
          listProduct.push(product);
        }
      }
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          listProduct,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getProduct(req, res, next) {
    const products = await ProductModel.find({});
    let availableProducts = []
    let unAvailableProducts = []
    products.forEach(e => {
      if (e.count == 0) {
        availableProducts.push(e)
      } else {
        unAvailableProducts.push(e)
      }
    })
    return res.state(StatusCodes.OK).json({
      availableProducts,
      unAvailableProducts,
    })
  }
  async deleteData(req, res, next) {
    try {
      const sale = await SaleProductModel.find({});
      sale.forEach(async (e) => {
        console.log("start");
        const remove = await SaleProductModel.deleteOne({ _id: e._id })
        if (remove.deletedCount == 0)
          throw createHttpError.InternalServerError(
            "سرور با مشکل مواجه شده است دوباره تلاش کنید"
          );
        console.log("done");
      })
      return res.status(200).json("kkkkkkk")
    } catch (error) {
      next(error)
    }
  }
  async maliat(req, res, next) {
    try {
      const { maliat } = req.body;
      let result = 0
      for (var i = 0; i < maliat.length; i++) {
        const product = await ProductModel.findOne({ _id: maliat[i] });
        result += product.maliat
      }
      res.status(StatusCodes.OK).json({
        result
      })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = {
  PaymentController: new PaymentController(),
};
