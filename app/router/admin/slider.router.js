const {
  SliderController,
} = require("../../http/controller/admin/slider.controller");
const { uploadFile } = require("../../module/fileUpload");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: Slider
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          addSlider:
 *              type:   object
 *              required:
 *              -   title
 *              -   images
 *              properties:
 *                title:
 *                    type:   string
 *                images:
 *                    type: array
 *                    items:
 *                        type: string
 *                        format: binary
 *                category:
 *                    type:   string
 *                discount:
 *                    type:   string
 */

/**
 * @swagger
 * /admin/addSlider:
 *  post:
 *    tags:   [Slider]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/addSlider'
 *    responses:
 *      201:
 *        description: success
 */
router.post(
  "/addSlider",
  uploadFile.array("images" , 2),
  SliderController.addSlider
);

/**
 * @swagger
 *  /admin/removeSlider/{id}:
 *      get:
 *          tags: [Slider]
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
router.get("/removeSlider/:id", SliderController.removeSlider);

module.exports = {
  SliderRouter: router,
};
