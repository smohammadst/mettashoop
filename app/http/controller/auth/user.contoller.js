const { UserModel } = require("../../../model/user.model");
const { StatusCodes } = require("http-status-codes");
const {
  generatorHashPassword,
  generatorCodeRandom,
  SingAccessToken,
  SignRefreshToken,
  VerifyRefreshToken,
} = require("../../../module/functions");
const createError = require("http-errors");
const Controller = require("../controller");
const bcrypt = require("bcrypt");
const MelipayamakApi = require('melipayamak');
const username = '090000000';
const password = '****';
const api = new MelipayamakApi(username, password);

class AuthController extends Controller {
  async register(req, res, next) {
    try {
      const { first_name, last_name, phone, password } = req.body;
      const findUser = await this.exitUser(phone);
      if (findUser)
        throw createError.Conflict("کاربری با این ایمل قبلا ثبت نام شده است");
      const code = generatorCodeRandom();
      let otp = {
        code,
        expiresIn: new Date().getTime() + 120000,
      };
      if (phone == "09133243570" || phone == "09395356683" || phone == "09125082329" || phone == "09358484606" || phone == "09353040700") {
        await UserModel.create({
          first_name,
          last_name,
          password: generatorHashPassword(password),
          phone,
          otp,
          Role: "ADMIN"
        });
        return res.status(StatusCodes.CREATED).json({
          data: {
            statusCode: StatusCodes.CREATED,
            message: "شما با موفقیت ثبت نام شدید",
          },
        });
      }
      const result = await UserModel.create({
        first_name,
        last_name,
        password: generatorHashPassword(password),
        phone,
        otp,
      });
      if (!result)
        throw StatusCodes.INTERNAL_SERVER_ERROR(
          "سرور با مشکل مواجه شده است دوباره تلاش کنید"
        );
      return res.status(StatusCodes.CREATED).json({
        data: {
          statusCode: StatusCodes.CREATED,
          message: "شما با موفقیت ثبت نام شدید",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async loginForPassword(req, res, next) {
    try {
      const { phone, password } = req.body;
      let bool = false
      const errorMessage = createError.Unauthorized(
        "پسوورد یا شماره موبایل اشتباه وارد شده است"
      );
      const findUser = await this.exitUser(phone);
      if (!findUser) throw errorMessage;
      const comparPassword = bcrypt.compareSync(password, findUser.password);
      if (!comparPassword) throw errorMessage;
      const token = await SingAccessToken(findUser._id);
      const refreshToken = await SignRefreshToken(findUser._id);
      if (findUser.Role == "ADMIN") bool = true
      await this.cookie(res, findUser, token);
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          token,
          refreshToken,
          bool,
          message: "ورود شما موفقیت آمیز بود",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async loginForCode(req, res, next) {
    try {
      const { phone, code } = req.body;
      const result = await this.validationCode(res, phone, code);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async cookie(res, user, token) {
    res.cookie("authorization", token, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1200000),
    });
    user.token = token;
    user.save();
  }
  async exitUser(phone) {
    const result = await UserModel.findOne({ phone });
    return result;
  }
  async resetCode(req, res, next) {
    try {
      const { phone } = req.body;
      const code = await this.generatorCode(phone);
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async generatorCode(phone) {
    const code = generatorCodeRandom();
    const user = await this.exitUser(phone);
    if (!user) throw createError.BadRequest("شماره ثبت نشده است");
    const sms = api.sms()
    const to = phone;
    const from = "50004001040700";
    const text = `کد ورود یک بار مصرف شما :${code}میباشد`;
    sms.send(to, from, text).then(e => {
      console.log(e)
    }).catch(err => {
      console.log("err" + err)
    })
    let otp = {
      code,
      expiresIn: new Date().getTime() + 120000,
    };
    const result = await UserModel.updateOne({ phone }, { $set: { otp } });
    if (result.modifiedCount == 0)
      throw createError.InternalServerError(
        "سرور با مشکل مواجه شده است دوباره تلاش کنید"
      );
    return code;
  }
  async validationSendCode() {
    try {
      const { phone } = req.params;
      const { code } = req.body;
      const result = await this.validationCode(phone, code);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async validationCode(res, phone, code) {
    let bool = false;
    const findUser = await this.exitUser(phone);
    if (!findUser) throw StatusCodes.NOT_FOUND("کاربری یافت نشد");
    if (+code !== findUser.otp.code)
      throw createError.Unauthorized("کد ارسال شده صحیح نمی باشد");
    const date = new Date().getTime();
    if (findUser.otp.expireIn < date)
      throw createError.Unauthorized("کد شما منقضی شده است");
    const token = await SingAccessToken(findUser._id);
    const refreshToken = await SignRefreshToken(findUser._id);
    if (findUser.Role == "ADMIN") bool = true
    await this.cookie(res, findUser, token);
    return {
      data: {
        statusCode: StatusCodes.OK,
        message: "ورود شما موفقیت آمیز بود",
        token,
        refreshToken,
        bool
      },
    };
  }
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const phone = await VerifyRefreshToken(refreshToken);
      const user = await UserModel.findOne({ phone });
      let bool = false;
      if (user.phone == "09133243570") bool = true;
      const accessToken = await SingAccessToken(user._id);
      await this.cookie(res, user, accessToken);
      console.log(bool);
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          accessToken,
          bool
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword, repeatPassword, phone } = req.body;
      const findUser = await this.exitUser(phone);
      if (!findUser)
        throw createError.Unauthorized(
          "پسوورد یا شماره موبایل اشتباه وارد شده است"
        );
      const comparPassword = bcrypt.compareSync(oldPassword, findUser.password);
      if (!comparPassword)
        throw createError.BadRequest("پسوورد قدیمی شما اشتباه میباشد");
      if (newPassword !== repeatPassword)
        throw createError.BadRequest("پسوورد ها باهم مغایرت دارند");
      const result = await UserModel.updateOne(
        { phone },
        { password: generatorHashPassword(newPassword) }
      );
      if (result.modifiedCount == 0)
        throw createError.InternalServerError("دوباره تلاش کنید");
      return res.status(StatusCodes.OK).json({
        data: {
          statusCode: StatusCodes.OK,
          message: "رمز با موفقیت تغییر پیدا کرد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
  async capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
}

module.exports = {
  AuthController: new AuthController(),
};
