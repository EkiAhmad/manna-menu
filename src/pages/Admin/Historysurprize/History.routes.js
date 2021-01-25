export default {
    path: 'historysurprize',
    component: () => import('./History.page.vue'),
    children: [
      {
        path: 'list',
        component: () => import('./History.list.vue')
      },
      // {
      //   path: 'edit/:id?',
      //   component: () => import('./History.edit.vue')
      // },
      {
        path: '*',
        redirect: 'list'
      },
    ]
  }
  