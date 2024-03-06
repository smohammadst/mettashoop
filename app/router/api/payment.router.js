const { ProductController } = require("../../http/controller/admin/product.controller");
const {
  PaymentController,
} = require("../../http/controller/api/payment.controller");
const {
  VerifyAccessToken,
  checkRole,
} = require("../../http/middleware/checkLogin");

const router = require("express").Router();
/**
 * @swagger
 * tags:
 *  name:   Payment
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          addBasket:
 *              type:   object
 *              required:
 *              -   basket
 *              properties:
 *                  basket:
 *                      type:   object
 */
/**
 * @swagger
 * /payment/payment:
 *  post:
 *    tags:   [Payment]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/addBasket'
 *    responses:
 *      201:
 *        description: success
 */
router.post("/payment", VerifyAccessToken, PaymentController.PaymentGateway);

router.get("/verify", PaymentController.verifyPayment);

/**
 * @swagger
 * /payment/listPayment:
 *  get:
 *    tags: [Payment]
 *    responses:
 *      200:
 *        descriptions: get All Payment
 */

router.get("/listPayment", VerifyAccessToken, PaymentController.getAllPayment);

router.post(
  "/sendProduct",
  VerifyAccessToken,
  // checkRole("ADMIN"),
  PaymentController.sendProduct
);

router.get(
  "/productPurchased",
  VerifyAccessToken,
  // checkRole("ADMIN"),
  PaymentController.productPurchased
);


/**
 * @swagger
 * /payment/getAllSaleProduct:
 *  get:
 *    tags: [Payment]
 *    responses:
 *      200:
 *        descriptions: get All Payment
 */
router.get(
  "/getAllSaleProduct",
  VerifyAccessToken,
  // checkRole("ADMIN"),
  PaymentController.getAllPayment
);

/**
 * @swagger
 * /payment/delete:
 *  delete:
 *    tags: [Payment]
 *    responses:
 *      200:
 *        descriptions: delete All Payment
 */
router.delete(
  "/delete",
  VerifyAccessToken,
  // checkRole("ADMIN"),
  PaymentController.deleteData
);

router.post("/maliat", PaymentController.maliat);

router.post(
  "/updateBascket",
  VerifyAccessToken,
  ProductController.updateBascket
)

module.exports = {
  ApiPayment: router,
};
