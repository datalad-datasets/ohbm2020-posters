<template>
<div>
    <b-container>
        <div class="header">
            <a href="https://brainlife.io">
                <img src="@/assets/img/brainlife_logo2.png" align="right" width="75px" class="brainlifelogo"/>
            </a>
            <a href="http://www.datalad.org">
                <img src="@/assets/img/datalad_logo.svg" align="right" width="75px">
            </a>
            <h1><b>OHBM2020 Posters</b></h1>
            <p>
                Centralized registry of Jitsi audio-video conference rooms per each poster or software demo of OHBM 2020.
            </p>
        </div>

        <div class="instruction">
            <p>
            For every poster there is a dedicated Jitsi room, which would open in a "dedicated" new window/tab.
            Please search by poster number, keywords, names, etc.
            Posters with non-0 people on the video chat are shown with a persistent "online" counts. The counts are approximate and count only people attending through this page.
            More info, sources, issues, PRs: <a href="https://github.com/datalad-datasets/ohbm2020-posters.">https://github.com/datalad-datasets/ohbm2020-posters.</a>
            </p>
            
            <p>
                Alternative interface: <a href="https://brain-web.github.io/ohbm2020/">BrainWeb</a> - interactive posters map.
            </p>
        </div>

        <div class="search">
            <b-form-input v-model="search" placeholder="Search Posters / Demos" debounce="500"/>
            <div class="adsearch">
            <b-row>
                <b-col>
                    <b-form-group label="Also Filter By">
                        <b-form-checkbox v-model="filterOnline">Only show entries with someone on the video chat</b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col>
                    <b-form-group label="Entry Type">
                        <b-form-radio-group v-model="filterEntry">
                            <b-form-radio value="any">Any</b-form-radio>
                            <b-form-radio value="demo">Software Demo</b-form-radio>
                            <b-form-radio value="nondemo">Non Demo</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                </b-col>

                <b-col>
                    <b-form-group label="Categories">
                        <v-select multiple v-model="catFilter" :options="categories" style="background-color: white;"></v-select>
                    </b-form-group>
                </b-col>

                <!--
                <b-form-group label="Categories">
                    <b-form-checkbox v-for="cat in categories" v-model="catFilter[cat]">{{cat}}</b-form-checkbox>
                </b-form-group>
                -->
            </b-row>
            </div>
        </div>
        <p v-if="!posters" class="loading">Loading.. <b-icon icon="arrow-clockwise" animation="spin" font-scale="1"></b-icon></p>
    </b-container>
        
    <b-container fluid>
        <div class="side" v-if="posters">
        </div>

        <div class="content">
            <div v-if="posters">
                <poster ref="poster" v-for="poster in posters" :key="poster.number" :data="poster"/>
            </div>
        </div>
    </b-container>

    <b-container v-if="posters">
        <br clear="all">
        <p style="margin: 10px; padding: 10px; border-top: 1px solid #0001; opacity: 0.5;">
            Showing {{posters.filter(p=>p.match).length}} entires</small>
        </p>
    </b-container>
</div>
</template>

<script>

import Poster from '@/components/Poster.vue'
import { BIcon, BIconArrowClockwise } from 'bootstrap-vue'

import ReconnectingWebSocket from 'reconnecting-websocket';

