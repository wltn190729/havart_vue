import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import layoutStores from './layout'
import authorizeStore from './auth'

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    layout: layoutStores,
    authorize: authorizeStore
  }
})
