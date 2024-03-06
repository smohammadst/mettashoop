const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { SliderModel } = require("../../../model/slider.mode");
const {
  deleteFileInPublic,
  ListOfImagesFromRequest,
} = require("../../../module/functions");
const { sliderValidation } = require("../../validation/slider.validation");
const { ProductModel } = require("../../../model/products");
const Controller = require("../controller");
class SliderController extends Controller{
  async addSlider(req, res, next) {
    try {
      const sliderDataBody = await sliderValidation.validateAsync(req.body);
      const images = ListOfImagesFromRequest(
        req?.files || [],
        req.body.fileUploadPath
      );
      const { title, category, discount } = sliderDataBody;
      const link = `/AllProducts/${category}/${discount}`;
      const createSlider = await SliderModel.create({
        title,
        image: images,
        link,
      });
      if (!createSlider)
        throw createHttpError.InternalServerError(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      return res.status(StatusCodes.CREATED).json({
        data: {
          statusCode: StatusCodes.CREATED,
          message: "اسلاید با موفقیت ثبت شد",
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async getSlider(req, res, next) {
    try {
      const result = await SliderModel.find({})
        .sort({ createdAt: "desc" })
        .limit(5);
      return res.status(StatusCodes.OK).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }
  async removeSlider(req, res, next) {
    try {
      const { id } = req.params;
      const findSlider = await SliderModel.findOne({
        _id: id,
      });
      if (!findSlider) throw createHttpError.NotFound("اسلایدری یافت نشد");
      const removeSlider = await SliderModel.deleteOne({
        _id: findSlider._id,
      });
      if (removeSlider.deletedCount == 0)
        throw createHttpError.InternalServerError("دوباره تلاش کنید");
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      next(error);
    }
  }
  averageStar(product) {
    let sumStar = 0;
    let lengthStar = 0;
    lengthStar += product.comments.length;
    product.comments.forEach((e) => {
      sumStar += e.star;
    });
    const averageStar = sumStar / lengthStar;
    if (averageStar == NaN) averageStar = 0;
    if (averageStar == Infinity) averageStar = 0;
    product.sumStar = averageStar;
  }
  async sendPageSlider(req, res, next) {
    try {
      const {discount , titleE} = req.params;
      if(+discount === 0){
        const result = await ProductModel.find({
          short_text:titleE,
        });
        if (!result) throw createHttpError.NotFound("محصولی یافت نشد");
        for (var i = 0; i < result.length; i++) {
          await this.averageStar(result[i]);
        }
        return res.status(StatusCodes.OK).json({
          data: {
            statusCode: StatusCodes.OK,
            result,
          },
        });
      }
      const result = await ProductModel.find({
        category: titleE,
        discount: { $in: [7, parseInt(discount)] },
      });
      if (!result) throw createHttpError.NotFound("محصولی یافت نشد");
      for (var i = 0; i < result.length; i++) {
        await this.averageStar(result[i]);
      }
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
}
module.exports = {
  SliderController: new SliderController(),
};

//
