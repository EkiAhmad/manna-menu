export default {
  path: 'transactions',
  component: () => import('./Sales.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./Sales.list.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
