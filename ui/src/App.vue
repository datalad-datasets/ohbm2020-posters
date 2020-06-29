<template>
<div id="app">
    <!--    
    <b-navbar toggleable="md" type="light" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/" exact>Home</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <br />
    -->
    <router-view></router-view>
    <footer>
        <div class="fluid-container footer">
        </div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

export default {
    name: 'app'
}
</script>

<style>
html, body {
background-color: #eee;
color: #333;
}
h1 {
font-size: 20pt;
}
</style>
