const createHttpError = require("http-errors");
const { ProductModel } = require("../../../model/products");
const { StatusCodes } = require("http-status-codes");
const { Types, default: mongoose, isValidObjectId } = require("mongoose");
const {
  ListOfImagesFromRequest,
  setFeatures,
  deleteInvalidPropertyInObject,
  deleteFileInPublic,
  copyObject,
} = require("../../../module/functions");
const Controller = require("../controller");
const { UserModel } = require("../../../model/user.model");
const { CategoryModel } = require("../../../model/categories.model");

const ProductBlackList = {
  BOOKMARKS: "bookmarks",
  LIKES: "likes",
  DISLIKES: "dislikes",
  COMMENTS: "comments",
  SUPPLIER: "supplier",
  WEIGHT: "weight",
  WIDTH: "width",
  LENGTH: "length",
  HEIGHT: "height",
  BRAND: "brand",
  IMPORTANTFEATURES: "ImportantFeatures",
};
Object.freeze(ProductBlackList);
let number = 260;
class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const barcode = this.pad(number, 5)
      const images = ListOfImagesFromRequest(
        req?.files || [],
        req.body.fileUploadPath
      );
      const {
        title,
        text,
        short_text,
        category,
        tags,
        count,
        price,
        discount,
        status,
        colors,
        brand,
        property,
        ImportantFeatures,
      } = req.body;
      const findCategory = await CategoryModel.findOne({ titleE: category });
      if (!findCategory)
        throw createHttpError.NotFound(
          "شناسه ی ارسال شده ی دسته بندی اشتباه می باشد"
        );
      let features = setFeatures(req.body);
      const parse1 = JSON.parse(property);
      const parse2 = JSON.parse(ImportantFeatures);
      parse2.colors = colors;
      parse2.brand = brand.toLowerCase();
      let theFinalPrice = 0;
      if (discount != 0 && discount > 0) {
        const result = (price * discount) / 100;
        theFinalPrice = price - result;
      } else {
        theFinalPrice = price;
      }
      const product = await ProductModel.create({
        title,
        text,
        short_text,
        category,
        tags,
        count,
        price,
        discount,
        images,
        features,
        status,
        theFinalPrice,
        property: parse1,
        ImportantFeatures: parse2,
        cat: findCategory.titleF,
        barcode
      });
      if (!product)
        throw createHttpError.InternalServerError(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      number++
      return res.status(StatusCodes.CREATED).json({
        data: {
          statusCode: StatusCodes.CREATED,
          message: "محصول با موفقیت ثبت شد",
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async removeProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProduct(id);
      if (!product) throw createHttpError.NotFound("محصولی یافت نشد");
      const removeProduct = await ProductModel.deleteOne({ _id: product._id });
      if (removeProduct.deletedCount == 0)
        throw createHttpError.InternalServerError(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          message: "محصول با موفقیت حذف شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const data = copyObject(req.body);
      const findCategory = await CategoryModel.findOne({
        titleE: data.category,
      });
      if (!findCategory)
        throw createHttpError.NotFound(
          "شناسه ی ارسال شده ی دسته بندی اشتباه می باشد"
        );
      data.images = ListOfImagesFromRequest(
        req?.files || [],
        req.body.fileUploadPath
      );
      data.features = setFeatures(req.body);
      let blackListFields = Object.values(ProductBlackList);
      deleteInvalidPropertyInObject(data, blackListFields);
      if (data.price) {
        let theFinalPrice = 0;
        if (data.discount != 0 && data.discount > 0) {
          const result = (data.price * data.discount) / 100;
          theFinalPrice = data.price - result;
        } else {
          theFinalPrice = data.price;
        }
        data.theFinalPrice = theFinalPrice
      }
      const result = await ProductModel.updateOne({ _id: Types.ObjectId(id) }, { $set: data });
      console.log(result)
      if (result.modifiedCount == 0)
        throw createHttpError.InternalServerError(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          message: "محصول یا موفقیت بروزرسانی شد",
        },
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
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      let product = await ProductModel.findOne({ _id: id })
        .populate({
          path: "comments.user",
          select: "first_name",
        })
        .populate({
          path: "comments.answers.user",
          select: "first_name",
        });
      if (!product) throw createHttpError.NotFound("محصولی یافت نشد");
      const countComment = product.comments.length;
      let countAnswer = 0;
      product.comments.forEach((e) => {
        countAnswer += e.answers.length;
      });
      let sumComments = countAnswer + countComment;
      this.averageStar(product);
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          product,
          sumComments,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
  async getFiveProduct(req, res, next) {
    try {
      const { search } = req.query || "";
      let products;
      let searchStr = await this.capitalizeFirstLetter(search.toLowerCase());
      console.log(searchStr);
      if (search) {
        products = await ProductModel.find({
          title: { $regex: ".*" + searchStr + ".*", $options: "i" },
          tags: { $regex: ".*" + searchStr + ".*", $options: "i" },
          text: { $regex: ".*" + searchStr + ".*", $options: "i" },
          status: true,
        })
          .sort({ createdAt: 1 })
      } else {
        products = [];
      }
      return res.status(StatusCodes.OK).json({
        data: {
          products,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllProduct(req, res, next) {
    try {
      const { search } = req.query || "";
      let products;
      let searchStr = await this.capitalizeFirstLetter(search.toLowerCase());
      if (search) {
        products = await ProductModel.find({
          title: { $regex: ".*" + searchStr + ".*", $options: "i" },
          tags: { $regex: ".*" + searchStr + ".*", $options: "i" },
          status: true,
        }).sort({ theFinalPrice: -1 });
      } else {
        products = [];
      }
      return res.status(StatusCodes.OK).json({
        data: {
          products,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllProductByCategory(req, res, next) {
    try {
      const { titleE } = req.params;
      if (titleE == "bestSale") {
        const products = await this.bestselling();
        return res.status(StatusCodes.OK).json({
          statusCode: StatusCodes.OK,
          products,
        });
      }
      const products = await ProductModel.find({ category: titleE })
        .sort({
          // createdAt: "-1",
          theFinalPrice: -1
        })
        .limit(10);
      if (!products) throw createHttpError.NotFound("کالایی پیدا نشد");
      for (var i = 0; i < products.length; i++) {
        await this.averageStar(products[i]);
      }
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        products,
      });
    } catch (error) {
      next(error);
    }
  }
  async getProductsByCategory(req, res, next) {
    try {
      const { titleE } = req.params;
      if (titleE == "bestSale") {
        const products = await this.bestsellingAll();
        for (var i = 0; i < products.length; i++) {
          await this.averageStar(products[i]);
        }
        return res.status(StatusCodes.OK).json({
          statusCode: StatusCodes.OK,
          products,
        });
      }
      const products = await ProductModel.find({ category: titleE }).sort({ theFinalPrice: -1 });
      if (!products) throw createHttpError.NotFound("کالایی پیدا نشد");
      for (var i = 0; i < products.length; i++) {
        await this.averageStar(products[i]);
      }
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        products,
      });
    } catch (error) {
      next(error);
    }
  }
  async findCategory(titleE) {
    const findCategory = await CategoryModel.findOne({ titleE });
    if (!findCategory)
      throw createHttpError.NotFound("شناسه ی ارسال شده درست نمی باشد");
  }
  async findProduct(id) {
    const product = await ProductModel.findOne({ _id: id })
    return product;
  }
  async findUserAndProduct(id, userID) {
    const findUser = await UserModel.findById(userID);
    const product = await this.findProduct(id);
    if (!findUser) throw createHttpError.NotFound("کاربری یافت نشد");
    if (!product) throw createHttpError.NotFound("محصولی یافت نشد");
  }
  async likeProduct(req, res, next) {
    try {
      const { productID } = req.params;
      const user = req.user;
      await this.findUserAndProduct(productID, user);
      let likedproduct = await ProductModel.findOne({
        _id: productID,
        likes: user._id,
      });
      const updateQuery = likedproduct
        ? { $pull: { likes: user._id } }
        : { $push: { likes: user._id } };
      await ProductModel.updateOne({ _id: productID }, updateQuery);
      let message;
      if (!likedproduct) {
        message = "پسندیدن محصول با موفقیت انجام شد";
      } else message = "پسندیدن محصول لغو شد";
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.CREATED,
          message,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async bestselling() {
    const products = await ProductModel.find({});
    const listSale = [];
    products.forEach(async (e) => {
      listSale.push(e.sale);
    });
    const maxSale = Math.max(...listSale);
    const minSale = Math.min(...listSale);
    let product;
    product = await ProductModel.find({
      sale: { $in: [minSale, maxSale] },
    })
      .sort({ sale: 1 })
      .limit(10);
    // for (var i = 0; i < result.length; i++) {
    //     await ProductController.averageStar(product[i]);
    // }
    return product;
  }
  async bestsellingAll() {
    const products = await ProductModel.find({});
    const listSale = [];
    products.forEach(async (e) => {
      listSale.push(e.sale);
    });
    const maxSale = Math.max(...listSale);
    const minSale = Math.min(...listSale);
    let product;
    product = await ProductModel.find({
      sale: { $in: [minSale, maxSale] },
    }).sort({ sale: -1 });
    // for (var i = 0; i < result.length; i++) {
    //   await ProductController.averageStar(product[i]);
    // }
    return product;
  }
  async change(req, res, next) {
    try {
      const listProduct = [" Xiaomi Mi 2K Gaming Monitor 27 XMMNT27HQ "]
      for (var i = 0; i < listProduct.length; i++) {
        console.log(listProduct);
        console.log(listProduct[i]);
        const productId = await ProductModel.findOne({ title: listProduct[i] });
        console.log(productId)
        const product = await ProductModel.updateOne({ _id: productId._id }, { $set: { short_text: "گیمینگ" } });
        if (product.modifiedCount == 0) throw createHttpError.InternalServerError("fsdfdsfsdgdfsdfjkbdgvnbgukdfjgh rbfgs")
      }
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.CREATED,
        },
      });
    } catch (error) {
      next(error)
    }
  }
  async getId(req, res, next) {
    try {
      const { id, title } = req.body;
      const product = await ProductModel.updateOne({ _id: id }, { $set: { title } })
      return res.status(StatusCodes.OK).json({
        data: {
          message: true
        }
      })
    } catch (error) {
      next(error)
    }
  }
  async updateBascket(req, res, next) {
    try {
      const { listProduct } = req.body;
      let updateListProduct = [];
      for (var i = 0; i < listProduct.length; i++) {
        const product = await ProductModel.findOne({ _id: listProduct[i] });
        if (product) updateListProduct.push(product);
      }
      return res.status(200).json({
        updateListProduct
      })
    } catch (error) {
      next(error)
    }
  }
  pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
}
module.exports = {
  ProductController: new ProductController(),
};