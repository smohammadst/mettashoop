const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: Role
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          permission:
 *              type:   object
 *              required:
 *              -   title
 *              properties:
 *                  title:
 *                      type:   string
 *                  description:
 *                      type:   string
 *                  permission:
 *                      type:   string
 *                      enum:
 *                      -   product
 *                      -   buy
 */

/**
 * @swagger
 * /role/listRole:
 *  get:
 *    tags:   [Role]
 *    responses:
 *      201:
 *        description: success
 */
router.get("/listRole");
