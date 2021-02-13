import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'
import Backup from '../views/Backup.vue'
import ChannelSettings from '../views/ChannelSettings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/backup',
    name: 'Backup',
    component: Backup
  },
  {
    path: '/channelsettings',
    name: 'ChannelSettings',
    component: ChannelSettings
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
