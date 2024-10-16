const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    permissionId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "permission_id",
      references: {
        key: "id",
        model: "mPermissionModel"
      }
    },
    roleId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "role_id",
      references: {
        key: "id",
        model: "mRoleModel"
      }
    }
  };
  const options = {
    tableName: "m_role_permission",
    comment: "",
    indexes: [{
      name: "roleId_permissionId",
      unique: true,
      type: "BTREE",
      fields: ["role_id", "permission_id"]
    }]
  };
  const MRolePermissionModel = sequelize.define("mRolePermissionModel", attributes, options);
  return MRolePermissionModel;
};