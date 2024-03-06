const { TransactionController } = require("../../http/controller/api/transactions");


const router = require("express").Router();

/**
 * @swagger
 *  /admin/transactions/list:
 *      get:
 *          tags: [Transactions(AdminPanel)]
 *          summary: get all Transactions
 *          responses:
 *              200:
 *                  description: get all Transactions
 *
 */

router.get("/list", TransactionController.getAllTransactions);
module.exports = {
  AdminApiTransactionRouter: router,
};
