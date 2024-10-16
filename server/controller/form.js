
const { response, reqBody } = require("../lib");
const { MFormModel, MFormDetailModel, MLookupModel, sequelize } = require("../models");
const { Op } = require('sequelize');

exports.patch = async (req, res, next) => {
    let result = {};

    try {
        const {
            id,
            name,
            formDetails = [],
            currentUser,
        } = await reqBody({ req }, "data");

        await sequelize.transaction(async transaction => {
            const findName = await MFormModel.findOne({
                where: {
                    name,
                    deleted: 0
                }
            })

            const find = id ? findName?.id !== id : !!findName;
            if (find) throw new Error(`Form Name with this name(${name}) already exists`)

            if (id) {
                const [affectedCount] = await MFormModel.update({
                    name,
                    updatedBy: currentUser?.username
                }, {
                    where: {
                        id
                    },
                    transaction,
                    individualHooks: true
                })

                if (!affectedCount) throw new Error("Data not found")

                const findDetails = await MFormDetailModel.findAll({
                    where: {
                        formId: id,
                        deleted: 0
                    }
                });

                const findLookup = await MLookupModel.findAll({
                    where: {
                        dataField: {
                            [Op.in]: formDetails.map(x => x.dataField)
                        },
                        deleted: 0
                    }
                });

                await Promise.all(await formDetails.map(async ({
                    dataSource,
                    lookupParameter,
                    ...item
                }, sequence) => {
                    const find = findDetails.find(x => x.dataField === item.dataField)
                    const values = {
                        formId: id,
                        ...item,
                        ...dataSource && { dataSource: dataSource.join("\n") },
                        sequence,
                    }

                    if (find) await MFormDetailModel.update(values, {
                        where: {
                            dataField: item.dataField
                        },
                        transaction,
                        individualHooks: true
                    });
                    else await MFormDetailModel.create(values, {
                        transaction
                    });

                    lookupParameter && await Promise.all(await lookupParameter?.map(async (child) => {
                        if (child.id) {
                            await MLookupModel.update(child, {
                                where: {
                                    id: child.id
                                },
                                transaction,
                                individualHooks: true
                            })
                        }
                        else {
                            await MLookupModel.create({
                                dataField: item.dataField,
                                ...child,
                            }, {
                                transaction
                            })
                        }
                    }))
                }))

                const deleteField = findDetails.map(x => x.dataField).filter(value => !formDetails.map(x => x.dataField).includes(value));

                if (deleteField) await MFormDetailModel.update({
                    deleted: 1
                }, {
                    where: {
                        dataField: {
                            [Op.in]: deleteField
                        }
                    },
                    transaction,
                    individualHooks: true
                });

                const deleteFieldLookup = findLookup.map(x => x.id).filter(value => !formDetails.map(x => x?.lookupParameter?.map(y => y.id)).flat().includes(value));

                if (deleteFieldLookup.length) await MLookupModel.update({
                    deleted: 1
                }, {
                    where: {
                        id: {
                            [Op.in]: deleteFieldLookup
                        }
                    },
                    transaction,
                    individualHooks: true
                });
            }
            else {
                const form = await MFormModel.create({
                    name,
                    createdBy: currentUser?.username,
                    updatedBy: currentUser?.username
                }, {
                    transaction,
                    individualHooks: true
                })

                await Promise.all(await formDetails.map(async ({
                    dataSource,
                    lookupParameter,
                    ...item
                }) => {
                    await MFormDetailModel.create({
                        ...item,
                        ...dataSource && { dataSource: dataSource.join("\n") },
                        formId: form.id,
                    }, {
                        transaction
                    });

                    lookupParameter && await Promise.all(await lookupParameter?.map(async (child) => {
                        await MLookupModel.create({
                            dataField: item.dataField,
                            ...child,
                        }, {
                            transaction
                        })
                    }))
                }))

            }

            return true;
        });

        result = {
            message: id ? "Success Updated Data" : "Success Created Data",
            data: null
        }
    } catch (error) {
        result = {
            code: 400,
            message: error.message
        }
    }
    response(result, { req, res, next })
}

exports.detail = async (req, res, next) => {
    let result = {};

    try {
        let {
            id,
        } = req.params || {};

        const { data: [data] } = await getForm({
            options: {
                where: {
                    id
                }
            }
        });

        result = {
            message: "Success Get Data",
            data
        }
    } catch (error) {
        result = {
            code: 400,
            message: error.message
        }
    }
    response(result, { req, res, next })
}

exports.list = async (req, res, next) => {
    let result = {};

    try {
        const {
            paging: pagingBody,
            where,
            order,
            page,
            limit,
        } = await reqBody({ req });

        const { data, paging } = await getForm({
            options: {
                where,
                order,
                ...pagingBody,
            }
        })

        result = {
            message: "Success Get Data",
            data,
            paging: {
                page,
                limit,
                ...paging,
            }
        }
    } catch (error) {
        result = {
            code: 400,
            message: error.message
        }
    }
    response(result, { req, res, next })
}

const getForm = async ({ options }) => new Promise(async (resolve, reject) => {
    try {
        let paging = null;
        if (options.limit) {
            const totalRecord = await MFormModel.count({
                include: {
                    model: MFormDetailModel,
                    required: false,
                    as: "formDetails",
                    where: {
                        deleted: 0
                    },
                },
                ...options,
                distinct: true,
            });

            const totalPage = options.limit && options.limit !== -1 ? Math.ceil(totalRecord / options.limit) : 1
            paging = { totalRecord, totalPage }
        }

        const data = await MFormModel.findAll({
            include: {
                model: MFormDetailModel,
                required: false,
                as: "formDetails",
                where: {
                    deleted: 0
                },
                include: {
                    model: MLookupModel,
                    required: false,
                    as: "lookupParameter",
                    where: {
                        deleted: 0
                    },
                },
            },
            ...options,
            where: {
                ...options.where,
                deleted: 0
            },
            order: [
                [{ model: MFormDetailModel, as: 'formDetails' }, 'sequence', 'ASC']
            ],
        });

        let list = []

        if (data.length) {
            data.forEach(item => {
                const { formDetails, ...form } = item.get({ plain: true });

                list.push({
                    ...form,
                    formDetails: formDetails?.map(({
                        dataSource,
                        required,
                        email,
                        minLength,
                        maxLength,
                        min,
                        max,
                        minDate,
                        maxDate,
                        disabled,
                        readOnly,
                        multiple,
                        isEditor,
                        allowClear,
                        defaultValue,
                        dataType,
                        hidden,
                        showInList,
                        ...item
                    }) => ({
                        ...item,
                        ...dataSource && { dataSource: dataSource.split("\n") },
                        defaultValue: dataType === "number" && defaultValue ? Number(defaultValue) : defaultValue,
                        dataType,
                        allowClear: !!allowClear,
                        isEditor: !!isEditor,
                        disabled: !!disabled,
                        readOnly: !!readOnly,
                        minDate: !!minDate,
                        maxDate: !!maxDate,
                        multiple: !!multiple,
                        required: !!required,
                        hidden: !!hidden,
                        showInList: !!showInList,
                        email: !!email,
                        minLength,
                        maxLength,
                        min,
                        max,
                    }))
                })
            })
        }

        resolve({ data: list, paging });
    } catch (error) {
        reject(new Error(error.message));
    }
})

exports.getForm = getForm