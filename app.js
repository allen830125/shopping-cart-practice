const express = require("express");
const app = express();
const port = process.env.PORT || 8888;
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const session = require("express-session");
const mongoStore = require('connect-mongo')(session);
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const routing = require("./routing.js");
const sysConfig = require("./configs/system.js");
const dbConfig = require("./configs/database.js");


const ip = dbConfig.mongo.ip || "127.0.0.1";
const dbPort = dbConfig.mongo.port || "27017";
const databaseName = dbConfig.mongo.database_name || "test";
let dbConn = `mongodb://${ip}:${dbPort}/${databaseName}`;
if (process.env.NODE_ENV === "production") {
    dbConn = process.env.MONGOLAB_URL;
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', port);

//sass 的設定
app.use('/css', sass({
    src: __dirname + '/public/sass', //scss 檔案的位置
    dest: __dirname + '/public/css', //輸出的位置
    debug: true,
    outputStlyes: 'compressed',
}));

//靜態檔案和middleware的路徑設定
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
}));
app.use(bodyParser.json({ limit: "50mb" }));

// 按照上面的解释，设置 session 的可选参数
const maxAgeSec = sysConfig.sessionExpiredMS || 1000 * 60 * 60 * 3;
const sessionMiddleware = session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: {
        maxAge: maxAgeSec
    },
    store: new mongoStore({
        url: dbConn,
        ttl: maxAgeSec / 1000 // 單位 秒
    })
});
app.use(sessionMiddleware);

routing(app);

server.listen(port, () => {
    console.log('Express server listening on port ' + app.get('port'));
});