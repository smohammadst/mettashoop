const router = require('express').Router();
const mongoosr = require('mongoose');
const { ProductModel } = require('../model/products');
const FormData = require('form-data');
let data = new FormData();
/**
 * @swagger
 * tags:
 *  name: torob
 *  descriptions:   api torob
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          torob:
 *            type: object
 *            properties:
 *              page_unique:
 *                type: string
 *              page_url:
 *                type: string
 *              page:
 *                type: string
 */
/**
 * @swagger
 * /torob/products:
 *  post:
 *    tags:   [torob]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/torob'
 *    responses:
 *      201:
 *        description: success
 */
const multiparty = require('multiparty');
router.post("/products", async (req, res, next) => {
    try {
        let form = new multiparty.Form();
        form.parse(req, async function (err, fields, files) {
            if (fields?.page_url || fields?.page_unique) {
                try {
                    let page_unique;
                    let page_url;
                    page_unique = fields?.page_unique?.[0];
                    page_url = fields?.page_url?.[0]
                    let id;
                    if (page_unique) id = page_unique;
                    else if (page_url) id = page_url.split("/")[6]
                    const result_product = await ProductModel.findOne({ _id: id });
                    let count = 0;
                    const number = await ProductModel.find({});
                    number.forEach((e, index) => {
                        if (e.id == id) count = index + 1;
                    })
                    if (!result_product) throw { message: "کالایی یافت نشد" };
                    return res.status(200).json({
                        count,
                        max_pages: 1,
                        products: [{
                            title: result_product.title,
                            page_unique: result_product._id,
                            current_price: result_product.theFinalPrice,
                            old_price: result_product.price,
                            availability: result_product.count,
                            category_name: result_product.category,
                            image_link: result_product.imagesURL[0],
                            image_links: result_product.imagesURL,
                            page_url: result_product.productURL,
                            spec: result_product.features,
                        }]
                    })
                } catch (error) {
                    next(error)
                }
            } else {
                let products = await ProductModel.find({}).sort({ createdAt: -1 });
                const lengthProduct = products.length
                let result = []
                products.forEach(e => {
                    result.push({
                        
                            title: e.title,
                            page_unique: e._id,
                            current_price: e.theFinalPrice,
                            old_price: e.price,
                            availability: e.count,
                            category_name: e.category,
                            image_link: e.imagesURL[0],
                            image_links: e.imagesURL,
                            page_url: e.productURL,
                            spec: e.features,
                        
                    })
                })
                return res.status(200).json({
                    count: lengthProduct,
                    max_pages: 1,
                    products: result
                })
            }
        });
    } catch (error) {
        next(error)
    }
})

module.exports = {
    torob: router
}