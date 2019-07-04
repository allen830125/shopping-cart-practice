const dbConfig = require("../../configs/database");
const mongoose = require('mongoose');

let mongo = dbConfig.mongo;
let ip = "";
let port = "";
let databaseName = "";

if (mongo != null) {
    ip = mongo.ip || "127.0.0.1";
    port = mongo.port || "27017";
    databaseName = mongo.database_name || "test";
}

let dbConn = `mongodb://${ip}:${port}/${databaseName}`;

if (process.env.NODE_ENV === 'production') {
    dbConn = process.env.MONGOLAB_URL;
}
console.log(dbConn);

mongoose.connect(dbConn);

require("./mongoose/Invoce");
require("./mongoose/WinningNumber");
require("./mongoose/Product");
require("./mongoose/Member");

exports.Invoce = mongoose.model("Invoce");
exports.WinningNumber = mongoose.model("WinningNumber");
exports.Product = mongoose.model("Product");
exports.Member = mongoose.model("Member");