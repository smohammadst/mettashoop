const createError = require("http-errors");
const { StatusCodes: HttpStatus, StatusCodes } = require("http-status-codes");
const { CategoryModel } = require("../../../model/categories.model");
const { createCategory } = require("../../validation/blog.schema");
const path = require("path");
const Controller = require("../controller");
const { ProductModel } = require("../../../model/products");

class CategoryController extends Controller {
  async addCategory(req, res, next) {
    try {
      const categoryDataBody = await createCategory.validateAsync(req.body);
      req.body.image = path.join(
        categoryDataBody.fileUploadPath,
        categoryDataBody.filename
      );
      req.body.image = req.body.image.replace(/\\/g, "/");
      const image = req.body.image;
      const { titleE, titleF } = categoryDataBody;
      const findCategory = await CategoryModel.findOne({ titleE, titleF });
      if (findCategory) throw createError.Conflict("همچین اسمی وجود دارد");
      const category = await CategoryModel.create({ titleE, titleF, image });
      if (!category) throw createError.InternalServerError("خطای داخلی");
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "دسته بندی با موفقیت افزوده شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeCategory(req, res, next) {
    try {
      const { id } = req.body;
      const category = await this.checkExistCategory(id);
      const deleteResult = await CategoryModel.deleteMany({
        $or: [{ _id: category._id }, { parent: category._id }],
      });
      if (deleteResult.deletedCount == 0)
        throw createError.InternalServerError("حدف دسته بندی انجام نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "حذف دسته بندی با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async editCategoryTitle(req, res, next) {
    try {
      const {id} = req.params;
      const { titleE,titleF } = req.body;
      const resultOfUpdate = await CategoryModel.updateOne(
        { _id: id },
        { $set: { titleE, titleF } }
      );
      if (resultOfUpdate.modifiedCount == 0)
        throw createError.InternalServerError("به روزرسانی انجام نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "به روز رسانی با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategory(req, res, next) {
    try {
      const categories = await CategoryModel.find({ __v: 0 });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          categories,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryByTitle(req, res, next) {
    try {
      const { title } = req.body;
      const category = await CategoryModel.findOne({ title });
      if (!category) throw createError.NotFound("شناسه وارد شده صحیح نمیباشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateCat(req, res, next) {
    try {
      const { titleE } = req.params;
      const products = await ProductModel.find({ category: titleE });
      let category = await CategoryModel.findOne({ titleE });
      if (!products && category) {
        category.cat.name = "";
        category.cat.range = {};
        category.cat.feature = {};
        const cat = category.cat;
        return res.status(StatusCodes.OK).json({
          data: {
            statusCode: StatusCodes.OK,
            cat,
          },
        });
      }
      const rangePrice = [];
      const feature = {};
      function removeDuplicates(arr) {
        return arr.filter((item, index) => arr.indexOf(item) === index);
      }
      products.forEach(async (product) => {
        rangePrice.push(product.theFinalPrice);
        for (let [key, value] of Object.entries(product.ImportantFeatures)) {
          let listKey = [];
          if (feature[`${key}`]) {
            let valueKey = feature[`${key}`];
            listKey.push(...valueKey);
            feature[`${key}`] = [value];
          }
          feature[`${key}`] = [...listKey, value];
        }
        for (let [key, value] of Object.entries(feature)) {
          feature[`${key}`] = removeDuplicates(feature[`${key}`]);
        }
      });
      let listColors = [];
      if (feature.colors) {
        feature.colors.forEach((e) => {
          e.forEach((color) => {
            listColors.push(color);
          });
        });
        feature.colors = removeDuplicates(listColors);
      }
      const min = Math.min(...rangePrice);
      const max = Math.max(...rangePrice);
      category.cat.name = category.titleF;
      category.cat.range = { min, max };
      category.cat.feature = feature;
      const cat = category.cat;
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          cat,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async checkExistCategory(titleE) {
    const category = await CategoryModel.findOne({ titleE });
    console.log(category);
    if (!category) throw createError.NotFound("دسته بندی یافت نشد");
    return category;
  }
}
module.exports = {
  CategoryController: new CategoryController(),
};
