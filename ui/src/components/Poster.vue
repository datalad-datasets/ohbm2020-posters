<template>
<div class="poster">
    <h3 class="number"><b-badge variant="secondary">{{data.number}}</b-badge></h3>
    <b-button variant="primary" size="sm" class="chatbutton" :class="{online: data.people>0}">
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

    <b-badge pill v-for="(cat, idx) in data.categories" :key="idx" 
        class="cat" 
        :style="{backgroundColor: catColor(cat)}">{{cat}}&nbsp;
    </b-badge>
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
            return color;
        },
    },
    data() {
        return {
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

    font-size: 70%;
}
.number {
position: absolute;
top: -1px;
left: 2px;
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
}
.cat {
margin-right: 5px;
}
.inst {
font-weight: bold;
}
.authors {
font-size: 80%;
}
.author {
color: #333;
}
.thumbnail {
background-color: #eee; 
box-shadow: 1px 1px 2px #0001;
}
.chatbutton {
position: absolute;
bottom: 10px;
right: 10px;
display: none;
}
.chatbutton.online, 
.poster:hover .chatbutton {
display: block;
}
</style>
