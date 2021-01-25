export default {
  path: 'settings',
  component: () => import('./Settings.page.vue'),
  children: [
    {
      path: 'wa',
      component: () => import('./WA.edit.vue')
    },
    {
      path: '*',
      redirect: 'wa'
    },
  ]
}
