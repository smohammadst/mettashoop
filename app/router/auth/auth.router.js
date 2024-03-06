const {
  AddressController,
} = require("../../http/controller/api/address.controller");
const { AuthController } = require("../../http/controller/auth/user.contoller");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: Auth
 *  descriptions:   login register
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          loginPassword:
 *            type: object
 *            required:
 *            - phone
 *            - password
 *            properties:
 *              phone:
 *                type: string
 *              password:
 *                type: string
 *          changePassword:
 *            type: object
 *            required:
 *            - oldPassword
 *            - newPassword
 *            - repeatPassword
 *            - phone
 *            properties:
 *              oldPassword:
 *                type: string
 *              repeatPassword:
 *                type: string
 *              newPassword:
 *                type: string
 *              phone:
 *                type: string
 *          register:
 *              type:   object
 *              required:
 *              -   first_name
 *              -   last_name
 *              -   phone
 *              -   password
 *              properties:
 *                  first_name:
 *                      type:   string
 *                  last_name:
 *                      type:   string
 *                  phone:
 *                      type:   string
 *                  password:
 *                      type:   string
 *          login:
 *              type:   object
 *              required:
 *              -   phone
 *              -   code
 *              properties:
 *                  phone:
 *                      type:   string
 *                  code:
 *                      type:   number
 *          resetPassword:
 *            type:   object
 *            required:
 *            -   phone
 *            properties:
 *              phone:
 *                type: string
 *          refreshToken:
 *            type: object
 *            required:
 *            - refreshToken
 *            properties:
 *              refreshToken:
 *                type: string
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *    tags:   [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/register'
 *    responses:
 *      201:
 *        description: success
 */

router.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:   [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/login'
 *    responses:
 *      201:
 *        description: success
 */
router.post("/login", AuthController.loginForCode);

/**
 * @swagger
 * /auth/Code:
 *  post:
 *    tags:   [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/resetPassword'
 *    responses:
 *      201:
 *        description: success
 */
router.post("/Code", AuthController.resetCode);

/**
 * @swagger
 * /auth/refreshToken:
 *  post:
 *    tags:   [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/refreshToken'
 *    responses:
 *      201:
 *        description: success
 */
router.post("/refreshToken", AuthController.refreshToken);

/**
 * @swagger
 * /auth/changePassword:
 *  post:
 *    tags:   [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/changePassword'
 *    responses:
 *      201:
 *        description: success
 */

router.post("/changePassword", AuthController.changePassword);

/**
 * @swagger
 * /auth/loginPassword:
 *  post:
 *    tags:   [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/loginPassword'
 *    responses:
 *      201:
 *        description: success
 */

router.post("/loginPassword", AuthController.loginForPassword);

module.exports = {
  authRouter: router,
};
