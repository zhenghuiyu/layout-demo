import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    breadcrumb: []
  },
  mutations: {
    addBreadcrumb(state, payload) {
      if (JSON.stringify(state.breadcrumb).indexOf(JSON.stringify(payload)) < 0) {
        state.breadcrumb.push(payload)
      }
    },
    removeBreadcrumb(state, payload) {
      state.breadcrumb.map((item, index) => {
        if (JSON.stringify(item) == JSON.stringify(payload)) {
          state.breadcrumb.splice(index, state.breadcrumb.length)
        }
      })
    },
    resetBreadcrumb(state,payload) {
      state.breadcrumb = []
    }
  },
  modules: {
    app,
    settings,
    user,
    permission,
    tagsView
  },
  getters
})

export default store
