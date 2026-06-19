import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/authStore'

const api = axios.create({
  baseURL: 'http://10.107.0.2:3000/',
  withCredentials: true,
})

export default defineBoot(({ app }) => {

  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()

      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      } else {
        console.warn('Warning: No token found in Pinia store for this request!')
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
