module.exports = (MFormAssignTaskModel, models) => {
    MFormAssignTaskModel.hasMany(models.TbAnswerModel, {
        foreignKey: 'formAssignTaskId',
        as: "answer"
    });

    MFormAssignTaskModel.belongsTo(models.MFormModel, {
        foreignKey: 'formId',
        as: "form"
    });

    return MFormAssignTaskModel
}