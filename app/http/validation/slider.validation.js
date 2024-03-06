const Joi = require("@hapi/joi");
const createError = require("http-errors");
const sliderValidation = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .error(createError.BadRequest("عنوان دسته بندی صحیح نمیباشد")),
  category: Joi.string().error(
    createError.BadRequest("مقدار ارسال شده درست نمیباشد")
  ),
  discount: Joi.string().error(
    createError.BadRequest("مقدار ارسال شده درست نمیباشد")
  ),
  filename: Joi.string()
    .pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/)
    .error(createError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
  fileUploadPath: Joi.allow(),
});

module.exports = { sliderValidation };
