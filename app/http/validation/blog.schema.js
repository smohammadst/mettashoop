const Joi = require("@hapi/joi");
const createError = require("http-errors");
const createCategory = Joi.object({
    titleE : Joi.string().min(3).max(30).error(createError.BadRequest("عنوان دسته بندی صحیح نمیباشد")),
    titleF : Joi.string().min(3).max(30).error(createError.BadRequest("عنوان دسته بندی صحیح نمیباشد")),
    fileUploadPath : Joi.allow(),
    filename: Joi.string()
    .pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/)
    .error(createError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
});

module.exports = {
    createCategory
}