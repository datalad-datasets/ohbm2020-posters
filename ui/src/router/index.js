import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Room from '@/components/Room'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/room/:number/:name', name: 'Room', component: Room },
  ]
})
