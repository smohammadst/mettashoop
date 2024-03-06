const { query } = require("express");
const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
const { ProductModel } = require("../../../model/products");
const { CommentModel } = require("../../../model/public.schema");
const { UserModel } = require("../../../model/user.model");
const { copyObject } = require("../../../module/functions");
const Controller = require("../controller");

class Comment extends Controller {
  async addComment(req, res, next) {
    try {
      const { comment, id, parent, email, star } = req.body;
      const userID = req.user._id;
      if (parent && mongoose.isValidObjectId(parent)) {
        const result = await ProductModel.updateOne(
          {
            _id: mongoose.Types.ObjectId(id),
            "comments._id": mongoose.Types.ObjectId(parent),
          },
          {
            $push: {
              "comments.$.answers": {
                comment,
                user: userID,
              },
            },
          }
        );
        if (!result.modifiedCount)
          throw createHttpError.InternalServerError("ثبت پاسخ انجام نشد");
        return res.status(StatusCodes.OK).json({
          statusCode: StatusCodes.CREATED,
          data: {
            message: "پاسخ شما با موفقیت ثبت شد",
          },
        });
      } else {
        await ProductModel.updateOne(
          { _id: mongoose.Types.ObjectId(id) },
          {
            $push: {
              comments: {
                comment,
                user: userID,
                email,
                star,
              },
            },
          }
        );
      }
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.CREATED,
        data: {
          message: "پاسخ شما با موفقیت ثبت شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async likeComment(req, res, next) {
    try {
      const { productID, commentID, parent } = req.body;
      const userID = req.user._id;
      if (parent) {
        const likeAnswer = await ProductModel.findOne({
          _id: mongoose.Types.ObjectId(productID),
          "comments.answers.likes": userID,
          "comments._id": parent,
          "comments.answer._id": commentID,
        });
        const updateQuery = likeAnswer
          ? { $pull: { "comments.$[].answers.$[].likes": userID } }
          : { $push: { "comments.$[].answers.$[].likes": userID } };
        let result = await ProductModel.updateOne(
          { _id: mongoose.Types.ObjectId(productID) },
          updateQuery
        );
        if (result.modifiedCount == 0)
          throw createHttpError.InternalServerError("دوباره تلاش کنید");
        let message;
        if (!likeAnswer) {
          message = "پسندیدن محصول با موفقیت انجام شد";
        } else message = "پسندیدن محصول لغو شد";
        return res.status(StatusCodes.OK).json({
          data: {
            statusCode: StatusCodes.OK,
            message,
          },
        });
      }
      if (!parent) {
        const likeComments = await ProductModel.findOne({
          _id: mongoose.Types.ObjectId(productID),
          "comments.likes": userID,
          "comments._id": commentID,
        });
        const updateQuery = likeComments
          ? { $pull: { "comments.$[].likes": userID } }
          : { $push: { "comments.$[].likes": userID } };
        console.log(updateQuery);
        let result = await ProductModel.updateOne(
          { _id: productID },
          updateQuery
        );
        if (result.modifiedCount == 0)
          throw createHttpError.InternalServerError("دوباره تلاش کنید");
        let message;
        if (!likeComments) {
          message = "پسندیدن محصول با موفقیت انجام شد";
        } else message = "پسندیدن محصول لغو شد";
        return res.status(StatusCodes.OK).json({
          data: {
            statusCode: StatusCodes.OK,
            message,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async findExistProduct(id) {
    const product = await ProductModel.findOne({ id });
    if (!product) throw createHttpError.NotFound("محصولی یافت نشد");
    return product;
  }
  async getComment(model, id) {
    const comment = await model.findOne({
      "comments._id": mongoose.Types.ObjectId(id),
    });
    if (!comment?.comments?.[0])
      throw createHttpError.NotFound("کامنتی با این مشخصات یافت نشد");
    return comment?.comments?.[0];
  }
}

module.exports = {
  CommentController: new Comment(),
};
