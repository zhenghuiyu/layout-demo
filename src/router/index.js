import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'
// 同步路由
export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/home',
    component: Layout,
    redirect: 'home',
    meta: { title: '测试' },
    children: [{
      path: '/home',
      component: (resolve) => require(['@/views/home'], resolve),
      meta: { title: '测试', noLogin: true }
    }]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/index',
    meta: { title: '测试2' },
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/test'], resolve),
        meta: { title: '测试2', noLogin: true }
      },
      {
        path: 'test2',
        component: (resolve) => require(['@/views/test2'], resolve),
        meta: { title: '测试22', noLogin: true }
      },
      {
        path: 'test3',
        component: (resolve) => require(['@/views/test3'], resolve),
        meta: { title: '测试3', noLogin: true },
        children: [
          {
            path: 'index',
            component: (resolve) => require(['@/views/test3/test3/index'], resolve),
            meta: { title: '测试3-1' }
          },
          {
            path: 'test4',
            component: (resolve) => require(['@/views/test3/test4/index'], resolve),
            meta: { title: '测试3-2' }
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/home', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
