<template>
<div id="app">
    <router-view></router-view>
    <footer>
        <div class="fluid-container footer">
        </div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: 'app'
}
</script>

<style>
html, 
body {
background-color: #eee !important;
color: #333;
}
h1 {
font-size: 20pt;
}
</style>
