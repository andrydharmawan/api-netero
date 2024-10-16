module.exports = (MLookupModel, models) => {
    MLookupModel.belongsTo(models.MFormDetailModel, {
        foreignKey: 'dataField'
    });
    return MLookupModel
}