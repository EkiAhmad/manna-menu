import Vue from 'vue'
import Vuex from 'vuex'
import router, {
  standardRoutes
} from 'src/router'
import jwtDecode from 'jwt-decode'
import types from 'store/types'
import axios from 'axios'
import global from 'store/global'

Vue.use(Vuex)

const state = {
  accessToken: window.localStorage.getItem('menu-token') || null,
  refreshToken: window.localStorage.getItem('refreshToken') || null,
  loading: false,
  exp: 0,
  userId: 0,
  role: 0,
  fullname: '',
  initialized: false,
  currTime: Date.now() / 1000
}

const getters = {
  isAuthenticated(state) {
    if (!state.accessToken || state.accessToken === 'null') {
      return false
    } else {
      if (state.exp) {
        if (state.currTime > state.exp) {
          return false
        }
      }
      return true
    }
  }
}

const mutations = {
  [types.TOKEN_CHANGED](state, token) {
    state.accessToken = token
    if (token) {
      window.localStorage.setItem('menu-token', token)
    } else {
      window.localStorage.setItem('menu-token', '')
    }
  },
  [types.TOKEN_EXTRACTED](state, {
    exp,
    id,
    role,
    fullname
  }) {
    state.exp = exp
    state.userId = id

    state.fullname = fullname
    state.role = role

    state.initialized = true
  },
  setUsername(state, val) {
    state.username = val
  },
  setRefreshToken(state, token) {
    state.refreshToken = token
    window.localStorage.setItem('refreshToken', token)
  },
  setCurrTime(state, val) {
    state.currTime = val
  },
  clearData: (state, val) => {
    state.exp = 0
    state.userId = 0
    state.role = 0
    state.fullname = ''

    state.initialized = false
  },
  setLoading: (state, val) => {
    state.loading = val
  }
}

const cleanUp = (commit) => () => {
  commit(types.TOKEN_CHANGED, null)
  commit('clearData', null)

  router.replace(standardRoutes.login)
}

const actions = {
  [types.SIGN_UP]({
    dispatch
  }, data) {
    return axios
      .post('/account/signup', data)
  },
  [types.RESET_PASSWORD]({
    dispatch
  }, data) {
    return axios
      .post('/account/reset-password', data)
  },
  [types.DO_LOGIN]({
    dispatch
  }, dataLogin) {
    return axios
      .post('/authentication', dataLogin)
      .then(({
        data
      }) => {
        axios.defaults.headers.common['Authorization'] = data.accessToken
        const data_login = {
          ...data,
          isLogin: true
        }
        dispatch(types.EXTRACT_TOKEN, data_login)
      })
  },
  [types.INITIALISE_STORE]({
    dispatch
  }) {
    const accessToken = state.accessToken
    const refreshToken = state.refreshToken

    dispatch(types.EXTRACT_TOKEN, {
      accessToken,
      refreshToken
    })
  },
  [types.DO_LOGOUT]({
    state,
    commit
  }) {
    if (state.refreshToken && state.refreshToken !== 'null') {
      return axios
        .post('/token/revoke')
        .then(cleanUp(commit))
    } else {
      cleanUp(commit)()
      return Promise.resolve('OK')
    }
  },
  [types.EXTRACT_TOKEN]({
    state,
    getters,
    commit,
    dispatch
  }, {
    accessToken,
    refreshToken,
    isLogin
  }) {
    if (refreshToken && refreshToken !== 'null') {
      commit('setRefreshToken', refreshToken)
    }

    // console.log('extract token ' + accessToken)

    if (accessToken && accessToken !== 'null') {
      commit(types.TOKEN_CHANGED, accessToken)

      let jwtExtracted = jwtDecode(accessToken)

      //console.log(JSON.stringify(jwtExtracted))

      commit(types.TOKEN_EXTRACTED, jwtExtracted)

      if (!getters.isAuthenticated) {
        if (refreshToken && refreshToken !== 'null') {
          axios.post('/token/refresh', {
              refreshToken
            })
            .then(({
              data
            }) => {
              commit(types.TOKEN_CHANGED, data.accessToken)

              jwtExtracted = jwtDecode(data.accessToken)
              commit(types.TOKEN_EXTRACTED, jwtExtracted)
            })
            .then(() => {
              const {
                id,
                role
              } = jwtExtracted
              if (isLogin && id && role) {
                router.replace(`/admin/dashboard`)
              }
            })
        } else {
          dispatch(types.DO_LOGOUT)
        }
      } else {
        const {
          id,
          role
        } = jwtExtracted
        if (isLogin && id && role) {
          router.replace(`/admin/dashboard`)
        }
      }
    }
  }
}

const modules = {
  global
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
})

export default store
