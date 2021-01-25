export default {
  path: 'product-categories',
  component: () => import('./Category.page.vue'),
  children: [{
      path: 'list',
      component: () => import('./Category.list.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
