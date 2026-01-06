import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://10.107.0.2:3000/' })

export default defineBoot(({ app }) => {

  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api

})

export { api }
