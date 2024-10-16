
const { response, reqBody } = require("../lib");
const { TbAnswerModel, TbAnswerDetailModel, MFormAssignTaskModel, MFormDetailModel, MFormModel, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.patch = async (req, res, next) => {
    let result = {};

    try {
        let {
            id,
            formId,
            currentUser,
            status,
            ...others
        } = await reqBody({ req }, "data");

        if (!formId) throw new Error("Assign Task Id is required")

        if (!currentUser) throw new Error("Unauthorize")

        const findAssign = await MFormAssignTaskModel.findOne({ where: { formId, userId: currentUser?.id, deleted: 0 } })

        if (!findAssign) throw new Error("Assign Task not found")

        await sequelize.transaction(async transaction => {
            const formDetails = await MFormDetailModel.findAll({
                where: {
                    formId: findAssign.formId,
                    deleted: 0
                }
            })

            if (id) {
                const answerData = await TbAnswerModel.findOne({
                    include: {
                        model: TbAnswerDetailModel,
                        as: "answerDetails"
                    },
                    where: {
                        id,
                    }
                })
                if (!answerData) throw new Error("Data not found")

                if (["submitted", "cancel"].some(x => x === answerData.status)) throw new Error("The record with status 'submitted' cannot be updated")

                await TbAnswerModel.update({
                    status,
                    updatedBy: currentUser?.username,
                }, {
                    where: {
                        id
                    },
                    transaction,
                    individualHooks: true
                })

                const findDetails = answerData.answerDetails;

                await Promise.all(await Object.entries(others).map(async ([dataField, value]) => {
                    const findIsEditor = formDetails.some(x => x.dataField === dataField && x.isEditor)
                    if (!findIsEditor) return;

                    const find = findDetails.find(x => x.dataField === dataField)
                    const values = {
                        answerId: id,
                        dataField,
                        value: Array.isArray(value) ? value.join("\n") : value,
                    }

                    if (find) await TbAnswerDetailModel.update(values, {
                        where: {
                            id: find.id
                        },
                        transaction,
                        individualHooks: true
                    });
                    else await TbAnswerDetailModel.create(values);
                }))
            }
            else {
                const answer = await TbAnswerModel.create({
                    formAssignTaskId: findAssign.id,
                    status,
                    createdBy: currentUser?.username,
                    updatedBy: currentUser?.username,
                }, {
                    transaction
                })

                id = answer.id;

                await Promise.all(await Object.entries(others).map(async ([dataField, value]) => {
                    const findIsEditor = formDetails.some(x => x.dataField === dataField && x.isEditor)
                    if (!findIsEditor) return;

                    await TbAnswerDetailModel.create({
                        answerId: answer.id,
                        dataField,
                        value: Array.isArray(value) ? value.join("\n") : value,
                    }, {
                        transaction
                    });
                }))

            }
        })

        result = {
            message: id ? "Success Updated Data" : "Success Created Data",
            data: {
                id
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

exports.detail = async (req, res, next) => {
    let result = {};

    try {
        let {
            id,
        } = req.params || {};

        const { data: [data] } = await getAnswer({
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

exports.history = async (req, res, next) => {
    let result = {};

    try {
        const {
        } = await reqBody({ req });

        const { data } = await getAnswer({
            formAssignTaskId: req.params.id
        })

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
            filter: { formId },
            criteria,
            page,
            limit,
        } = await reqBody({ req });

        if (!formId) throw new Error("Form Id is required")

        let criteria_w, where;

        if (criteria) {
            const keyCriteria = Object.keys(criteria);
            if (keyCriteria.length) {
                criteria_w = [];
                keyCriteria.forEach(item => {
                    criteria_w.push({
                        [Op.and]: [{
                            value: {
                                [Op.substring]: criteria[item]
                            }
                        }, {
                            dataField: item
                        }]
                    })
                })
            }
        }

        if (criteria_w) {
            where = {
                ...criteria_w ? {
                    [Op.or]: criteria_w
                } : null,
            }
        }

        const { data, paging } = await getAnswer({
            filterAnswerDetails: where,
            formId,
            options: {
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

const getAnswer = async ({ filterAnswerDetails, options, formAssignTaskId, formId }) => new Promise(async (resolve, reject) => {
    try {
        let paging = null;
        if (options?.limit) {
            const totalRecord = await TbAnswerModel.count({
                // include: [{
                //     model: TbAnswerDetailModel,
                //     as: "answerFilter",
                //     required: true,
                //     where: filterAnswerDetails
                // }],
                ...options,
                distinct: true,
            });
            const totalPage = options.limit && options.limit !== -1 ? Math.ceil(totalRecord / options.limit) : 1
            paging = { totalRecord, totalPage }
        }

        const data = await TbAnswerModel.findAll({
            include: [
                // {
                //     model: TbAnswerDetailModel,
                //     as: "answerFilter",
                //     required: true,
                //     where: filterAnswerDetails
                // },
                {
                    model: MFormAssignTaskModel,
                    as: "formAssignTask",
                    required: true,
                    ...formAssignTaskId && {
                        where: {
                            id: formAssignTaskId
                        },
                    },
                    // ...formId && {
                    //     where: {
                    //         formId
                    //     },
                    // }
                    // include: {
                    //     model: MFormModel,
                    //     required: false,
                    //     as: "form",
                    //     include: {
                    //         model: MFormDetailModel,
                    //         required: false,
                    //         as: "formDetails",
                    //         where: {
                    //             deleted: 0
                    //         },
                    //     }
                    // }
                }, {
                    model: TbAnswerDetailModel,
                    required: false,
                    as: "answerDetails",
                    include: {
                        model: MFormDetailModel,
                        as: "formDetail",
                        required: false
                    }
                }],
            ...options,
            order: [
                ["createdDate", "DESC"]
            ],
        });



        let list = []

        if (data.length) {

            // const { data: [form] } = await getForm({
            //     options: {
            //         where: {
            //             id: 
            //         }
            //     }
            // });


            data.forEach(item => {
                const { answerDetails, answerFilter, formAssignTask, formDetail, ...answer } = item.get({ plain: true });
                let showInList = [];
                let obj = answer

                answerDetails.forEach(({
                    formDetail,
                    ...ans
                }) => {
                    const value = formDetail.multiple ? ans.value?.split("\n") : ans.value;
                    if (formDetail.showInList) showInList.push({
                        label: formDetail.label,
                        dataField: ans.dataField,
                        value
                    });

                    obj[ans.dataField] = value
                });

                obj.showInList = showInList;

                list.push(obj)
            })
        }

        resolve({ data: list, paging });
    } catch (error) {
        reject(new Error(error.message));
    }
})

exports.getAnswer = getAnswer;