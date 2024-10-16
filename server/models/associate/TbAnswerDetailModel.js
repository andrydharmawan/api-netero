module.exports = (TbAnswerDetailModel, models) => {
    TbAnswerDetailModel.belongsTo(models.TbAnswerModel, {
        foreignKey: 'answerId'
    });

    TbAnswerDetailModel.belongsTo(models.MFormDetailModel, {
        foreignKey: 'dataField',
        targetKey: 'dataField',
        as: "formDetail"
    });

    return TbAnswerDetailModel;
}