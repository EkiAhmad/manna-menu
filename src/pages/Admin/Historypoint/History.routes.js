export default {
  path: 'history-point',
  component: () => import('./History.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./History.list.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
