import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/about', name: 'About', component: () => import('@/views/About.vue') },
  { path: '/calendar', name: 'Calendar', component: () => import('@/views/CalendarView.vue') },
  { path: '/post/:id', name: 'PostDetail', component: () => import('@/views/PostDetail.vue') },
  { path: '/project/:id', name: 'ProjectDetail', component: () => import('@/views/ProjectDetail.vue') },
  { path: '/404', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
  { path: '*', redirect: '/404' },
]

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

export default router
