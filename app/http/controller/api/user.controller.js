const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { ProductModel } = require("../../../model/products");
const mongoose = require("mongoose");
const { getBasketOfUser, copyObject } = require("../../../module/functions");
const { UserModel } = require("../../../model/user.model");
const { AddressModel } = require("../../../model/addres.model");
const { SaleProductModel } = require("../../../model/saleProduct");
class UserController {
  async getLikeProducts(req, res, next) {
    try {
      const userID = req.user._id;
      const findProducts = await ProductModel.find({});
      let products = [];
      findProducts.forEach((e) => {
        e.likes.forEach((l) => {
          if ("" + l == "" + userID) {
            products.push(e);
            console.log("dsd");
          }
        });
      });
      if (!products) throw createHttpError.NotFound("محصولی یافت نشد");
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          products,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getUserBasket(req, res, next) {
    try {
      const user = req.user;
      const products = await SaleProductModel.find({ userID: user._id });
      const userDetail = [];
      products.forEach(e => {
        if (e.verify == true) userDetail.push(e);
      })
      return res.status(StatusCodes.OK).json({
        data: {
          userDetail,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateUserProfile(req, res, next) {
    try {
      const userID = req.user._id;
      const { first_name, last_name, address, postalCode, province, city } =
        req.body;
      const profileUpdateResult = await UserModel.updateOne(
        { _id: userID },
        {
          $set: {
            first_name,
            last_name,
          },
        }
      );
      if (!profileUpdateResult.modifiedCount)
        throw new createHttpError.InternalServerError("به روزسانی انجام نشد");
      const findAddress = await AddressModel.findOne({ userID });
      if (findAddress) {
        const updateAddressUser = await AddressModel.updateOne(
          { userID },
          { $set: { address, postalCode, city, province } }
        );
        if (!updateAddressUser.modifiedCount)
          throw createHttpError.InternalServerError(
            "سرور با مشکل مواجه شده است دوباره تلاش کنید"
          );
      } else {
        const createAddress = await AddressModel.create({
          address,
          postalCode,
          province,
          city,
          userID,
        });
        await UserModel.updateOne(
          { _id: userID },
          { $push: { address: createAddress._id } }
        );
        if (!createAddress)
          throw createHttpError.InternalServerError(
            "سرور با مشکل مواجه شده است دوباره تلاش کنید"
          );
      }
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          message: "به روزرسانی پروفایل با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getInformationUser(req, res, next) {
    try {
      let userID = req.user._id;
      const result = await UserModel.aggregate([
        { $match: { _id: userID } },
        {
          $lookup: {
            from: "addresses",
            localField: "address",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $project: {
            password: 0,
            createdAd: 0,
            updateAt: 0,
            Role: 0,
            token: 0,
            Products: 0,
            __v: 0,
            "address.createAt": 0,
            "address.updateAt": 0,
            "address.__v": 0,
          },
        },
      ]);
      if (!result) throw createHttpError.NotFound("شما آدرسی ثبت نکرده ایید");
      result.forEach((e) => {
        e.address = e.address[e.address.length - 1];
      });
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCommentOfUser(req, res, next) {
    try {
      const user = req.user;
      let allComments = await ProductModel.find({
      });
      allComments = copyObject(allComments);
      let listComments = allComments.map((e) =>
        e.comments.filter((id) => id.user == user._id)
      );
      const listComment = [];
      for (var i = 0; i < listComments.length; i++) {
        for (var x = 0; x < listComments[i].length; x++) {
          listComments[i][x].title = allComments[i].title;
          listComments[i][x].idProducts = allComments[i]._id;
          listComments[i][x].images = allComments[i].images;
          listComment.push(listComments[i][x]);
        }
      }
      return res.status(StatusCodes.OK).json({
        data: {
          listComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  UserController: new UserController(),
};
