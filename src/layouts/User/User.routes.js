import Dashboard from 'pages/User/Dashboard/Dashboard.routes'
import Profile from 'pages/User/Profile/Profile.routes'
/* x-next-page-route-import */

export default {
  path: '/user',
  meta: {
    requiresLogin: true
  },
  component: () => import('layouts/User/User.layout'),
  children: [
    {
      path: '', redirect: '/user/dashboard'
    },
    Dashboard,
    Profile/* x-next-page-route */
  ]
}
