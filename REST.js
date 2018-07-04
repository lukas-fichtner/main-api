//lade alle dep's für diese JS
const Gamedig = require('gamedig');
const sha256 = require('sha256');
var getJSON = require('get-json');
var jsonQuery = require('json-query')
var unixTime = require('unix-time');

//lade alle Parameter & mysql
var mysql = require("mysql");
function REST_ROUTER(router,connection,sha256) {
    var self = this;
    self.handleRoutes(router,connection,sha256);
}

//erstelle den Router
function REST_ROUTER(router,connection,sha256) {
    var self = this;
    self.handleRoutes(router,connection,sha256);
}

//setze die Hauptroute
REST_ROUTER.prototype.handleRoutes= function(router,connection,sha256) {
    router.get("/",function(req,res){
        res.json({"Data" : unixTime(new Date()) + ' ' +"Welcome to the first closed-beta Coffee-Apps DEV API !"});
    })
    //der neue router für die launcher updates, dieser übernimmt absofort alle neuen Anfragen ab UnityLife Launcher Version
    router.get("/unitylife/cc",function(req,res){
        getJSON('https://cloud.coffee-apps.com/cc/unitylife/updates/updates.json', function(error, response){
        if(response == undefined) {
            console.log(unixTime(new Date()) + ' ' +'[FATAL] die update.json konnte nicht empfangen werden!');
            res.json({"FATAL" : unixTime(new Date()) + ' ' +"die update.json konnte nicht empfangen werden !"});
        } else {
            data = response;
            var result = jsonQuery('[**]version', {data: data}).value
            updateversion = result;
            updateurl = "https://cloud.coffee-apps.com/cc/unitylife/updates/win32-x64-prod-v" + updateversion + "/" + "Unity-Life Setup " + updateversion + ".exe";
            //leite zum download weiter ;)
            res.redirect(updateurl);
        }  
        })
    });
    //der neue Admin Client
    router.get("/unitylife/ac",function(req,res){
        getJSON('https://cloud.coffee-apps.com/ac/unitylife/updates/updates.json', function(error, response){
        if(response == undefined) {
            console.log(unixTime(new Date()) + ' ' +'[FATAL] die update.json konnte nicht empfangen werden!');
            res.json({"FATAL" : unixTime(new Date()) + ' ' +"die update.json konnte nicht empfangen werden !"});
        } else {
            data = response;
            var result = jsonQuery('[**]version', {data: data}).value
            updateversion = result;
            updateurl = "https://cloud.coffee-apps.com/ac/unitylife/updates/win32-x64-prod-v" + updateversion + "/" + "Unity-Life Setup " + updateversion + ".exe";
            //leite zum download weiter ;)
            res.redirect(updateurl);
        }  
        })
    });
    //setze route für die mods list
    router.get("/unitylife/mods", function(req,res){
        getJSON('https://webstorage1.gaming-provider.com/dwcentral/ParadiseLife/static/mods.json', function(error, response){
            if(response == undefined){
                console.log(unixTime(new Date()) + ' ' +'[FATAL] die mods liste konnte nicht empfangen werden!');
                res.json({"FATAL" : unixTime(new Date()) + ' ' +"die mods liste konnte nicht empfangen werden !"});
            } else {
                data = response.data;
                res.json({data});
            }
        })
    });
    //setze route für die Hashlist
    router.get("/unitylife/mod/hashlist/1", function(req,res){
        getJSON('https://unity-life.coffee-apps.com/launcher/files/hashlist.json', function(error, response){
            if(response == undefined){
                console.log(unixTime(new Date()) + ' ' +'[FATAL] die Hashlist konnte nicht empfangen werden !');
                res.json({"FATAL" : unixTime(new Date()) + ' ' +"die Hashlist konnte nicht empfangen werden !"});
            } else {
                data = response;
                res.json({data})
            }
        })
    });
    //setze route für den a3server
    router.get("/unitylife/a3server",function(req,res){
        Gamedig.query({
            type: 'arma3',
            host: '79.133.48.120',
            port: '2302'
        
        },
            function(e,state) {
                if(e) console.log(unixTime(new Date()) + ' ' +"[INFO] Arma3 Server is offline");
                else res.json({"data" : state});
        });
    });
    //setze route für den ts3server
    router.get("/unitylife/ts3server",function(req,res){
        Gamedig.query({
            type: 'teamspeak3',
            host: '79.133.50.71',
            port: '9988'
        
        },
            function(e,state) {
                if(e) console.log(unixTime(new Date()) + ' ' +"[INFO] Teamspeak Server is offline");
                else res.json({"data" : state});
        });
    });
    //setze die route für den newsletter (very buggy)
    router.post("/newsletter",function(req,res){
        var query = "INSERT INTO ?? (??) VALUES (?)";
        var table = ["user_newsletter","user_email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : unixTime(new Date()) + ' ' +"Dies ist ein ERROR, hast du deine Email bereits eingetragen?"});
            } else {
                res.json({"Error" : false, "Message" : unixTime(new Date()) + ' ' +"Deine Email wurde erfolgreich hinzugefügt!"});
            }
        });
    });
}
//exportiere die ganze scheiß js
module.exports = REST_ROUTER;