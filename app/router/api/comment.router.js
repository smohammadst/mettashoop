const {
  CommentController,
} = require("../../http/controller/api/comment.controller");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name:   Comment
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          addComment:
 *              type:   object
 *              required:
 *              -   comment
 *              -   star
 *              properties:
 *                  comment:
 *                      type:   string
 *                  id:
 *                    type: string
 *                  parent: 
 *                    type: string
 *                  star:
 *                    type: number
 *          likeComment:
 *            type: object
 *            required:
 *            - productID
 *            - commentID
 *            properties:
 *              productID:
 *                type: string
 *              commentID:
 *                type: string
 *              parent:
 *                type: string
 *
 */

/**
 * @swagger
 * /comment/addComment:
 *  post:
 *    tags:   [Comment]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/addComment'
 *    responses:
 *      201:
 *        description: success
 */
router.post("/addComment", CommentController.addComment);

/**
 * @swagger
 * /comment/likeComment:
 *  post:
 *    tags:   [Comment]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/likeComment'
 *    responses:
 *      201:
 *        description: success
 */

router.post("/likeComment", CommentController.likeComment);

module.exports = {
  CommentRouter: router,
};
