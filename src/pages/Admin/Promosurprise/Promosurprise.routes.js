export default {
    path: 'promosurprise',
    component: () => import('./Promosurprise.page.vue'),
    children: [
      {
        path: 'list',
        component: () => import('./Promosurprise.list.vue')
      },
      {
        path: 'edit/:id?',
        component: () => import('./Promosurprise.edit.vue')
      },
      {
        path: '*',
        redirect: 'list'
      },
    ]
  }
  