#!/usr/bin/env node
const posters = require('../posters.json');
const async = require('async');
const axios = require('axios');
const fs = require('fs');

async.eachSeries(posters.posters, (poster, next_poster)=>{
    if(!poster.pdf) return next_poster();
    let path = __dirname+"/../posters/"+poster.number+".pdf";
    if(fs.existsSync(path)) return next_poster();
    console.dir(poster);

    axios({
        method: 'get',
        url: encodeURI(poster.pdf),
        responseType: 'stream',
    }).then(res=>{
        let outstream = fs.createWriteStream(path);
        res.data.pipe(outstream).on('finish', next_poster);
    }).catch(err=>{
        console.error(err);
        next_poster();
    });
}, err=>{
    if(err) throw err;
});
