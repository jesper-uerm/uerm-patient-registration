const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue') }
    ]
  },

  //change to login page
    {
    path: '/login',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/AdminPage/AdminDashboard.vue') }
    ]
  },

  {
  path: '/admin',
  component: () => import('layouts/AdminLayout.vue'),
  children: [
    {
      path: '',
      name: 'dashboard',
      component: () => import('src/components/AdminPage/AdminDashboard.vue')
    },
    {
      path: 'InpatientList',
      name: 'in-patient-list',
      component: () => import('src/components/AdminPage/InpatientList.vue')
    },
    {
      path: 'OutpatientList',
      name: 'out-patient-list',
      component: () => import('src/components/AdminPage/OutpatientList.vue')
    },

    {
      path: 'EmergencyList',
      name: 'emergency-patient-list',
      component: () => import('src/components/AdminPage/EmergencyList.vue')
    }
  ]
},

  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ErrorNotFound.vue') }
    ]
  }
]

export default routes
