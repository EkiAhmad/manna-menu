import Dashboard from 'pages/{{ name }}/Dashboard/Dashboard.routes'
import Profile from 'pages/{{ name }}/Profile/Profile.routes'
/* x-next-page-route-import */

export default {
  path: '/{{ kebabCase name }}',
  meta: {
    requiresLogin: true
  },
  component: () => import('layouts/{{ name }}/{{ name }}.layout'),
  children: [
    {
      path: '', redirect: '/{{ kebabCase name }}/dashboard'
    },
    Dashboard,
    Profile/* x-next-page-route */
  ]
}
