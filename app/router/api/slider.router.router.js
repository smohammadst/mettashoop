const { SliderController } = require("../../http/controller/admin/slider.controller");

const router = require("express").Router();

/**
 * @swagger
 * /slider/getSlider:
 *  get:
 *      tags: [Slider]
 *      summary: get 3 Slider
 *      responses:
 *          200:
 *              description: get 3 Slider
 *      
 */

router.get("/getSlider", SliderController.getSlider);

/**
 * @swagger
 *  /slider/sendSlider/{category}/{discount}:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: delete One products
 *          parameters:
 *              -   in: path
 *                  name: category
 *                  type: string
 *                  description: objectId of product
 *              -   in: path
 *                  name: discount
 *                  type: string
 *                  description: objectId of product
 *          responses:
 *              200:
 *                  description: success
 */

// router.get("sendSlider/:category/:discount" , SliderController.sendPageSlider);

router.get("/listProducts/:titleE/:discount", SliderController.sendPageSlider)
module.exports = {
  sliderRouter: router,
};
