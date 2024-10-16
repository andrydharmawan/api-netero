var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var httpErrors = require('http-errors');
var fs = require('fs');
const { response } = require("./server/lib");
const endpoint = "";
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
    next();
});

try {
    const pathRoutes = "./server/routes";
    const directoryPath = path.join(__dirname, pathRoutes);

    function ListEndpoint({ path, endPoint }) {
        this["Path"] = path;
        this["End Point"] = `http://localhost:${process.env.PORT}${endPoint}`;
    }

    let listEndPoint = [];
    const recursiveMap = (fileName, dir = "") => {
        if (fileName.includes(".")) {
            const pathFile = `${dir}/${fileName}`;
            const pathEndPoint = `${endpoint}${pathFile.replace(/\.[^/.]+$/, "")}`;
            app.use(pathEndPoint, require(`${pathRoutes}${pathFile}`));
            listEndPoint.push(new ListEndpoint({
                path: `${pathRoutes}${pathFile}`,
                endPoint: pathEndPoint
            }))
        }
        else {
            const pat = path.join(__dirname, `${pathRoutes}${dir || ""}/${fileName}`);
            fs.readdirSync(pat).map(x => recursiveMap(x, `${dir || ""}/${fileName}`));
        }
    }
    fs.readdirSync(directoryPath).map(fileName => recursiveMap(fileName));
    console.table(listEndPoint);
} catch (error) {
    console.log("\x1b[41m", "auto routes error", error)
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(httpErrors(404));
});

// error handler
app.use(function (err, req, res, next) {
    response({
        httpError: err.status || 500,
        code: `${err.status || 500}`,
        message: err.message
    }, { req, res, next });
});


process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})

module.exports = app;
