const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

function log(){
    let d = new Date();
    console.log(d.toLocaleString("en-US"), ...arguments);
};

var aWss = expressWs.getWss('/');
 
/*
app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
*/
 
app.get('/', function(req, res, next){
  log('get route', req.testing);
  res.end();
});
 
let ips = {};
let counts = {};
app.ws('/', function(ws, req) {
    ws.on('message', function(data) {
        //console.log("message received", msg);
        try {
            //console.debug(data);
            let msg = JSON.parse(data);
            let ip = req.headers["x-real-ip"];
            let entry;

            switch(msg.action) {
            case "dump":
                log("dump:", ip);
                ws.send(JSON.stringify({dump: counts}));
                break;
            case "jit":
                if(!ips[msg.id]) ips[msg.id] = [];
                log("jit:", ip, msg.id);
                entry = ips[msg.id].find(c=>c.ip==ip);
                if(!entry) {
                    log("new ip", ip);
                    ips[msg.id].push({ip, date: new Date()});
                } else {
                    log("exising ip");
                    entry.date = new Date();
                }
                console.dir(ips[msg.id]);
                counts[msg.id] = ips[msg.id].length;
                aWss.clients.forEach(function (client) {
                    client.send(JSON.stringify({update: {id: msg.id, count: counts[msg.id]}}));
                });
                break;
            case "jitclose":
                log("jitclose:", ip, msg.id);
                if(!ips[msg.id]) ips[msg.id] = []; //could hapen
                entry = ips[msg.id].find(c=>ip == ip);
                ips[msg.id].splice(ips[msg.id].indexOf(entry), 1);
                counts[msg.id] = ips[msg.id].length;
                aWss.clients.forEach(function (client) {
                    client.send(JSON.stringify({update: {id: msg.id, count: counts[msg.id]}}));
                });
                if(counts[msg.id] == 0) delete counts[msg.id];
                break;
            }
        } catch (err) {
            console.error(err);
        }
    });
});

setInterval(()=>{
    for(let id in ips) {
        let recents = [];
        let recent = new Date();
        recent.setTime(recent.getTime() - 1000*60*5); //we can shorten this now that clients are polling
        ips[id].forEach(rec=>{
            if(rec.date > recent) recents.push(rec);
        });
        ips[id] = recents;
        if(counts[id] != ips[id].length) {
            log("expire:", id);
            //need to update the counts
            counts[id] = ips[id].length;
            aWss.clients.forEach(function (client) {
                client.send(JSON.stringify({update: {id, count: counts[id]}}));
            });
        }
    }
}, 1000*60);
 
log("listening");
app.listen(3000);
