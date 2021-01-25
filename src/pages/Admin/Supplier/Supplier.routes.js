export default {
  path: 'suppliers',
  component: () => import('./Supplier.page.vue'),
  children: [{
    path: 'list',
    component: () => import('./Supplier.list.vue')
  }, {
    path: 'edit/:id?',
    component: () => import('./Supplier.edit.vue')
  }, {
    path: '*',
    redirect: 'list'
  }, ]
}
