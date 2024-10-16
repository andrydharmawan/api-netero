const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GSPD Api Documentation',
            version: '1.0.0',
            description: 'API documentation for GSPD application',
        },
        servers: [{
            url: process.env.ENDPOINT
        }],
    },
    apis: [path.join(__dirname, 'routes', '*.js')],
};

const specs = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
    app.use(`${process.env.ENDPOINT}/swagger-ui/index.html`, swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;