const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "id",
      unique: "id"
    },
    resourceId: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "resource_id",
      references: {
        key: "id",
        model: "mResourceModel"
      }
    },
    operation: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "operation"
    }
  };
  const options = {
    tableName: "m_resource_operations",
    comment: "",
    indexes: [{
      name: "resource_id",
      unique: false,
      type: "BTREE",
      fields: ["resource_id"]
    }]
  };
  const MResourceOperationsModel = sequelize.define("mResourceOperationsModel", attributes, options);
  return MResourceOperationsModel;
};