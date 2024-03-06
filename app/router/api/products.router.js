const {
  ProductController,
} = require("../../http/controller/admin/product.controller");
const { VerifyAccessToken } = require("../../http/middleware/checkLogin");

const router = require("express").Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *        gpc:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 */
/**
 * @swagger
 *  /product/list:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: get all products
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: text for search in title, text, short_text of (product)
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/list", ProductController.getAllProduct);
/**
 * @swagger
 *  /product/fiveProduct:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: get all products
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: text for search in title, text, short_text of (product)
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/fiveProduct", ProductController.getFiveProduct);
/**
 * @swagger
 *  /product/getProduct/{id}:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: delete One products
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: objectId of product
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/getProduct/:id", ProductController.getProductById);

/**
 * @swagger
 *  /product/listAllProductCat/{titleE}:
 *      get:
 *          tags: [Product(AdminPanel)]
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
router.get(
  "/listAllProductCat/:titleE",
  ProductController.getAllProductByCategory
);

/**
 * @swagger
 *  /product/listAllProductByCat/{titleE}:
 *      get:
 *          tags: [Product(AdminPanel)]
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
router.get(
  "/listAllProductByCat/:titleE",
  ProductController.getProductsByCategory
);


module.exports = {
  productApiRouter: router,
};
