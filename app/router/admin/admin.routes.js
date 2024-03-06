const { CategoryRouter } = require("./category");
const { Excel } = require("./excel.router");
const {productRouter} = require("./product.router");
const { SliderRouter } = require("./slider.router");
const { AdminApiTransactionRouter } = require("./transaction");

const router = require("express").Router();

router.use(Excel)
router.use(SliderRouter);
router.use("/products",productRouter);
router.use("/category" , CategoryRouter);
router.use("/transactions" , AdminApiTransactionRouter)
module.exports = {
  AdminRouter: router,
};
