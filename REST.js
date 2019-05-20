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
        res.json({"Data" : unixTime(new Date()) + ' ' +"Welcome to our Paradise-RPG Client API! (Powerd by Xedon)"});
    })
    //der neue router für die launcher updates, dieser übernimmt absofort alle neuen Anfragen ab UnityLife Launcher Version
    router.get("/paradiserpg/cc",function(req,res){
        getJSON('https://webstorage1.gaming-provider.com/Projekte/ParadiseRPG/cc/updates/updates.json', function(error, response){
        if(response == undefined) {
            console.log(unixTime(new Date()) + ' ' +'[FATAL] die update.json konnte nicht empfangen werden!');
            res.json({"FATAL" : unixTime(new Date()) + ' ' +"die update.json konnte nicht empfangen werden !"});
        } else {
            data = response;
            var result = jsonQuery('[**]version', {data: data}).value
            updateversion = result;
            updateurl = "https://webstorage1.gaming-provider.com/Projekte/ParadiseRPG/cc/updates/win32-x64-prod-v" + updateversion + "/" + "Unity-Life Setup " + updateversion + ".exe";
            //leite zum download weiter ;)
            res.redirect(updateurl);
        }  
        })
    });
    //setze route für die mods list
    router.get("/paradiserpg/mods", function(req,res){
        getJSON('https://webstorage1.gaming-provider.com/Projekte/ParadiseRPG/cc/static/mods.json', function(error, response){
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
     router.get("/paradiserpg/mod/hashlist/1", function(req,res){
        getJSON('https://webstorage2.gaming-provider.com/dwcentral/ParadiseRPG/files/hashlist.json', function(error, response){
            if(response == undefined){
                console.log(unixTime(new Date()) + ' ' +'[FATAL] die Hashlist konnte nicht empfangen werden !');
                res.json({"FATAL" : unixTime(new Date()) + ' ' +"die Hashlist konnte nicht empfangen werden !"});
            } else {
                data = response;
                res.json({data})
            }
        })
    });
    //setze route für den a3server (life)
    router.get("/paradiserpg/a3server",function(req,res){
        Gamedig.query({
            type: 'arma3',
            host: 'server.paradise-rpg.de',
            port: '2302',
            notes: unixTime(new Date())
        
        },
            function(e,state) {
                if(e) console.log(unixTime(new Date()) + ' ' +"[INFO] Arma3 Server is offline");
                else res.json({"data" : state });
        });
    });
    //setze route für den ts3server
    router.get("/paradiserpg/ts3server",function(req,res){
        Gamedig.query({
            type: 'teamspeak3',
            host: 'ts.paradise-rpg.de',
            port: '9989',
            notes: unixTime(new Date())
        
        },
            function(e,state) {
                if(e) console.log(unixTime(new Date()) + ' ' +"[INFO] Teamspeak Server is offline");
                else res.json({"data" : state });
        });
    });
}
//exportiere die ganze scheiß js
module.exports = REST_ROUTER;
