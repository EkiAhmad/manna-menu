export default {
  path: 'point',
  component: () => import('./Point.page.vue'),
  children: [{
      path: 'list',
      component: () => import('./Point.list.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
