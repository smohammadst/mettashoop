const { UserModel } = require("../../model/user.model");
const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../module/constans");

function getToken(headers) {
  const [bearer, token] = headers?.authorization?.split(" ") || [];
  if (token && ["Bearer", "bearer"].includes(bearer)) return token;
  throw createHttpError.Unauthorized(
    "حساب کاربری شناسایی نشد وارد حساب کاربری خود شوید"
  );
}
async function VerifyAccessToken(req, res, next) {
  try {
    const headers = req.headers;
    const [bearer, token] = headers?.authorization?.split(" ") || [];
    if (token) {
      const result = JWT.verify(token, ACCESS_TOKEN_SECRET_KEY);
      const { phone } = result;
      const user = await UserModel.findOne({ phone });
      if (!user) return next(createHttpError.NotFound("کاربری یافت نشد"));
      req.user = user;
      return next();
    }
    return next(createHttpError.Unauthorized("وارد حساب کاربری خود شوید"));
  } catch (error) {
    next(error);
  }
}

function checkRole(role) {
  return function (req, res, next) {
    const user = req.user;
    if (user.Role.includes(role)) return next();
    throw createHttpError.Forbidden("شما به این آدرس دسترسی ندارید");
  };
}

module.exports = {
  VerifyAccessToken,
  checkRole,
};
