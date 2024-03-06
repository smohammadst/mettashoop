const createHttpError = require("http-errors");
const { UserModel } = require("../../model/user.model");
const JWT = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET_KEY,
} = require("./constans");
async function checkLogin(req, res, next) {
  try {
    const token = req.signedCookies["Token"];
    if (token) {
      const result = JWT.verify(token, ACCESS_TOKEN_SECRET_KEY);
      const { phone } = result;
      const user = await UserModel.findOne({ phone });
      if (!user) return next(createHttpError.NotFound("کاربری یافت نشد"));
      req.user = user;
      console.log("yes")
      return next();
    }
    return createHttpError.NotFound("کاربری یافت نشد");
  } catch (error) {
    next(error);
  }
}
async function checkAccessLogin(req, res, next) {
  try {
    const token = req.signedCookies["authorization"];
    if (token) {
      const user = await UserModel.findOne(
        { token },
        { basket: 0, password: 0, Products: 0, Courses: 0 }
      );
      if (user) {
        req.user = user;
        return res.redirect("/support");
      }
    }
    return next();
  } catch (error) {
    next(error);
  }
}
module.exports = {
  checkLogin,
  checkAccessLogin,
};
