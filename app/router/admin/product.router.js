const {
  ProductController,
} = require("../../http/controller/admin/product.controller");
const { stringToArray } = require("../../http/middleware/stringToArray");
const { uploadFile } = require("../../module/fileUpload");

const router = require("express").Router();
/**
 * @swagger
 *  components:
 *      schemas:
 *          Color:
 *              type: array
 *              items:
 *                  type: string
 *                  enum:
 *                      -   black
 *                      -   white
 *                      -   gray
 *                      -   red
 *                      -   blue
 *                      -   green
 *                      -   orange
 *                      -   purple
 *                      -   pink
 *                      -   yellow
 *                      -   brown
 * 
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *        chanePrice:
 *                type: object
 *                properties:
 *                    barcode:
 *                        type: string
 *                    price:
 *                        type: number
 *                    discount:
 *                        type: number
 *        nameSlider:
 *                type: object
 *                properties:
 *                    productID:
 *                        type: array
 *                    nameSlider:
 *                        type: string
 *        getID:
 *               type:  object
 *               properties:
 *                  title:
 *                      type: string 
 *                  id:
 *                      type: string
 *        star:
 *              type: object
 *              properties:
 *                  star:
 *                      type: number
 *        getProduct:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *        Edit-Product:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: عنوان محصول
 *                  short_text:
 *                      type: string
 *                      description: the title of product
 *                      example: متن کوتاه شده تستی
 *                  text:
 *                      type: string
 *                      description: the title of product
 *                      example: متن بلد تستی
 *                  tags:
 *                      type: array
 *                      description: the title of product
 *                  category:
 *                      type: string
 *                      description: the title of product
 *                      example: 6279e994c1e47a98d0f356d3
 *                  price:
 *                      type: string
 *                      description: the title of product
 *                      example: 2500000
 *                  discount:
 *                      type: string
 *                      description: the title of product
 *                      example: 20
 *                  count:
 *                      type: string
 *                      description: the title of product
 *                      example: 100
 *
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                      example: 0
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                      example: 0
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                      example: 0
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 *
 *        Product:
 *              type: object
 *              required:
 *                  -   title
 *                  -   short_text
 *                  -   text
 *                  -   tags
 *                  -   category
 *                  -   price
 *                  -   discount
 *                  -   count
 *                  -   brand
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: عنوان محصول
 *                  short_text:
 *                      type: string
 *                      description: the title of product
 *                      example: متن کوتاه شده تستی
 *                  text:
 *                      type: string
 *                      description: the title of product
 *                      example: متن بلد تستی
 *                  tags:
 *                      type: array
 *                      description: the title of product
 *                  category:
 *                      type: string
 *                      description: the title of product
 *                      example: 6279e994c1e47a98d0f356d3
 *                  price:
 *                      type: string
 *                      description: the title of product
 *                      example: 2500000
 *                  discount:
 *                      type: string
 *                      description: the title of product
 *                      example: 20
 *                  count:
 *                      type: string
 *                      description: the title of product
 *                      example: 100
 *                  status:
 *                      type:   boolean
 *                      description:    true/false
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  property:
 *                    type: object
 *                  ImportantFeatures:
 *                    type: object
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                      example: 0
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                      example: 0
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                      example: 0
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  brand:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 */

/**
 * @swagger
 *  /admin/products/add:
 *      post:
 *          tags: [Product(AdminPanel)]
 *          summary: create and save product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *
 *          responses:
 *              201:
 *                  description: created new Product
 */

router.post(
  "/add",
  uploadFile.array("images", 10),
  stringToArray("tags", "colors"),
  ProductController.addProduct
);

/**
 * @swagger
 *  /admin/products/remove/{id}:
 *      delete:
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
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */

router.delete("/remove/:id", ProductController.removeProductById);

/**
 * @swagger
 *  /admin/products/edit/{id}:
 *      patch:
 *          tags: [Product(AdminPanel)]
 *          summary: create and save product
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *                  description: id of product for update product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Product'
 *
 *          responses:
 *              200:
 *                  description: updated Product
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */

router.patch(
  "/edit/:id",
  uploadFile.array("images", 10),
  stringToArray("tags", "colors"),
  ProductController.updateProduct
);


/**
 * @swagger
 *  /admin/products/likeProduct/{productID}:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: delete One products
 *          parameters:
 *              -   in: path
 *                  name: productID
 *                  type: string
 *                  description: objectId of product
 *          responses:
 *              200:
 *                  description: success
 */

router.get("/likeProduct/:productID", ProductController.likeProduct);

/**
 * @swagger
 *  /admin/products/editTitle:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: delete One products
 *          responses:
 *              200:
 *                  description: success
 */

router.get("/editTitle", ProductController.change);

/**
 * @swagger
 *  /admin/products/getID:
 *      post:
 *          tags: [Product(AdminPanel)]
 *          summary: create and save product
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/getID'
 *
 *          responses:
 *              200:
 *                  description: created new Product
 */
router.post("/getID" , ProductController.getId);

/**
 * @swagger
 *  /admin/products/nameSlider:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: create and save product
 *          responses:
 *              200:
 *                  description: created new Product
 */
router.get("/nameSlider" , ProductController.change);

// /**
//  * @swagger
//  *  /admin/products/addBarcode:
//  *      get:
//  *          tags: [Product(AdminPanel)]
//  *          summary: create and save product
//  *          responses:
//  *              200:
//  *                  description: created new Product
//  */
// router.get("/addBarcode" , ProductController.addBarcodeProduc);

// /**
//  * @swagger
//  *  /admin/products/readBarcode:
//  *      get:
//  *          tags: [Product(AdminPanel)]
//  *          summary: create and save product
//  *          responses:
//  *              200:
//  *                  description: created new Product
//  */
// router.get("/readBarcode" , ProductController.readBarcode);
// /**
//  * @swagger
//  *  /admin/products/changePrice:
//  *    post:
//  *          tags: [Product(AdminPanel)]
//  *          summary: create and save product
//  *          requestBody:
//  *                required: true
//  *                content:
//  *                    application/x-www-form-urlencoded:
//  *                        schema:
//  *                            $ref: '#/components/schemas/chanePrice'
//  *          responses:
//  *              200:
//  *                  description: success
//  */
// router.post("/changePrice" , ProductController.changePrice)

module.exports = {
  productRouter: router,
};
