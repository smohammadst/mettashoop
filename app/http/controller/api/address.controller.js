const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { AddressModel } = require("../../../model/addres.model");
const { deleteInvalidPropertyInObject } = require("../../../module/functions");
const mongoose = require("mongoose");
const { UserModel } = require("../../../model/user.model");
const BLOCKLIST = {
  PLAQUE: "plaque",
  ADDRESS: "address",
  POSTALCODE: "postalCode",
  PROVINCE: "province",
  CITY: "city",
};
Object.freeze(BLOCKLIST);

class AddressController {
  async addAddress(req, res, next) {
    try {
      const { plaque, address, postalCode, province, city } = req.body;
      const userID = req.user._id;
      console.log(userID);
      const result = await AddressModel.create({
        plaque,
        address,
        postalCode,
        province,
        city,
      });
      await UserModel.updateOne(
        { _id: userID },
        { $push: { address: result._id } }
      );
      if (!result)
        throw createHttpError.InternalServerError("دوباره تلاش کنید");
      return res.status(StatusCodes.CREATED).json({
        data: {
          StatusCode: StatusCodes.CREATED,
          message: "آدرس شما ثبت شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeAddress(req, res, next) {
    try {
      const { id } = req.params;
      const existAddress = await this.findAddress(id);
      const result = await AddressModel.deleteOne({ id: existAddress._id });
      if (result.deletedCount == 0)
        throw createHttpError.InternalServerError("خطای سرور");
      return res.status(StatusCodes.OK).json({
        data: {
          StatusCode: StatusCodes.OK,
          message: "آدرس با موفقیت پاک شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async UpdateAddress(req, res, next) {
    try {
      const userID = req.user._id;
      const data = req.body;
      const deleteBlockList = Object.values(BLOCKLIST);
      await deleteInvalidPropertyInObject(data, deleteBlockList);
      const result = await AddressModel.updateOne({ userID }, { $set: data });
      if (result.modifiedCount == 0)
        throw createHttpError.InternalServerError(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          message: "آدرس با موفقیت بروزرسانی شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllAddressUser(req, res, next) {
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
            __v: 0,
            "address.createAt": 0,
            "address.updateAt": 0,
            "address.__v": 0,
          },
        },
        {
          $limit: 1,
        },
      ]).sort({ createdAd: 1 });
      if (!result) throw createHttpError.NotFound("شما آدرسی ثبت نکرده ایید");
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
  async findAddress(id) {
    const address = await AddressModel.findById(id);
    if (!address) throw createHttpError.NotFound("آدرس مورد نظر یافت نشد");
    return address;
  }
}

module.exports = {
  AddressController: new AddressController(),
};
