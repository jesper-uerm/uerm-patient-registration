const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePage.vue') }]
  },
  {
    path: '/triage',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePageER.vue') }]
  },
  {
    path: '/login',
    component: () => import('src/pages/LoginPage.vue')
  },

  {
    path: '/admitting',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'ADMITTING SECTION' },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('src/components/AdminPage/AdminDashboard.vue') },
      { path: 'InpatientList', name: 'in-patient-list', component: () => import('src/components/AdminPage/InpatientList.vue') },
      { path: 'OutpatientList', name: 'out-patient-list', component: () => import('src/components/AdminPage/OutpatientList.vue') }
    ]
  },

  {
    path: '/er',
    component: () => import('layouts/EmergencyLayout.vue'),
    meta: { requiresAuth: true, role: 'EMERGENCY ROOM' },
    children: [
      { path: '', name: 'er-dashboard', component: () => import('src/components/AdminPage/AdminErDashboard.vue') },
      { path: 'EmergencyList', name: 'emergency-patient-list', component: () => import('src/components/AdminPage/EmergencyList.vue') },
      { path: 'ForAdmissionER', name: 'for-admission-list', component: () => import('src/components/AdminPage/ForAdmissionER.vue') }
    ]
  },

  {
    path: '/finance',
    component: () => import('layouts/FinanceLayout.vue'),
    meta: { requiresAuth: true, role: 'HOSPITAL FINANCE AND OPERATIONS' },
    children: [
      { path: '', name: 'finance-dashboard', component: () => import('src/components/FinancePage/FinanceDashboard.vue') },
      { path: 'PatientList', name: 'finance-patient-list', component: () => import('src/components/FinancePage/PatientList.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ErrorNotFound.vue') }]
  }
]

export default routes
