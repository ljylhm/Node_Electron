import Vue from 'vue'
import Router from 'vue-router'
import { helper } from "@helper"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/index",
      name: 'index',
      component: require('@/page/index').default,
    },
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    }, {
      path: "/gzipImg",
      name: 'gzip-img',
      component: require('@/page/gzipImg').default,
    }, {
      path: "/upLoad",
      name: 'upLoad',
      component: require('@/page/upLoad').default,
    }, {
      path: "/download",
      name: 'download',
      component: require('@/page/download').default,
    }
  ]
})
