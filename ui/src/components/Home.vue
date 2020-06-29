<template>
<b-container fluid id="home">
    <div class="header">
        <a href="http://www.datalad.org" alt="DataLad website">
            <img src="@/assets/img/datalad_logo.svg" align="right" width="100px">
        </a>
        <h1><b>OHBM2020 Posters</b></h1>
    </div>

    <div class="search">
        <b-form-input v-model="search" placeholder="Search Posters / Demos"></b-form-input>
    </div>
        
    <div class="side">
        Search facets.. TODO
    </div>

    <div class="content">
        <poster v-for="poster in $root.posters" :key="poster.number" :data="poster"/>
    </div>
</b-container>
</template>

<script>

import Poster from '@/components/Poster.vue'

export default {
    components: {
        Poster,
    },
    data() {
        return {
            test: "hi"
        }
    }
}
</script>

<style scoped>
.header {
padding: 10px 0;
color: #666;
}
.search {
padding-left: 200px;
padding-right: 200px;
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
.side {
float: left;
width: 175px;
}
.content {
margin-left: 200px;
}
</style>
