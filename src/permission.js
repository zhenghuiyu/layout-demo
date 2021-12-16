import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getCookie, removeCookie } from '@/utils/auth'
import { constantRoutes } from '@/router'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = []
constantRoutes.map((item, index) => {
  if (item.children) {
    item.children.map((i, index) => {
      if (i.meta.noLogin) {
        whiteList.push(i.path)
      }
    })
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getCookie('token')) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      removeCookie('token')
      window.location.reload()
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      next()
      // if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
      //   store.dispatch('GetUserInfo').then(res => { // 拉取user_info
      //     const roles = res.data.menu // note: roles must be a array! such as: ['editor','develop']
      //     // console.log(roles)
      //     store.dispatch('GenerateRoutes', roles).then(() => { // 根git a据roles权限生成可访问的路由表
      //       router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      //     })
      //     next({ replace: true })
      //   }).catch(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       // Message.error(err || 'Verification failed, please login again'
      //       next({ path: '/' })
      //     })
      //   })
      // } else {
      //   next({ path: '/401', replace: true, query: { noGoBack: true }})
      // }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next()
      // next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
