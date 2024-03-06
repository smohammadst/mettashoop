const {
  BasketController,
} = require("../../http/controller/api/basket.contoroller");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name:   Basket
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
 * /basket/add_basket:
 *  post:
 *    tags:   [Basket]
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

router.post("/add_basket", BasketController.addBasket);

module.exports = {
  BasketRouter: router,
};
