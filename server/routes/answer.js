const express = require('express');
const router = express.Router();
const { patch, detail, history, list } = require("../controller/answer");

/**
 * @openapi
 * /answer:
 *   post:
 *     summary: Retrieve
 *     tags:
 *       - Answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paging:
 *                 type: object
 *                 properties:
 *                   page:
 *                     type: integer
 *                     example: 1
 *                   limit:
 *                     type: integer
 *                     example: 10
 *               parameter:
 *                 type: object
 *                 properties:
 *                   criteria:
 *                     type: object
 *                   filter:
 *                     type: object
 *                     properties:
 *                       formId:
 *                         type: string
 *                         example: "f18a289f-58a5-41cd-80bc-982ec37be560"
 *                   sort:
 *                     type: object
 *                   between:
 *                     type: object
 *                   data:
 *                     type: object
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: object
 *                  properties:
 *                    responseCode:
 *                      type: string
 *                      example: "200"
 *                    responseDesc:
 *                      type: string
 *                      example: "Success Get Data"
 *                result:
 *                  type: array
 *                  items:
 *                    type: object
 *                paging:
 *                  type: object
 *                  properties:
 *                    page:
 *                      type: integer
 *                      example: 1
 *                    limit:
 *                      type: integer
 *                      example: 1
 *                    totalRecord:
 *                      type: integer
 *                      example: 1
 *                    totalPage:
 *                      type: integer
 *                      example: 1
 *       500:
 *         description: Terjadi kesalahan server internal
 */
router.post('/', list);

/**
 * @openapi
 * /answer/{id}:
 *   get:
 *     summary: Detail
 *     tags:
 *       - Answer
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: object
 *                  properties:
 *                    responseCode:
 *                      type: string
 *                      example: "200"
 *                    responseDesc:
 *                      type: string
 *                      example: "Success Get Data"
 *                result:
 *                  type: object
 *       500:
 *         description: Terjadi kesalahan server internal
 */
router.get('/:id', detail);

/**
 * @openapi
 * /answer:
 *   patch:
 *     summary: Create/Update
 *     tags:
 *       - Answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameter:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: object
 *                     example:
 *                         id: ""
 *                         formId: "f18a289f-58a5-41cd-80bc-982ec37be560"
 *                         7a34a3f4-f2e1-44da-8bfc-e4ef157ed5eb: "Test"
 *                         b5df851c-11a8-489c-828f-f7096d40f307: "Option 1"
 *  
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: object
 *                  properties:
 *                    responseCode:
 *                      type: string
 *                      example: "200"
 *                    responseDesc:
 *                      type: string
 *                      example: "Success Get Data"
 *                result:
 *                  type: object
 *       500:
 *         description: Terjadi kesalahan server internal
 */
router.patch('/', patch);




/**
 * @openapi
 * /answer/history/{formAssignTaskId}:
 *   get:
 *     summary: History
 *     tags:
 *       - Answer
 *     parameters:
 *      - in: path
 *        name: formAssignTaskId
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: object
 *                  properties:
 *                    responseCode:
 *                      type: string
 *                      example: "200"
 *                    responseDesc:
 *                      type: string
 *                      example: "Success Get Data"
 *                result:
 *                  type: object
 *       500:
 *         description: Terjadi kesalahan server internal
 */
router.get('/history/:id', history);

module.exports = router;