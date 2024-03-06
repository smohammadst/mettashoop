const {
  VerifyAccessToken,
  checkRole,
} = require("../http/middleware/checkLogin");
const { AdminRouter } = require("./admin/admin.routes");
const { AddressRouter } = require("./api/addres.router");
const { BasketRouter } = require("./api/basket.router");
const { categoryRouter } = require("./api/category.router");
const { CommentRouter } = require("./api/comment.router");
const {NotificationRouter} = require("./api/notification.router");
const { ApiPayment } = require("./api/payment.router");
const { productApiRouter } = require("./api/products.router");
const { sliderRouter } = require("./api/slider.router.router");
const { UserRouter } = require("./api/user.router");
const { authRouter } = require("./auth/auth.router");
const { torob } = require("./torob");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/torob", torob)
router.use("/address", VerifyAccessToken, AddressRouter);
router.use("/comment", VerifyAccessToken, CommentRouter);
router.use("/admin", VerifyAccessToken, AdminRouter);
router.use("/basket", VerifyAccessToken, BasketRouter);
router.use("/user", VerifyAccessToken, UserRouter);
router.use("/notifiaction", VerifyAccessToken, NotificationRouter)
router.use("/payment", ApiPayment);
router.use("/product", productApiRouter);
router.use("/category", categoryRouter);
router.use("/slider", sliderRouter);

module.exports = {
  allRouter: router,
};
