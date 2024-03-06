const {
  AddressController,
} = require("../../http/controller/api/address.controller");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: address
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          createAddress:
 *              type:   object
 *              required:
 *              -   plaque
 *              -   address
 *              -   postalCode
 *              -   province
 *              -   city
 *              properties:
 *                  plaque:
 *                      type:   number
 *                  address:
 *                      type:   string
 *                  postalCode:
 *                      type:   number
 *                  province:
 *                      type:   string
 *                  city:
 *                      type:   string
 */

/**
 * @swagger
 * /address/create:
 *  post:
 *    tags:   [address]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/createAddress'
 *    responses:
 *      201:
 *        description: success
 */

router.post("/create", AddressController.addAddress);

/**
 * @swagger
 * /address/allAddress:
 *  get:
 *    tags:   [address]
 *    responses:
 *      201:
 *        description: success
 */
router.get("/allAddress", AddressController.getAllAddressUser);

module.exports = {
  AddressRouter: router,
};
