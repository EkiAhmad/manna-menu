export default {
  path: '{{ kebabCase name }}',
  component: () => import('./{{ name }}.page.vue'),
  children: [
    {
      path: 'list',
      component: () => import('./{{ name }}.list.vue')
    },
    {
      path: 'edit/:id?',
      component: () => import('./{{ name }}.edit.vue')
    }
  ]
}
