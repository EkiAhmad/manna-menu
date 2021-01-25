import axios from 'axios'
import qs from 'qs'
import jwtDecode from 'jwt-decode'
import types from 'store/types'
import store from 'src/store'

const env = process.env

axios.defaults.baseURL = env.API[env.NODE_ENV]
axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded';

axios.defaults.paramsSerializer = function (params) {
  return qs.stringify(params, {
    arrayFormat: 'indices'
  })
}

axios.interceptors.request.use(function (config) {
  console.log('request')

  // store.commit('setLoading', true)

  if (config.url.includes('token')) {
    config.headers.Authorization = store.state.accessToken
  } else {
    const accToken = store.state.accessToken || false
    if (accToken && accToken !== 'null') {
      config.headers.Authorization = accToken
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // store.commit('setLoading', false)
  if (response.code === 401) {
    //window.location.href = '/'
  }
  return response
}, function (error) {
  // store.commit('setLoading', false)
  const originalRequest = error.config

  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    if (error.response.config.url.includes('authentication') && error.response.config.method === 'post') {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = window.localStorage.getItem('refreshToken')
    if (refreshToken && refreshToken !== 'null') {
      return axios.post('/token/refresh', {
          refreshToken
        })
        .then(({
          data
        }) => {

          store.commit(types.TOKEN_CHANGED, data.accessToken)

          const jwtExtracted = jwtDecode(data.accessToken)
          store.commit(types.TOKEN_EXTRACTED, jwtExtracted)

          axios.defaults.headers.common['Authorization'] = data.accessToken
          originalRequest.headers['Authorization'] = data.accessToken
          return axios(originalRequest)
        })
        .catch(() => {
          window.localStorage.clear()
          window.location.href = '/'
        })
    } else {
      window.localStorage.clear()
      window.location.href = '/'
    }
  }
  return Promise.reject(error)
})

export default ({
  Vue
}) => {
  Vue.prototype.$axios = axios
}
