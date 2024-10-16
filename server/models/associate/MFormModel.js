module.exports = (MFormModel, models) => {
    MFormModel.hasMany(models.MFormDetailModel, {
        foreignKey: 'formId',
        as: "formDetails"
    });

    MFormModel.hasMany(models.MFormAssignTaskModel, {
        foreignKey: 'formId'
    });

    return MFormModel
}