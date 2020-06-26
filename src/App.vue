<template>
  <div id="app">
    <b-navbar toggleable="md" type="light" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <!-- <b-navbar-brand to="/" exact> Home </b-navbar-brand> -->

      <b-collapse is-nav id="nav_collapse">
        <!--  Here are links to different routes, once we add them  -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/" exact>Home</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <br />

    <div>
        <router-view></router-view>
    </div>

    <footer>
        <div class="fluid-container footer"></div>
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
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*
 * DataLad Static Index styles
 */
body{ max-width: 1200px; margin: 2em auto; }
.dataTables_filter { position: relative; clear: both; float: unset !important; }
#directory_filter > label { float: right; }
span.breadcrumb { font-size: 13pt; float: left; margin: 0.3em 1.3em .3em .3em; }
span.breadcrumb a { text-decoration: none; }
span.cwd { font-weight: bold; color: #777777; }
span.dir { font-weight: bold; color: #00A1CB; }
span.git { font-weight: bold; color: #00BA88; }
span.annex { font-weight: bold; color: #EC6C20; }
span.gittag { font-size: 70%; font-weight: normal;  vertical-align: super;}

td.dir { font-weight: bold; color: #00A1CB; cursor: pointer;}
td.git { font-weight: bold; color: #00BA88; cursor: pointer;}
td.uninitialized { font-weight: bold; color: #00BA88; text-decoration: line-through; }
td.annex { font-weight: bold; color: #EC6C20; cursor: pointer;}
td.link-broken { color:#E53B51; }
td.link { color: #FFD03C; cursor: pointer;}
td.file { color: #67CDDC; }

#installation { font-size: 90%; background-color: #fcfcfc; padding: 0em 0.5em 0.5em 0.5em; margin: 0em 0.5em 0.5em 0.5em; }
.command { font-family: monospace; font-weight: bold; color: darkgray; padding-left: 2em;}
.command-option { font-family: monospace; font-weight: bold; color: darkgray; }

#img_external_link {
    background-image: "@/assets/img/external-link-symbol.svg";
    background-repeat: no-repeat;
    display: inline-block;
    width: 0.7em;
    height: 0.7em;
    margin: 0;
    padding: 0;
}

#README {
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    padding: 1em;
    padding-top: 0;
    margin-top: 1em;
}
</style>
