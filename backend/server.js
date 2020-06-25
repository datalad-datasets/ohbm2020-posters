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
            console.log(data);
            let msg = JSON.parse(data);
            switch(msg.action) {
            case "dump":
                console.log("dump requested from", req.headers);
                ws.send(JSON.stringify({dump: counts}));
            case "jit":
                if(!ips[msg.id]) ips[msg.id] = [];
                let ip = req.headers["x-real-ip"];
                console.log("jit open", ip);
                let entry = ips[msg.id].find(c=>ip == ip);
                if(!entry) {
                    ips[msg.id].push({ip, date: new Date()});
                } else {
                    entry.date = new Date();
                }
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
    console.log('socket', req.testing);
});

setInterval(()=>{
    console.log("removing old connections");
    for(let id in ips) {
        let recents = [];
        let recent = new Date();
        recent.setTime(recent.getTime() - 1000*60*10); //10 minutes?
        ips[id].forEach(rec=>{
            if(rec.date > recent) recents.push(rec);
        });
        ips[id] = recents;
        if(counts[id] != ips[id].length) {
            //need to update the counts
            counts[id] = ips[id].length;
            console.log("new count for", id, counts[id]);
            aWss.clients.forEach(function (client) {
                client.send(JSON.stringify({update: {id, count: counts[id]}}));
            });
        }
    }
}, 1000*60);
 
console.log("listening");
app.listen(3000);
