const roleLayoutFiles = [
  'layout.vue',
  'menu.vue',
  'routes.js',
]

const rolePageFiles = [
  'page.vue',
  'routes.js',
]


const copyRoleLayout = roleLayoutFiles.map(item => {
  return {
    type: "add",
    path: `src/layouts/{{ name }}/{{ name }}.${ item }`,
    templateFile: `plops/templates/role/layout/Layout.${item}`
  }
})

const copyDashboardPage = rolePageFiles.map(item => {
  return {
    type: "add",
    path: `src/pages/{{ name }}/Dashboard/Dashboard.${ item }`,
    templateFile: `plops/templates/role/page/Dashboard/Dashboard.${item}`
  }
})

const copyProfilePage = rolePageFiles.map(item => {
  return {
    type: "add",
    path: `src/pages/{{ name }}/Profile/Profile.${ item }`,
    templateFile: `plops/templates/role/page/Profile/Profile.${item}`
  }
})

const modifActions =
        [
          {
            type: "modify",
            path: `src/router/routes.js`,
            pattern: /(\/\* next import role routes \*\/)/,
            template: `\nimport {{ name }} from 'layouts/{{ name }}/{{ name }}.routes.js'\n$1`
          },
          {
            type: "modify",
            path: `src/router/routes.js`,
            pattern: / (\/\* next role routes \*\/)/,
            template: `\n  {{ name }}, $1`
          }, {
            type: "modify",
            path: `src/pages/Landing.vue`,
            pattern: / (\/\* next role definition \*\/)/,
            template: `,\n  {\n    title: '{{ name }}',\n    role: '{{ kebabCase name }}',\n    route: '/{{ kebabCase name }}'\n  } $1`
         }]



const actions = [
  ...copyRoleLayout,
  ...copyDashboardPage,
  ...copyProfilePage,
  ...modifActions
]

module.exports = {
  description: 'Create a new Role Layout (on development)',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is role name? (please use PascalCase)',
    }
  ],
  actions
}
