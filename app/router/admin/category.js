const {
  CategoryController,
} = require("../../http/controller/admin/category.controller");
const { uploadFile } = require("../../module/fileUpload");

const router = require("express").Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Category:
 *              type: object
 *              required:
 *                  -   titleE
 *                  -   titleF
 *              properties:
 *                  titleE:
 *                      type: string
 *                      description: the title of category
 *                  titleF:
 *                      type: string
 *                      description: the title of category
 *                  image:
 *                    type: file
 *          Edit:
 *              type: object
 *              required:
 *                  -   titleE
 *                  -   titleF
 *              properties:
 *                  titleE:
 *                      type: string
 *                      description: the title of category
 *                  titleF:
 *                      type: string
 *                      description: the title of category
 */

/**
 * @swagger
 *  /admin/category/add:
 *      post:
 *          tags: [Category(AdminPanel)]
 *          summary: create new category title
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *          responses:
 *              201:
 *                  description: success
 */
router.post("/add", uploadFile.single("image"), CategoryController.addCategory);



/**
 * @swagger
 *  /admin/category/remove/{id}:
 *      delete:
 *          tags: [Category(AdminPanel)]
 *          summary: remove category with object-id
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required : true
 *          responses:
 *              200:
 *                  description: success
 */

router.delete("/remove/:id", CategoryController.removeCategory);

/**
 * @swagger
 *  /admin/category/update/{id}:
 *      patch:
 *          tags: [Category(AdminPanel)]
 *          summary: edit or update category title with object id
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required : true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit'
 *          responses:
 *              200:
 *                  description: success
 *              500:
 *                  description: internalServerErorr
 */
router.patch("/update/:id", CategoryController.editCategoryTitle);

module.exports = {
  CategoryRouter: router,
};
