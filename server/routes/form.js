const express = require('express');
const router = express.Router();
const { patch, detail, list } = require("../controller/form");

/**
 * @openapi
 * /form:
 *   post:
 *     summary: Retrieve
 *     tags:
 *       - Form
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
 * /form/{id}:
 *   get:
 *     summary: Detail
 *     tags:
 *       - Form
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
 * /form:
 *   patch:
 *     summary: Create/Update
 *     tags:
 *       - Form
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
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: ""
 *                       name:
 *                         type: string
 *                         example: "Test Form"
 *                       formDetails:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             dataField:
 *                               type: string
 *                               example: "51edde24-6c9c-4922-a232-9413c3ed688f"
 *                             label:
 *                               type: string
 *                               example: "Page 1"
 *                             description:
 *                               type: string
 *                               nullable: true
 *                             editorType:
 *                               type: string
 *                               example: "page"
 *                             colSpan:
 *                               type: integer
 *                               example: null
 *                             colCount:
 *                               type: integer
 *                               example: 1
 *                             isHardCode:
 *                               type: boolean
 *                               example: false
 *                             parentDataField:
 *                               type: string
 *                               example: null
 *                             sourceDataId:
 *                               type: string
 *                               example: null
 *                             valueExpr:
 *                               type: string
 *                               example: null
 *                             dataSource:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             disabled:
 *                               type: boolean
 *                               example: false
 *                             readOnly:
 *                               type: boolean
 *                               example: false
 *                             minDate:
 *                               type: boolean
 *                               example: null
 *                             maxDate:
 *                               type: boolean
 *                               example: null
 *                             referenceField:
 *                               type: string
 *                               example: null
 *                             referenceKey:
 *                               type: string
 *                               example: null
 *                             required:
 *                               type: boolean
 *                               example: null
 *                             email:
 *                               type: boolean
 *                               example: null
 *                             minLength:
 *                               type: number
 *                               example: null
 *                             maxLength:
 *                               type: number
 *                               example: null
 *                             min:
 *                               type: number
 *                               example: null
 *                             max:
 *                               type: number
 *                               example: null
 *                             isEditor:
 *                               type: boolean
 *                               example: false
 *                         example:
 *                           - dataField: "51edde24-6c9c-4922-a232-9413c3ed688f"
 *                             label: "Page 1"
 *                             editorType: "page"
 *                             colCount: 1
 *                             isEditor: false
 *                           - dataField: "7a34a3f4-f2e1-44da-8bfc-e4ef157ed5eb"
 *                             label: "Input 1"
 *                             description: null
 *                             editorType: "input"
 *                             colCount: 1
 *                             isHardCode: false
 *                             parentDataField: "51edde24-6c9c-4922-a232-9413c3ed688f"
 *                             required: true
 *                             isEditor: true
 *                           - dataField: "b5df851c-11a8-489c-828f-f7096d40f307"
 *                             label: "Dropdown 1"
 *                             editorType: "select"
 *                             colCount: 1
 *                             isHardCode: true
 *                             parentDataField: "51edde24-6c9c-4922-a232-9413c3ed688f"
 *                             dataSource: ["Option 1", "Option 2"]
 *                             required: true
 *                             isEditor: true
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

module.exports = router;