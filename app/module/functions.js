const bcrypt = require("bcrypt");
const moment = require("moment-jalali");
const JWT = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} = require("./constans");
const createHttpError = require("http-errors");
const path = require("path");
const { UserModel } = require("../model/user.model");

function generatorHashPassword(password) {
  const salt = bcrypt.genSaltSync(3);
  return bcrypt.hashSync(password, salt);
}

function SingAccessToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findOne({ _id: userId });
    const payload = {
      phone: user.phone,
    };
    console.log(payload);
    const option = {
      expiresIn: "1y",
    };
    JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, option, (err, token) => {
      if (err) reject(createHttpError.InternalServerError("خطای سرور"));
      resolve(token);
    });
  });
}

function SignRefreshToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId);
    const payload = {
      phone: user.phone,
    };
    const options = {
      expiresIn: "1y",
    };
    JWT.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, async (err, token) => {
      if (err) reject(createError.InternalServerError("خطای سروری"));
      resolve(token);
    });
  });
}
function VerifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err)
        reject(createHttpError.Unauthorized("وارد حساب کاربری خود شوید"));
      const { phone } = payload || {};
      const user = await UserModel.findOne({ phone }, { password: 0, otp: 0 });
      if (!user) reject(createHttpError.Unauthorized("حساب کاربری یافت نشد"));
      resolve(phone);
    });
  });
}
function generatorCodeRandom() {
  return Math.floor(Math.random() * 90000 + 10000);
}

function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ["", " ", "0", 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}

function deleteFileInPublic(fileAddress) {
  if (fileAddress) {
    const pathFile = path.join(__dirname, "..", "..", "public", fileAddress);
    if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
  }
}

function ListOfImagesFromRequest(files, fileUploadPath) {
  if (files.length > 0) {
    return files
      .map((file) => path.join(fileUploadPath, file.filename))
      .map((file) => file.replace(/\\/g, "/"));
  }
}

function setFeatures(body) {
  const { colors, width, weight, height, length } = body;
  let features = {};
  features.colors = colors;
  if (!isNaN(+width) || !isNaN(+height) || !isNaN(+weight) || !isNaN(+length)) {
    if (!width) features.width = 0;
    else features.width = +width;
    if (!height) features.height = 0;
    else features.height = +height;
    if (!weight) features.weight = 0;
    else features.weight = +weight;
    if (!length) features.length = 0;
    else features.length = +length;
  }
  return features;
}

function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

function calculateDiscount(price, discount) {
  return Number(price) - (Number(discount) / 100) * Number(price);
}

function convertDateMiladyToShams(date) {
  moment.locale("fa", { useGregorianParser: true });
  console.log(date);
  let result = moment(String(date)).format("YYYY-MM-DD").split("T");
  result = "" + result[0];
  return result;
}

function invoiceNumberGenerator() {
  return (
    moment().format("jYYYYjMMjDDHHmmssSSS") +
    String(process.hrtime()[1]).padStart(9, 0)
  );
}



module.exports = {
  generatorCodeRandom,
  SingAccessToken,
  SignRefreshToken,
  VerifyRefreshToken,
  deleteInvalidPropertyInObject,
  copyObject,
  setFeatures,
  ListOfImagesFromRequest,
  generatorHashPassword,
  deleteFileInPublic,
  invoiceNumberGenerator,
  calculateDiscount,
  convertDateMiladyToShams,
};
