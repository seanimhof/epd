import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import Registry from '../views/Registry.vue'
import Audit from '../views/Audit.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/registry',
    name: 'Registry',
    component: Registry
  },
  {
    path: '/audit',
    name: 'Audit',
    component: Audit
  }
]

const router = createRouter({
  history: createWebHashHistory('/epd'),
  routes
})

export default router
