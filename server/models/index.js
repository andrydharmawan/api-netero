'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const moment = require("moment");
const { snakeCaseToPascalCase } = require("../lib")
const basename = path.basename(__filename);
const db = {};
const { v4 } = require("uuid")

let sequelize = new Sequelize(process.env.DBDATABASE, process.env.DBUSERNAME, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: "mysql",
    logging: false,
    define: {
        timestamps: false,
        underscored: true,
        hooks: {
            beforeValidate(record, options) {
                if (!record.id) {
                    record.dataValues.id = v4();
                }
                const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                record.dataValues.createdDate = currentDate;
                record.dataValues.updatedDate = currentDate;
            },
            beforeUpdate(record, options) {
                //using record.changed() for detect record changes
                const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                record.updatedDate = currentDate;
            },
        }
    },
    dialectOptions: {
        decimalNumbers: true,
    },
});

sequelize
    .authenticate()
    .then(() => console.log("Connection to database successfully"))
    .catch(err => console.error('Unable to connect to the database:', err));

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        const modelName = snakeCaseToPascalCase(file.replace(".js", "Model"));

        db[modelName] = model;
    });

Object.keys(db).forEach(modelName => {
    const modelPath = path.join(__dirname, `./associate/${modelName}.js`);
    if (fs.existsSync(modelPath)) {
        const model = require(modelPath)(db[modelName], db);
        db[modelName].associate = model;
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
