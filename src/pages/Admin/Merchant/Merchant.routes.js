export default {
  path: 'merchants',
  component: () => import('./Merchant.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./Merchant.list.vue')
    },
    {
      path: 'edit/:id?',
      component: () => import('./Merchant.edit.vue')
    },
    {
      path: '*', 
      redirect: 'list'
    },
  ]
}
