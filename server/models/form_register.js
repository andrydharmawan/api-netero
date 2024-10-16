const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    formId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "form_id"
    },
    createdDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_date"
    },
    formName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "form_name"
    },
    template: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "template"
    }
  };
  const options = {
    tableName: "form_register",
    comment: "",
    indexes: []
  };
  const FormRegisterModel = sequelize.define("formRegisterModel", attributes, options);
  return FormRegisterModel;
};