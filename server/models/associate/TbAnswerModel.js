module.exports = (TbAnswerModel, models) => {
    TbAnswerModel.hasMany(models.TbAnswerDetailModel, {
        foreignKey: 'answerId',
        as: "answerDetails"
    });
    
    TbAnswerModel.hasMany(models.TbAnswerDetailModel, {
        foreignKey: 'answerId',
        as: "answerFilter"
    });

    TbAnswerModel.belongsTo(models.MFormAssignTaskModel, {
        foreignKey: 'formAssignTaskId',
        as: "formAssignTask"
    });

    return TbAnswerModel
}