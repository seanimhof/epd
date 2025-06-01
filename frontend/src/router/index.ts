import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import Registry from '../views/Registry.vue'
import Audit from '../views/Audit.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/epd',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/epd/registry',
    name: 'Registry',
    component: Registry
  },
  {
    path: '/epd/audit',
    name: 'Audit',
    component: Audit
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
