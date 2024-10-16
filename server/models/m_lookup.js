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
      unique: "m_lookup_id_IDX"
    },
    dataField: {
      type: DataTypes.STRING(36),
      allowNull: true,
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
    fromField: {
      type: DataTypes.STRING(36),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "from_field",
      references: {
        key: "data_field",
        model: "mFormDetailModel"
      }
    },
    keyData: {
      type: DataTypes.STRING(36),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "key_data"
    },
    deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "deleted"
    }
  };
  const options = {
    tableName: "m_lookup",
    comment: "",
    indexes: [{
      name: "m_lookup_FK",
      unique: false,
      type: "BTREE",
      fields: ["data_field"]
    }, {
      name: "m_lookup_FK_1",
      unique: false,
      type: "BTREE",
      fields: ["from_field"]
    }]
  };
  const MLookupModel = sequelize.define("mLookupModel", attributes, options);
  return MLookupModel;
};