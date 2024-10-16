const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "id",
      unique: "tb_answer_id_IDX"
    },
    formAssignTaskId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "form_assign_task_id",
      references: {
        key: "id",
        model: "mFormAssignTaskModel"
      }
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_date"
    },
    updatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated_date"
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_by"
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated_by"
    },
    status: {
      type: DataTypes.ENUM('submitted', 'draft', 'cancel'),
      allowNull: true,
      defaultValue: "submitted",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "status"
    }
  };
  const options = {
    tableName: "tb_answer",
    comment: "",
    indexes: [{
      name: "tb_answer_FK",
      unique: false,
      type: "BTREE",
      fields: ["form_assign_task_id"]
    }]
  };
  const TbAnswerModel = sequelize.define("tbAnswerModel", attributes, options);
  return TbAnswerModel;
};