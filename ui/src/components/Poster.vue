<template>
<div class="poster">
    <h3 class="number"><b-badge variant="light">{{data.number}}</b-badge></h3>
    <h4 class="demo" v-if="data.isDemo"><b-badge variant="danger">Software DEMO</b-badge></h4>
    <b-button variant="primary" size="sm" class="chatbutton" :class="{online: data.people>0}" @click="openChat">
        Video Chat <span v-if="data.people>0"> ({{data.people}} people online)</span>
    </b-button> 

    <p class="pdf">
        <a :href="data.pdf" :target="'pdf_'+data.number">
            <img v-lazy="$root.thumbsUrl+'/'+data.number+'.x200.jpg'" height="200px" class="thumbnail" 
                data-error="$root.thumbsUrl+'/'+noposter.jpg"/>
        </a>
    </p>
    <span class="title"><i>{{data.title}}</i></span>
    <br>

    <div v-for="(cat, idx) in data.categories" :key="idx" class="cat">
        <span :style="{backgroundColor: catColor(cat)}" class="catbull">&nbsp;</span> {{cat}}
    </div>
    <br>

    <span class="presenter">{{data.presenter}}</span> |
    <span class="inst">{{data.institution}}</span>
    <br>

    <div class="authors">
        <span class="author" v-for="(author, idx) in data.authors" :key="idx">{{author}} <small style="opacity: 0.5">|</small>&nbsp;</span>
    </div>
    <br>

    <span class="isdemo">{{data.isdemo}}</span>
    <br>

</div>
</template>

<script>

let catColors = {};

export default {
    props: [ 'data' ],
    methods: {
        catColor(cat) {
            if(catColors[cat]) return catColors[cat];
            let hash = cat.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
            let numhash = Math.abs(hash+120)%360;
            let color = "hsl("+(numhash%360)+", 50%, 55%)"
            catColors[cat] = color;
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
    },
    data() {
        return {
            //publicPath: process.env.BASE_URL
        }
    }
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
}
.chatbutton {
position: absolute;
bottom: 10px;
left: 10px;
display: none;
}
.chatbutton.online, 
.poster:hover .chatbutton {
display: block;
}
</style>
