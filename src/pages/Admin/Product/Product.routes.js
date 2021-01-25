export default {
  path: 'products',
  component: () => import('./Product.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./Product.list.vue')
    },
    {
      path: 'edit/:id?',
      component: () => import('./Product.edit.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
