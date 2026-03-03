import { route } from 'quasar/wrappers'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/authStore'
import { Notify } from 'quasar'

export default route(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory()
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth) {

      if (!authStore.username) {
        Notify.create({ type: 'warning', message: 'Please login to access this page.' })
        return next('/login')
      }

      const userRole = authStore.role.toUpperCase()
      const requiredRole = to.meta.role

      if (requiredRole && !userRole.includes(requiredRole)) {
        Notify.create({ type: 'negative', message: 'Access Denied: You do not have permission for this section.' })
        return next('/login')
      }

      next()
    } else {
      next()
    }
  })

  return Router
})
