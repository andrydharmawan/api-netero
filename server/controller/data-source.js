
const { response, convertObjectToArray, reqBody, sorting } = require("../lib");
const { MDataSourceModel, MFormModel } = require("../models");
const { default: axios } = require("axios");
const { getForm } = require("./form");
const { getAnswer } = require("./answer");

exports.list = async (req, res, next) => {
    let result = {};

    try {
        const [formList, data] = await Promise.all([
            MFormModel.findAll({
                where: {
                    deleted: 0
                }
            }),
            MDataSourceModel.findAll({
                where: {
                    deleted: 0
                }
            })
        ])

        result = {
            message: "Success Get Data",
            data: sorting.asc([...data.map(x => ({ ...x.get({ plain: true }), from: "Master Data" })), ...formList.map(x => ({ ...x.get({ plain: true }), from: "Form" }))], "name")
        }
    } catch (error) {
        result = {
            code: 400,
            message: error.message
        }
    }
    response(result, { req, res, next })
}

exports.column = async (req, res, next) => {
    let result = {};

    try {
        const {
            id,
        } = req.params || {};

        if (!id) throw new Error("Id is required")

        const find = await MDataSourceModel.findOne({
            where: {
                id,
                deleted: 0
            }
        })

        let data = [];

        if (find) {
            //http://192.168.30.164:8080/gspd/
            const res = await axios.get(`${process.env.API_URL}${find?.url}`)

            const [firstRow] = Array.isArray(res.data?.result) ? res.data?.result : []

            if (firstRow) data = convertObjectToArray(find.name, firstRow)
        }
        else {
            const { data: [form] } = await getForm({
                options: {
                    where: {
                        id
                    }
                }
            });

            data = form?.formDetails?.filter(x => x.isEditor)?.map(x => {
                return {
                    column: x.dataField,
                    parent: form?.name,
                    name: x.label,
                }
            })
        }

        result = {
            message: "Success Get Data",
            data
        }
    } catch (error) {
        result = {
            code: 400,
            message: error.message,
            data: []
        }
    }
    response(result, { req, res, next })
}

exports.dataSource = async (req, res, next) => {
    let result = {};

    try {
        const {
            id,
        } = req.params || {};

        if (!id) throw new Error("Id is required")

        const find = await MDataSourceModel.findOne({
            where: {
                id,
                deleted: 0
            }
        })

        let data = [];

        if (find) {
            const res = await axios.get(`${process.env.API_URL}${find?.url}`)

            data = Array.isArray(res.data?.result) ? res.data?.result : []
        }
        else {
            const { data: list } = await getAnswer({
                options: {
                    where: {
                        formId: id
                    }
                }
            });

            data = list;
        }

        result = {
            message: "Success Get Data",
            data: data
        }
    } catch (error) {
        result = {
            code: 400,
            message: error.message,
            data: []
        }
    }
    response(result, { req, res, next })
}