export default {
    components: {
        Poster,
        BIcon,
        BIconArrowClockwise,
    },

    data() {
        return {
            posters: null,
            wss: null,

            search: "",
            categories: [],

            filterOnline: false,
            filterEntry: "any",
            catFilter: [],
        }
    },
    watch: {
        search() {
            this.applyFilter();
        },
        filterOnline() {
            this.applyFilter();
        },
        filterEntry() {
            this.applyFilter();
        },
        catFilter() {
            this.applyFilter();
        },
    },

    mounted() {
        this.loadData().then(()=>{
            //console.log("done loading posters.. now connecting to ws for online update");
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

        window.addEventListener('scroll', this.checkVisibility);
        window.addEventListener('resize', this.checkVisibility);
    },

    destroyed() {
        window.removeEventListener('scroll', this.checkVisibility);
        window.removeEventListener('resize', this.checkVisibility);
    },

    methods: {
        checkVisibility(e) {
            //find visible posters
            let vs = new Set();
            this.$refs["poster"].forEach(p=>{
                let ptop = p.$el.offsetTop;
                let pheight = p.$el.offsetHeight;
                if( ptop > window.scrollY && ptop < window.scrollY + window.innerHeight ||
                    ptop+pheight > window.scrollY && ptop+pheight < window.scrollY + window.innerHeight) {
                    vs.add(p.data.number);
                }
            });
            this.posters.forEach(p=>{
                if(vs.has(p.number)) p.visible = true;
            });
        },

        async loadData() {
            //load posters
            let res = await fetch("//datalad-datasets.github.io/ohbm2020-posters/posters.json");
            let data = await res.json();
            data.posters.forEach(p=>{
                p.videochat = null; //let's ignore this now (override only)
            });

            //load overrides
            res = await fetch("//datalad-datasets.github.io/ohbm2020-posters/posters-overrides.json");
            let override = await res.json();
            override.posters.forEach(o=>{
                let p = data.posters.find(p=>p.number == o.number);
                Object.assign(p, o);
            });

            //clean up a bit
            data.posters.forEach(p=>{
                //p.id = 'p'+p.number; //cannot be number (or string of number)
                p.people = 0;
                if(p.categories.includes("<br>")) p.categories = p.categories.split("<br>");
                if(p.categories.includes(",")) p.categories = p.categories.split(",");
                p.categories = p.categories.filter(cat=>cat != "");
                p.isDemo = (p["software-demo"] == "x");

                p.match = true;
                p.visible = false;
            });

            //list all categories
            this.categories = [];
            data.posters.forEach(p=>{
                p.categories.forEach(cat=>{
                    if(!this.categories.includes(cat)) {
                        this.categories.push(cat);
                    }
                });
            });
            this.categories.sort();

            this.posters = data.posters;
            this.$nextTick(()=>{
                this.checkVisibility();
            });
        },
        applyFilter() { 
            if(!this.posters) return; //not yet loaded

            //console.log("applying filter..");
            //console.time("filter");
            let searchTokens;
            if(this.search.trim() != "") searchTokens = this.search.trim().toLowerCase().split(" ");

            function filter(p) {
                if(this.filterOnline && p.people == 0) return false;

                if(this.filterEntry == "demo" && !p.isDemo) return false;
                if(this.filterEntry == "nondemo" && p.isDemo) return false;

                let title = p.title.toLowerCase();
                let inst = p.institution.toLowerCase();
                let presenter = p.presenter.toLowerCase();
                let categories = p.categories.toString().toLowerCase();
                let authors = p.authors.toString().toLowerCase();

                for(let cat of this.catFilter) {
                    if(!p.categories.includes(cat)) return false;
                }

                if(searchTokens) {
                    //make sure something matches each token
                    for(let token of searchTokens) {
                        if(p.number == token) return true;
                        if(title.includes(token)) return true;
                        if(inst.includes(token)) return true;
                        if(presenter.includes(token)) return true;
                        if(categories.includes(token)) return true;
                        if(authors.includes(token)) return true;
                    }
                    return false;
                }

                return true;
            }

            this.posters.forEach(p=>{
                p.match = filter.call(this, p);
            });
            this.$nextTick(()=>{
                this.checkVisibility();
            });
        },
    },

    computed: {
    },
}
</script>

<style scoped>
.header {
margin-top: 20px;
padding: 10px 0;
color: #666;
}
.search {
padding-top: 20px;
padding-bottom: 50px;
}
.search input {
border-radius: 0;
font-size: 1.5rem;
border: none;
box-shadow: 2px 2px 3px #0001;
}
.search input::placeholder {
opacity: 0.4;
}
/*
.side {
float: right;
width: 200px;
font-size: 80%;
}
.content {
margin-right: 210px;
}
*/
.loading {
font-size: 150%;
opacity: 0.5;
}
.adsearch {
font-size: 80%; 
margin-top: 10px;
}
.brainlifelogo {
background-color: #ddd;
border-radius: 5px;
padding: 5px;
position: relative;
top: -10px;
margin-left: 10px;
}
</style>
