//lade die ganzen deb's für diese js
var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var sha256 = require('sha256');
var rest = require("./REST.js");
//erstelle die express app
var app  = express();
//erstelle die Rest Function
function REST(){
    var self = this;
    self.connectMysql();
};
//db connection
REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'main-api',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}
//configure express server
REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/', router);
    var rest_router = new rest(router,connection,sha256);
    self.startServer();
}
//start express server
REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}
//stop the express server
REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}
//export von der js rest
new REST();