const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePage.vue') }]
  },

  {
    path: '/forms',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePortals.vue') }]
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
    meta: { requiresAuth: true, role: 'ADMITTING UNIT' },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('src/components/AdminPage/AdminDashboard.vue') },
      { path: 'fromerlist', name: 'from-er-list', component: () => import('src/components/AdminPage/FromErList.vue') },
      { path: 'inpatientlist', name: 'in-patient-list', component: () => import('src/components/AdminPage/InpatientList.vue') },
      { path: 'outpatienlList', name: 'out-patient-list', component: () => import('src/components/AdminPage/OutpatientList.vue') }
    ]
  },

  {
    path: '/er',
    component: () => import('layouts/EmergencyLayout.vue'),
    meta: { requiresAuth: true, role: 'EMERGENCY ROOM' },
    children: [
      { path: '', name: 'er-dashboard', component: () => import('src/components/AdminPage/AdminErDashboard.vue') },
      { path: 'emergencylist', name: 'emergency-patient-list', component: () => import('src/components/AdminPage/EmergencyList.vue') },
      { path: 'foradmissioner', name: 'for-admission-list', component: () => import('src/components/AdminPage/ForAdmissionER.vue') }
    ]
  },

  {
    path: '/finance',
    component: () => import('layouts/FinanceLayout.vue'),
    meta: { requiresAuth: true, role: 'HOSPITAL FINANCE AND OPERATIONS' },
    children: [
      { path: '', name: 'finance-dashboard', component: () => import('src/components/FinancePage/FinanceDashboard.vue') },
      { path: 'patientlist', name: 'finance-patient-list', component: () => import('src/components/FinancePage/PatientList.vue') },
      { path: 'patientlistapproval', name: 'finance-patient-list-approval', component: () => import('src/components/FinancePage/PatientListApproval.vue') },
      { path: 'patientlistrecords', name: 'finance-patient-list-records', component: () => import('src/components/FinancePage/PatientListRecords.vue') }

    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ErrorNotFound.vue') }]
  }
]

export default routes
