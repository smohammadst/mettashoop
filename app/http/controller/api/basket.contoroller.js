const { StatusCodes } = require("http-status-codes");
const { copyObject } = require("../../../module/functions");
const Controller = require("../controller");
const mongoose = require("mongoose");
const { UserModel } = require("../../../model/user.model");
const createHttpError = require("http-errors");
const { ProductModel } = require("../../../model/products");

class Basket extends Controller {
  async addBasket(req, res, next) {
    try {
      let { basket } = req.body;
      const user = req.user;
      basket.forEach(async (product) => {
        const count = product.quantity;
        const color = product.color;
        const findProduct = await ProductModel.findOne({ _id: product._id });
        if (!findProduct) return createHttpError.NotFound("کالایی یافت نشد");
        await UserModel.updateOne(
          { _id: user._id },
          {
            $push: {
              "basket.products": {
                title: findProduct.title,
                color,
                count,
                productID: product._id,
              },
            },
            $set: { statusSendProduct: "در حال خرید" },
          }
        );
      });
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  BasketController: new Basket(),
};
