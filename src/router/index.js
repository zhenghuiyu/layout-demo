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
    redirect: '',
    name: '测试',
    meta: { title: '测试' },
    children: [{
      path: '/home',
      name: '测试',
      component: (resolve) => require(['@/views/home'], resolve),
      meta: { title: '测试', noLogin: true }
    }]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/index',
    meta: { title: '测试2' },
    name: '测试2',
    children: [
      {
        path: 'index',
        name: '测试2',
        component: (resolve) => require(['@/views/test'], resolve),
        meta: { title: '测试2', noLogin: true }
      },
      {
        path: 'test3',
        component: (resolve) => require(['@/views/test3'], resolve),
        redirect: '/test/test3/index',
        meta: { title: '测试3', noLogin: true },
        name: '测试3',
        children: [
          {
            path: 'index',
            name: '测试3-1',
            component: (resolve) => require(['@/views/test3/test3/index'], resolve),
            meta: { title: '测试3-1' }
          },
          {
            path: 'test4',
            name: '测试3-2',
            component: (resolve) => require(['@/views/test3/test4/index'], resolve),
            meta: { title: '测试3-2' }
          }
        ]
      },
      {
        path: 'test2',
        name: '测试22',
        component: (resolve) => require(['@/views/test2'], resolve),
        meta: { title: '测试22', noLogin: true }
      }
    ]
  },
  { path: '*', redirect: '/home', hidden: true }
]

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

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
