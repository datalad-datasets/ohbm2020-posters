#!/usr/bin/env node
const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const app = express();
const expressWs = require('express-ws')(app);

function log(){
    let d = new Date();
    console.log(d.toLocaleString("en-US"), ...arguments);
};
 
/*
app.get('/', function(req, res, next){
  log('get route', req.testing);
  res.end();
});
 */
 
let ips = {};
let counts = {};
let connections = {};
app.ws('/', function(ws, req) {
    ws.id = uuid.v4();
    connections[ws.id] = ws;
    ws.on('close',function() { 
        delete connections[ws.id];
    })
    ws.on('message', function(data) {
        try {
            //console.debug(data);
            let msg = JSON.parse(data);
            let ip = req.headers["x-real-ip"]+"."+msg.cid; 
            let entry;

            switch(msg.action) {
            case "dump":
                log("dump:", ip);
                ws.send(JSON.stringify({dump: counts}));
                break;
            case "jit":
                if(!ips[msg.id]) ips[msg.id] = [];
                log("jit:", ip, msg.id, msg.cid, msg.realCount);
                entry = ips[msg.id].find(c=>c.ip==ip);
                if(!entry) {
                    log("new ip", ip);
                    ips[msg.id].push({ip, date: new Date()});
                } else {
                    log("exising ip");
                    entry.date = new Date();
                }
                console.dir(ips[msg.id]);
                let pcount = counts[msg.id];
                if(msg.realCount) counts[msg.id] = msg.realCount;
                else counts[msg.id] = ips[msg.id].length;
                if(pcount != counts[msg.id]) {
                    broadcast({update: {id: msg.id, count: counts[msg.id]}});
                }
                break;
            case "jitclose":
                log("jitclose:", ip, msg.id);
                if(!ips[msg.id]) ips[msg.id] = []; //did happen..
                entry = ips[msg.id].find(c=>ip == ip);
                ips[msg.id].splice(ips[msg.id].indexOf(entry), 1);
                //if(msg.realCount) counts[msg.id] = msg.realCount;
                counts[msg.id] = ips[msg.id].length;
                broadcast({update: {id: msg.id, count: counts[msg.id]}});
                if(counts[msg.id] == 0) delete counts[msg.id];
                break;
            }
        } catch (err) {
            console.error(err);
            }
    });
});

function broadcast(msg) {
    for(let id in connections) {
        if(connections[id].readyState == 1) connections[id].send(JSON.stringify(msg));
    }
}

setInterval(()=>{
    log("running periodic maintenance");

    //clean up old connections (client disappeard without jitclose?)
    for(let id in ips) {
        let recents = [];
        let recent = new Date();
        recent.setTime(recent.getTime() - 1000*30);  
        ips[id].forEach(rec=>{
            if(rec.date > recent) recents.push(rec);
        });
        ips[id] = recents;
        if(counts[id] != ips[id].length) {
            log("expire:", id);
            //need to update the counts
            counts[id] = ips[id].length;
            broadcast({update: {id, count: counts[id]}});
            if(counts[id] == 0) delete counts[id];
        }
    }

    log("writing out sensu metrics");

    //output sensu metrics
    let d = new Date();
    const time = Math.round(d.getTime()/1000);
    let metrics = "";
    for(let id in counts) {
        metrics += "prod.ohbm2020.poster.people."+id+" "+counts[id]+" "+time+"\n";
    }
    console.log(metrics);
    fs.writeFileSync("/tmp/metrics.sensu", metrics);
    log("done maintenance");

}, 1000*60);

log("--------------------------------------------------------------------------");
log("listening");
log("--------------------------------------------------------------------------");
app.listen(3000);



