export default {
  path: 'stores',
  component: () => import('./Store.page.vue'),
  children: [{
      path: 'list',
      component: () => import('./Store.list.vue')
    },
    {
      path: 'edit/:id?',
      component: () => import('./Store.edit.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
