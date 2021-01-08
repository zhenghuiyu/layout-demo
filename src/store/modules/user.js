import { removeCookie } from '@/utils/auth'

const user = {
  state: {
  },

  mutations: {
  },

  actions: {
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeCookie('token')
        removeCookie('usernameForm')
        resolve()
      })
    }
  }
}

export default user
