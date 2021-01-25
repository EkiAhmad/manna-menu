export default {
  path: 'ratings',
  component: () => import('./Rating.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./Rating.list.vue')
    },
    // {
    //   path: 'edit/:id?',
    //   component: () => import('./Rating.edit.vue')
    // },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
