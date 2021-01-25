export default {
  path: 'tax',
  component: () => import('./Tax.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./Tax.list.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
