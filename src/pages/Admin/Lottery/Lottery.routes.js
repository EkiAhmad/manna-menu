export default {
  path: 'lotteries',
  component: () => import('./Lottery.page.vue'),
  children: [{
      path: 'list',
      component: () => import('./Lottery.list.vue')
    },
    {
      path: 'edit/:id?',
      component: () => import('./Lottery.edit.vue')
    },
    {
      path: '*',
      redirect: 'list'
    },
  ]
}
