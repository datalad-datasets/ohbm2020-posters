<template>
<div class="poster" v-show="data.match">
    <div v-if="data.visible">
        <h3 class="number"><b-badge variant="light">{{data.number}}</b-badge></h3>
        <b-button variant="primary" size="sm" class="chatbutton" :class="{online: data.people>0}" @click="openChat">
            Video Chat <span v-if="data.people>0"> ({{data.people}} people online)</span>
        </b-button> 

        <p class="pdf">
            <a v-if="data.pdf" :href="data.pdf" :target="'pdf_'+data.number">
                <span class="openpdflabel">Open PDF</span>
                <img v-lazy="$root.thumbsUrl+'/'+data.number+'.x200.jpg'" height="200px" class="thumbnail" 
                    data-error="$root.thumbsUrl+'/'+noposter.jpg"/>
            </a>
            <a href="https://github.com/datalad-datasets/ohbm2020-posters/edit/gh-pages/posters-overrides.json">
                <div v-if="!data.pdf" class="pdfmissing">
                        We couldn't find your PDF!
                        Please edit overrides.json and send us the PR.
                </div>
            </a>
        </p>
        <b-badge variant="danger" v-if="data.isDemo">Software DEMO</b-badge>
        <span class="title"><i>{{data.title}}</i></span>
        <br>

        <div v-for="(cat, idx) in data.categories" :key="idx" class="cat clickable" @click="addCat(cat)">
            <span :style="{backgroundColor: catColor(cat)}" class="catbull">&nbsp;</span> {{cat}}
        </div>
        <br>

        <span class="presenter clickable" @click="addToken(data.presenter)">{{data.presenter}}</span> -
        <span class="inst clickable" @click="addToken(data.institution)">{{data.institution}}</span>
        <br>

        <div class="authors">
            <span class="author clickable" v-for="(author, idx) in data.authors" :key="idx" @click="addToken(author)">
                {{author}} <small style="opacity: 0.5">|</small>&nbsp;
            </span>
        </div>
        <br>

        <span class="isdemo">{{data.isdemo}}</span>
        <br>
    </div>
</div>
</template>

<script>

import Vue from 'vue'

let catColors = {};

export default {
    props: [ 'data' ],
    methods: {
        catColor(cat) {
            if(catColors[cat]) return catColors[cat];
            let hash = cat.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
            let numhash = Math.abs(hash+120)%360;
            let color = "hsl("+(numhash%360)+", 50%, 56%)"
            catColors[cat] = color;
            return color;
        },
    
        openChat() {
            let roomroute;
            let name = "ohbm2020-"+this.data.number; //default
            if(this.data.videochat) name = this.data.videochat; //user can override it to another jitsi name
            if(this.data.videochat && this.data.videochat.startsWith("http")) {
                //or use custom url
                window.open(this.data.videochat, name);
            } else {
                window.open("#/room/"+this.data.number+"/"+name, name);
            }
        },

        addToken(token) {
            this.$emit("addToken", token);
        },
        addCat(cat) {
            this.$emit("addCat", cat);
        },
    },
    data() {
        return {
        }
    },
    mounted() { 
        
    },
}
</script>

<style scoped>
.poster {
    float: left;
    display: inline-block;
    width: 300px;
    color: #666;
    height: 350px;
    overflow: hidden;
    background-color: white;
    padding: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    position: relative;

    font-size: 80%;
}
.number {
position: absolute;
top: 0;
right: 5px;
}
.demo {
position: absolute;
top: 0;
left: 5px;
}
.pdf {
margin-bottom: 0;
}
.pdfmissing {
display: inline-block;
height: 200px;
width: 200px;
background-color: #bbb;
color: #fff9;
padding: 20px;
}
.pdfmissing:hover {
color: #333;
text-decoration: underline;
}
.number {
opacity: 0.8;
}
.title {
color: black;
}
.presenter {
font-weight: bold;
color: black;
font-size: 80%;
}
.inst {
font-weight: bold;
font-size: 80%;
}
.cat {
display: inline-block;
margin-right: 5px;
font-size: 85%;
}
.catbull {
width: 10px;
}
.authors {
font-size: 80%;
color: #666;
}
.author {
}
.thumbnail {
background-color: #eee; 
box-shadow: 1px 1px 2px #0001;
border: 3px solid white;
}
.openpdflabel {
position: absolute;
top: 5px;
left: 5px;
color: white;
background-color: #666;
padding: 6px 8px;
border-radius: 3px;
display: none;
}
.poster:hover .thumbnail {
border: 3px solid #0006;
}
.poster:hover .openpdflabel {
display: block;
}
.chatbutton {
position: absolute;
top: 174px;
left: 5px;
display: none;
}
.chatbutton.online, 
.poster:hover .chatbutton {
display: block;
}
.clickable:hover {
cursor: pointer;
background-color: #eee;
color: #007bff;
}
</style>
