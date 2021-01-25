import Admin from 'layouts/Admin/Admin.routes.js'
/* next import role routes */
export default [
  {
    path: '/login',
    component: () => import('pages/Login')
  },
  {
    path: '/landing',
    component: () => import('pages/Landing'),
  },
  {
    path: '/qr/:id',
    component: () => import('pages/QR')
  },
  Admin, /* next role routes */
  {
    path: '*',
    redirect: '/login'
  }
]
