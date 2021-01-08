<template>
  <div class="top-nav">
    <div class="right-menu-box">
<!--      <span class="log" @click="toPath">-->
<!--        <svg-icon icon-class="logo" />-->
<!--      </span>-->
      <el-menu
        :default-active="activeTop"
        active-text-color="#fff"
        mode="horizontal"
        @select="handleSelect">
        <div v-for="item in routes" :key="item.path" class="nav-item">
          <app-link :to="resolvePath(item)">
            <el-menu-item
              v-if="!item.hidden"
              :index="item.path"
            >{{ item.meta ? item.meta.title : item.children[0].meta.title }}</el-menu-item>
          </app-link>
        </div>
      </el-menu>
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          测试测试
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="">
            <el-dropdown-item>账户设置</el-dropdown-item>
          </router-link>
          <el-dropdown-item>主题设置</el-dropdown-item>
          <el-dropdown-item>切换租户</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppLink from './Sidebar/Link'
import { constantRoutes } from '@/router'
// import variables from '@/styles/variables.scss'
import { isExternal } from '@/utils/validate'
// import { getCookie } from '@/utils/auth'

export default {
  name: 'Topbar',
  components: {
    AppLink
  },
  data() {
    return {
      // routes: constantRoutes,
    }
  },
  computed: {
    ...mapGetters([
      // 'permission_routes',
      // 'avatar',
      // 'name',
      // 'token'
    ]),
    userInfo() {
      return this.$store.state.user.userInfo
    },
    activeTop() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeTop) {
        return meta.activeTop
      }
      // 如果是首页，首页高亮
      if (path === '/home') {
        // this.$store.dispatch('app/toggleSideBarHide', true)
        return '/home'
      }
      // 如果不是首页，高亮一级菜单
      const activeTop = '/' + path.split('/')[1]
      return activeTop
    },
    // variables() {
    //   return variables
    // },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    routes() {
      return constantRoutes
      // return this.$store.getters.permission_routes
    }
  },
  watch: {
    $route: {
      handler() {
        this.initCurrentRoutes()
      },
      deep: true
    }
  },
  mounted() {
    this.initCurrentRoutes()
  },
  methods: {
    // 通过当前路径找到二级菜单对应项，存到store，用来渲染左侧菜单
    initCurrentRoutes() {
      const { path } = this.$route
      let route = this.routes.find((item) => {
        if (item.path != '') {
          return item.path === '/' + path.split('/')[1]
        } else {
          return item.path
        }
      })
      // 如果找不到这个路由，说明是首页
      if (!route) {
        route = this.routes.find(item => item.path === '')
      }
      this.$store.commit('permission/SET_CURRENT_ROUTES', route)
      // this.setSidebarHide(route)
    },
    // 判断该路由是否只有一个子项或者没有子项，如果是，则在一级菜单添加跳转路由
    isOnlyOneChild(item) {
      if (item.children && item.children.length === 1) {
        return true
      }
      return false
    },
    resolvePath(item) {
      // 如果是个完成的url直接返回
      if (isExternal(item.path)) {
        return item.path
      }
      // 如果是首页，就返回重定向路由
      if (item.path === 'home') {
        const path = item.redirect
        return item.path = path
      }

      // 如果有子项，默认跳转第一个子项路由
      let path = ''
      /**
       * item 路由子项
       * parent 路由父项
       */
      const getDefaultPath = (item, parent) => {
        // 如果path是个外部链接（不建议），直接返回链接，存在个问题：如果是外部链接点击跳转后当前页内容还是上一个路由内容
        if (isExternal(item.path)) {
          path = item.path
          return
        }
        // 第一次需要父项路由拼接，所以只是第一个传parent
        if (parent) {
          path += (parent.path + '/' + item.path)
        } else {
          path += ('/' + item.path)
        }
        // 如果还有子项，继续递归
        if (item.children) {
          getDefaultPath(item.children[0])
        }
      }

      if (item.children) {
        getDefaultPath(item.children[0], item)
        return path
      }
      return item.path
    },
    handleSelect(key, keyPath) {
      console.log(key)
      // 把选中路由的子路由保存store
      const route = this.routes.find(item => item.path === key)
      console.log(route)
      this.$store.commit('resetBreadcrumb', '')
      this.$store.commit('permission/SET_CURRENT_ROUTES', route)
      this.setSidebarHide(route)
    },
    toPath() {
      this.$router.push('/')
      this.$store.dispatch('app/toggleSideBarHide', true)
    },
    // 设置侧边栏的显示和隐藏
    setSidebarHide(route) {
      if (!route.children || route.meta.hideMenu === true) {
        this.$store.dispatch('app/toggleSideBarHide', true)
      } else {
        this.$store.dispatch('app/toggleSideBarHide', false)
      }
    },
    async logout() {
      await this.$store.dispatch('FedLogOut')
    }
  }
}
</script>
<style lang="scss" scoped>
.top-nav{
  background: #1689b6;
  .log{
    cursor: pointer;
    .svg-icon{
      width: 251px;
      height: 30px;
    }
  }
}
</style>
