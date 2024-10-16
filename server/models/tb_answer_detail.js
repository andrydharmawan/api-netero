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
      unique: "NewTable_id_IDX"
    },
    dataField: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "data_field",
      references: {
        key: "data_field",
        model: "mFormDetailModel"
      }
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "value"
    },
    answerId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "answer_id",
      references: {
        key: "id",
        model: "tbAnswerModel"
      }
    }
  };
  const options = {
    tableName: "tb_answer_detail",
    comment: "",
    indexes: [{
      name: "NewTable_FK_1",
      unique: false,
      type: "BTREE",
      fields: ["data_field"]
    }, {
      name: "tb_answer_detail_FK",
      unique: false,
      type: "BTREE",
      fields: ["answer_id"]
    }]
  };
  const TbAnswerDetailModel = sequelize.define("tbAnswerDetailModel", attributes, options);
  return TbAnswerDetailModel;
};