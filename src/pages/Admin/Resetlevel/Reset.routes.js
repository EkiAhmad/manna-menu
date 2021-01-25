export default {
  path: 'reset',
  component: () => import('./Reset.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./Reset.list.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
