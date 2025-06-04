import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import Registry from '../views/Registry.vue'
import Audit from '../views/Audit.vue'
import Search from '@/views/Search.vue'
import Insert from '@/views/Insert.vue'
import DetailView from '@/views/DetailView.vue'
import Login from '@/views/Login.vue'
import AuditView from '@/views/AuditView.vue'
import Anleitung from '@/views/Anleitung.vue'


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
    path: '/anleitung',
    name: 'Anleitung',
    component: Anleitung
  },
  {
    path: '/audit/:id',
    name: 'EPDAudit',
    component: AuditView
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
    path: '/open/:id',
    name: 'Open',
    component: Login
  },
  { path: '/', redirect: '/search' },
]

const router = createRouter({
  history: createWebHashHistory('/epd'),
  routes
})

export default router
