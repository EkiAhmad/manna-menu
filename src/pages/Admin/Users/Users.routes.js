export default {
  path: 'users',
  component: () => import('./Users.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./Users.list.vue')
    },
    {
      path: 'edit/:id?',
      component: () => import('./Users.edit.vue')
    },
    {
      path: '*', 
      redirect: 'list'
    },
  ]
}
