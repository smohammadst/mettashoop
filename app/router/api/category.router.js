const {
  CategoryController,
} = require("../../http/controller/admin/category.controller");

const router = require("express").Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          updateCat:
 *              type: object
 *              required:
 *                  -   titleE
 *              properties:
 *                  titleE:
 *                      type: string
 *                      description: the title of category
 */

/**
 * @swagger
 *  /category/all:
 *      get:
 *          tags: [Category(AdminPanel)]
 *          summary: get All Categories
 *          responses:
 *              200:
 *                  description: success
 */

router.get("/all", CategoryController.getAllCategory);

/**
 * @swagger
 *  /category/updateCat/{titleE}:
 *      get:
 *          tags: [Category(AdminPanel)]
 *          summary: delete One products
 *          parameters:
 *              -   in: path
 *                  name: titleE
 *                  type: string
 *                  description: objectId of product
 *          responses:
 *              200:
 *                  description: success
 */

router.get("/updateCat/:titleE", CategoryController.updateCat);

module.exports = {
  categoryRouter: router,
};
