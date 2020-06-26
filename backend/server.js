const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

var aWss = expressWs.getWss('/');
 
app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next){
  console.log('get route', req.testing);
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
                console.log("dump:", ip);
                ws.send(JSON.stringify({dump: counts}));
                break;
            case "jit":
                if(!ips[msg.id]) ips[msg.id] = [];
                console.log("jit:", ip, msg.id);
                entry = ips[msg.id].find(c=>c.ip==ip);
                if(!entry) {
                    console.log("new ip", ip);
                    ips[msg.id].push({ip, date: new Date()});
                } else {
                    console.log("exising ip");
                    entry.date = new Date();
                }
                console.dir(ips[msg.id]);
                counts[msg.id] = ips[msg.id].length;
                aWss.clients.forEach(function (client) {
                    client.send(JSON.stringify({update: {id: msg.id, count: counts[msg.id]}}));
                });
                break;
            case "jitclose":
                console.log("jitclose:", ip, msg.id);
                if(!ips[msg.id]) ips[msg.id] = []; //could hapen
                entry = ips[msg.id].find(c=>ip == ip);
                ips[msg.id].splice(ips[msg.id].indexOf(entry), 1);
                counts[msg.id] = ips[msg.id].length;
                aWss.clients.forEach(function (client) {
                    client.send(JSON.stringify({update: {id: msg.id, count: counts[msg.id]}}));
                });
                break;
            }
        } catch (err) {
            console.error(err);
        }
    });
    //console.log('socket', req.testing);
});

setInterval(()=>{
    //console.log("removing ip older than 120 minutes");
    for(let id in ips) {
        let recents = [];
        let recent = new Date();
        recent.setTime(recent.getTime() - 1000*60*120); //120 minutes?
        ips[id].forEach(rec=>{
            if(rec.date > recent) recents.push(rec);
        });
        ips[id] = recents;
        if(counts[id] != ips[id].length) {
            console.log("expire:", id);
            //need to update the counts
            counts[id] = ips[id].length;
            aWss.clients.forEach(function (client) {
                client.send(JSON.stringify({update: {id, count: counts[id]}}));
            });
        }
    }
}, 1000*60);
 
console.log("listening");
app.listen(3000);
