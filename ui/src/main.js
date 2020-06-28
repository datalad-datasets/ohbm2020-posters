// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'

// import the styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

Vue.config.productionTip = false

import ReconnectingWebSocket from 'reconnecting-websocket';

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,

    data() {
        return {
            //ready: false,
            thumbsUrl: "//datalad-datasets.github.io/ohbm2020-posters-thumbnails/thumbs", 
            posters: null,
            wss: null,
        }
    },

    mounted() {
        this.loadData().then(()=>{

            console.log("done loading posters.. now connecting to ws for online update");

            this.wss = new ReconnectingWebSocket("wss://dev1.soichi.us/ohbm2020/");
            this.wss.onopen = () => {
                this.wss.send(JSON.stringify({action: "dump"}));
            }
            this.wss.onmessage = e => {
                let msg = JSON.parse(e.data);
                if(msg.dump) {
                    for(let key in msg.dump) {
                        let poster = this.posters.find(p=>p.number == key);
                        poster.people = msg.dump[key];
                    }
                }
                if(msg.update) {
                    let poster = this.posters.find(p=>p.number == msg.update.id);
                    poster.people = msg.update.count;
                }
            }

        });
    },

    methods: {
        async loadData() {
            //load posters
            let res = await fetch("//datalad-datasets.github.io/ohbm2020-posters/posters.json");
            let data = await res.json();
            data.posters.forEach(p=>{
                p.id = 'p'+p.number; //cannot be number (or string of number)
                p.people = 0;
                p.videochat = null; //let's ignore this now (override only)
                p.categories = p.categories.split("<br>");
            });

            //load overrides
            res = await fetch("//datalad-datasets.github.io/ohbm2020-posters/posters-overrides.json");
            let override = await res.json();
            override.posters.forEach(o=>{
                let p = data.posters.find(p=>p.number == o.number);
                Object.assign(p, o);
            });

            this.posters = data.posters;
        },
    },
})
