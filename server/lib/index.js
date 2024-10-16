const crypto = require('crypto');
const CryptoJS = require("crypto-js");
const moment = require("moment");
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { v4 } = require("uuid")
const {
    Op,
} = require("sequelize");

exports.response = (results, { req, res, next }) => {

    let {
        httpError = 200,
        paging,
        code: responseCode = "200",
        message: responseDesc = "Success",
        data: result = null
    } = results || {};


    let resp = {
        status: {
            responseCode,
            responseDesc
        },
        result,
        paging
    }

    res.status(httpError).json(resp)
}

function decodeJWT(token) {
    try {
        if (!token) return null;

        const base64Url = token.split('.')[1]; // Ambil bagian payload dari token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        return null
    }
}

exports.reqBody = async ({ req, res, next }, objName) => {
    const {
        body,
        headers: { authorization },
    } = req;

    const { sub } = decodeJWT(authorization) || {}
    let currentUser;

    if (sub) {
        const { MUserModel } = require("../models");
        const userData = await MUserModel.findOne({
            where: {
                username: sub
            }
        })

        if (!userData) throw new Error("Unauthorize")

        currentUser = userData;
    }

    const { parameter: { sort = {}, data = {}, criteria = {}, filter = {}, between = {} } = {}, paging: { page, limit } = {} } = body || {};

    let criteria_w = null,
        filter_w = null,
        order = null,
        where = null;

    const paging = page && limit
        ? {
            offset: (page - 1) * limit,
            limit
        }
        : null;


    if (criteria) {
        const keyCriteria = Object.keys(criteria);
        if (keyCriteria.length) {
            criteria_w = [];
            keyCriteria.forEach(item => {
                criteria_w.push({
                    [item]: {
                        [Op.substring]: criteria[item]
                    }
                })
            })
        }
    }

    if (filter) {
        const keyFilter = Object.keys(filter);
        if (keyFilter.length) {
            filter_w = [];
            keyFilter.forEach(item => {
                filter_w.push({
                    [item]: {
                        [Op.in]: typeof filter[item] === "object" ? filter[item] : [filter[item]]
                    }
                })
            })
        }
    }

    if (between) {
        const keyFilter = Object.keys(between);
        if (keyFilter.length) {
            if (!filter_w) filter_w = [];

            keyFilter.forEach(item => {
                const { from, to } = between[item];
                filter_w.push({
                    [item]: {
                        [Op.between]: [from, to]
                    }
                })
            })
        }
    }

    if (sort) {
        const keySort = Object.keys(sort);
        if (keySort.length) {
            order = []
            keySort.forEach(item => {
                order.push([
                    item, sort[item]
                ]);
            })
        }
    }

    if (criteria_w || filter_w) {
        where = {
            ...filter_w ? {
                [Op.and]: filter_w
            } : null,
            ...criteria_w ? {
                [Op.or]: criteria_w
            } : null,
        }
    }

    const result = {
        sort,
        data: {
            ...data,
            currentUser,
        },
        criteria,
        filter,
        page,
        limit,
        paging,
        where,
        order,
        currentUser,
    }

    return objName ? result[objName] : result;
}

exports.isArray = (data, length) => {
    let result = false;
    if (data) {
        if (typeof data === "object") {
            if (Array.isArray(data)) {
                if (typeof length === "number") {
                    if (data.length > length) {
                        result = true;
                    }
                } else {
                    result = true;
                }
            }
        }
    }
    return result;
}

exports.split = {
    camelCase: (value = "") => {
        value = value.split(".").map(val => {
            val = val.charAt(0).toUpperCase() + val.slice(1)
            return val
        }).join(" ")
        value = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}

exports.randomTime = (max = 59) => {
    let nilai = Math.floor(Math.random() * max) + 1;
    if (nilai < 10) return `0${nilai}`;
    return nilai;
}

exports.minusOne = (nilai = 1) => {
    nilai = parseInt(nilai) - 1;
    if (nilai < 10) return `0${nilai}`;
    return nilai;
}

exports.snakeCaseToPascalCase = (str) => {
    return str.replace(/_./g, match => match.charAt(1).toUpperCase()).replace(/^(.)/, match => match.toUpperCase());;
}


exports.textFormatter = {
    camelCase: (value = "") => {
        value = value.split(".").map(val => {
            val = val.charAt(0).toUpperCase() + val.slice(1)
            return val
        }).join(" ")
        value = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
        return value.charAt(0).toUpperCase() + value.slice(1);
    },
    snackCase: (value = "") => {
        const camelCase = value.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

        let camelWithSpaces = camelCase.replace(/([A-Z])/g, ' $1');

        camelWithSpaces = camelWithSpaces.charAt(0).toUpperCase() + camelWithSpaces.slice(1);

        return camelWithSpaces;
    },
    changeAll: (value = "", capShortWords = false) => {
        let result = "";

        try {
            value = value?.split(".")[value?.split(".")?.length - 1];
            value = value?.split("[]")[value?.split("[]")?.length - 1];

            result = textFormatter.snackCase(textFormatter.camelCase(value));

            if (capShortWords) result = result?.split(" ")
                ?.map(word => word?.length <= 3 ? word?.toUpperCase() : word)
                ?.join(" ");

        } catch (error) {

        }

        return result;
    }
}

exports.sorting = {
    desc: (data, field) => {
        if (!data) data = [];
        return data.sort((a, b) => {
            if (field) {
                const a1 = this.getFieldValue(a, field) ? this.getFieldValue(a, field) : "";
                const b1 = this.getFieldValue(b, field) ? this.getFieldValue(a, field) : "";
                return a1 < b1 ? 1 : -1;
            }
            else {
                return a < b ? 1 : -1;
            }
        });
    },
    asc: (data, field) => {
        if (!data) data = [];
        return data.sort((a, b) => {
            if (field) {
                const a1 = this.getFieldValue(a, field) ? this.getFieldValue(a, field) : "";
                const b1 = this.getFieldValue(b, field) ? this.getFieldValue(b, field) : "";
                return a1 > b1 ? 1 : -1;
            }
            else {
                return a > b ? 1 : -1;
            }
        })
    }
}

exports.getFieldValue = (arr, str) => {
    if (!arr) return "";
    if (str.includes(".")) return this.getFieldValue(arr[str.substring(0, str.indexOf("."))], str.substring(str.indexOf(".") + 1));
    return arr ? arr[str] : null;
}

function capitalizeWords(str = "") {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

exports.convertObjectToArray = (mainName, obj, parentKey = '') => {
    let result = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const currentKey = parentKey ? `${parentKey}.${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                result = result.concat(this.convertObjectToArray("", value, currentKey));
            } else {
                const parent = currentKey.includes(".") ? currentKey.replace(/\.([^.]*)$/, '').replace(/\./g, " ") : null
                const name = currentKey.includes(".") ? currentKey.match(/\.([^.]*)$/)[0]?.replace(/\./g, "") : currentKey;

                result.push({
                    column: currentKey,
                    parent: parent ? capitalizeWords(parent).replace(/\ /g, " → ") : mainName,
                    name: this.textFormatter.camelCase(this.textFormatter.snackCase(name))
                });
            }
        }
    }

    const excludeWords = ["createdDate", "updatedDate", "deleted", "id", "createdBy", "updatedBy"];
    let data = this.sorting.asc(result.filter(item =>
        !excludeWords.some(word => item.column.includes(word))
    ), "column");

    data = this.sorting.asc(data, "name");
    data = [
        ...data.filter(x => x.parent === mainName),
        ...data.filter(x => x.parent !== mainName),
    ]

    return data;
}