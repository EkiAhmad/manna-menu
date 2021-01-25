export default {
  path: 'level',
  component: () => import('./Level.page.vue'),
  children: [{
      path: 'list',
      component: () => import('./Level.list.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
