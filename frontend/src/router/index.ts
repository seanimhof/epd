import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import Registry from '../views/Registry.vue'
import Audit from '../views/Audit.vue'
import Search from '@/views/Search.vue'
import Insert from '@/views/Insert.vue'
import DetailView from '@/views/DetailView.vue'
import Login from '@/views/Login.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/registry',
    name: 'Registry',
    component: Registry
  },
  {
    path: '/audit',
    name: 'Audit',
    component: Audit
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/insert',
    name: "Insert",
    component: Insert
  },
  {
    path: '/detail/:id',
    name: 'epd-detail',
    component: DetailView,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  { path: '/', redirect: '/login' },
]

const router = createRouter({
  history: createWebHashHistory('/epd'),
  routes
})

export default router
