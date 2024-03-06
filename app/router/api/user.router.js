const { UserController } = require("../../http/controller/api/user.controller");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name:   userPanel
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          updateUserProfile:
 *              type:   object
 *              properties:
 *                  first_name:
 *                      type:   string
 *                  last_name:
 *                      type:   string
 *                  phone:
 *                      type:   string
 *                  address:
 *                      type:   string
 *                  postalCode:
 *                      type:   number
 */

/**
 * @swagger
 * /user/listLikeProduct:
 *  get:
 *    tags:   [userPanel]
 *    responses:
 *      201:
 *        description: success
 */

router.get("/listLikeProduct", UserController.getLikeProducts);

/**
 * @swagger
 * /user/getBasket:
 *  get:
 *    tags:   [userPanel]
 *    responses:
 *      201:
 *        description: success
 */

router.get("/getBasket", UserController.getUserBasket);

/**
 * @swagger
 * /user/getInformationUser:
 *  get:
 *    tags:   [userPanel]
 *    responses:
 *      201:
 *        description: success
 */
router.get("/getInformationUser", UserController.getInformationUser);

/**
 * @swagger
 * /user/updateUserProfile:
 *  patch:
 *    tags:   [userPanel]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/updateUserProfile'
 *    responses:
 *      201:
 *        description: success
 */

router.patch("/updateUserProfile", UserController.updateUserProfile);

/**
 * @swagger
 * /user/allComments:
 *  get:
 *    tags:   [userPanel]
 *    responses:
 *      201:
 *        description: success
 */

router.get("/allComments", UserController.getAllCommentOfUser);

module.exports = {
  UserRouter: router,
};
