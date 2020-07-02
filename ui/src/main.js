// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App'
import router from './router'

// import the styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
import 'vue-select/dist/vue-select.css';

Vue.config.productionTip = false

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,

    data() {
        return {
            //ready: false,
            thumbsUrl: "//datalad-datasets.github.io/ohbm2020-posters-thumbnails/thumbs", 
        }
    },

    mounted() {
    },
})
