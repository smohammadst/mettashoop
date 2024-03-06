const { ExcelController } = require("../../http/controller/admin/excel.controller");
const { uploadFileExcel } = require("../../module/excelFileUpload");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: Excel
 */

/**
 * @swagger
 *  /admin/getAllProductExcel:
 *      get:
 *          tags: [Excel]
 *          summary: delete One products
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/getAllProductExcel", ExcelController.getAllProductExcel);

/**
 * @swagger
 *  components:
 *      schemas:
 *          addExcel:
 *              type:   object
 *              required:
 *              -   excel
 *              properties:
 *                excel:
 *                    type: file
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          addExcels:
 *              type:   object
 *              required:
 *              -   excel
 *              properties:
 *                excel:
 *                    type: file
 */

/**
 * @swagger
 * /admin/addExcel:
 *  post:
 *    tags:   [Excel]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/addExcel'
 *    responses:
 *      201:
 *        description: success
 */
router.post("/addExcel", uploadFileExcel.single("excel"), ExcelController.fileExcelUploadAndUpdatePrice)

module.exports = {
    Excel: router,
};
