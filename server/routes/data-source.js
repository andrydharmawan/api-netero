const express = require('express');
const router = express.Router();
const { list, column, dataSource } = require("../controller/data-source");

/**
 * @openapi
 * /data-source:
 *   get:
 *     summary: List Data Source yang tersedia
 *     tags:
 *       - DataSource
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
router.get('/', list);


/**
 * @openapi
 * /data-source/column/{id}:
 *   get:
 *     summary: List Column yang diambil dari response API JAVA
 *     tags:
 *       - DataSource
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
router.get('/column/:id', column);

/**
 * @openapi
 * /data-source/data/{id}:
 *   get:
 *     summary: Get All Data yang diambil dari API JAVA
 *     tags:
 *       - DataSource
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
router.get('/data/:id', dataSource);

module.exports = router;