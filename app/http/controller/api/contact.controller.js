const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { ContactModel } = require("../../../model/contact.model");
const Controller = require("../controller");

class Contact extends Controller {
  async addContact(req, res, next) {
    try {
      const { fullName, phone, title, message } = req.body;
      const result = await ContactModel.create(fullName, phone, title, message);
      if (!result)
        throw createHttpError.InternalServerError(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      return res.status(StatusCodes.CREATED).json({
        data: {
          statusCode: StatusCodes.CREATED,
          message: "پیام شما ارسال شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllContact(req, res, next) {
    try {
      const result = await ContactModel.find({}).sort({ createdAt: "desc" });
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
  async getNotReadContact(req, res, next) {
    try {
      const result = await ContactModel.find({ status: false }).sort({
        createdAt: "desc",
      });
      if (!result)
        return res.status(StatusCodes.NOT_FOUND).json({
          data: {
            statusCode: StatusCodes.NOT_FOUND,
            message: "پیامی وجود ندارد",
          },
        });
      return res.status(StatusCodes.OK).json({
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeContact(req, res, next) {
    try {
      const { id } = req.params;
      const findContact = await ContactModel.findById(id);
      if (!findContact) throw createHttpError.NotFound("پیامی وجود ندارد");
      const result = await ContactModel.deleteOne({ id });
      if (result.deletedCount == 0)
        throw createHttpError.InternalServerError(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          message: "پیام با موفقیت حذف گردید",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async findContactByID(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ContactModel.findById(id);
      if (!result) throw createHttpError.NotFound("پیامی پیدا نشد");
      return res.status(StatusCodes.OK).json({ data: { result } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  ContactController: new Contact(),
};
