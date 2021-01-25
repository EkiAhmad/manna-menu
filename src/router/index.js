import Vue from 'vue'
import VueRouter from 'vue-router'
import types from 'store/types'
import routes from './routes'
import store from 'src/store'
import jwtDecode from 'jwt-decode'

Vue.use(VueRouter)

export const standardRoutes = {
  login: '/login',
  default: '/landing'
}

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

Router.beforeEach((to, from, next) => {
  store.commit('setCurrTime', (Date.now() / 1000))

  // console.log(to.matched.some(record => record.meta.requiresLogin))
  // console.log(!store.getters.isAuthenticated)

  if (to.matched.some(record => record.meta.requiresLogin) && !store.getters.isAuthenticated) {
    if (!store.state.refreshToken || store.state.refreshToken === 'null') {
      store.dispatch(types.DO_LOGOUT) // backward
    } else {
      next()
    }
  } else if (to.path.startsWith('/login') && store.getters.isAuthenticated) {
    const {
      id,
      role
    } = jwtDecode(store.state.accessToken)
    if (id && role) {
      next(`/admin/dashboard`)
    } else {
      store.dispatch(types.DO_LOGOUT) // backward
    }
  } else {
    next()
  }
})

export default Router
