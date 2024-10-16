module.exports = (MFormDetailModel, models) => {
    MFormDetailModel.belongsTo(models.MFormModel, {
        foreignKey: 'formId'
    });
    MFormDetailModel.hasMany(models.TbAnswerDetailModel, {
        foreignKey: 'dataField',
        sourceKey: 'dataField'
    });
    MFormDetailModel.hasMany(models.MLookupModel, {
        foreignKey: 'dataField',
        as: "lookupParameter"
    });

    return MFormDetailModel
}