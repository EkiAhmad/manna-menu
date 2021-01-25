const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const layoutDir = './src/layouts'
const availableRoles = readdirSync(layoutDir).filter(name => {
  return isDirectory(join(layoutDir, name))
})

const files = {
  Blank: [
    'page.vue',
    'routes.js'
  ],
  Crud: [
    'edit.vue',
    'list.vue',
    'page.vue',
    'routes.js'
  ]
}

const routeSuffixes = {
  Blank: '',
  Crud: '/list'
}


const actions = answer => {
  const routeSuffix = routeSuffixes[answer.pageType]
  console.log(routeSuffix, routeSuffixes[answer.pageType])
  const copyActions = files[answer.pageType].map(item => {
    return {
      type: "add",
      path: `src/pages/{{ role }}/{{ name }}/{{ name }}.${ item }`,
      templateFile: `plops/templates/page/{{ pageType }}/{{ pageType }}.${ item }`
    }
  })


  const modifyActions = [
    {
      type: "modify",
      path: `src/layouts/{{ role }}/{{ role }}.routes.js`,
      pattern: /(\/\* x-next-page-route-import \*\/)/,
      template: `$1\nimport {{ name }} from 'pages/{{ role }}/{{ name }}/{{ name }}.routes'`
    },
    {
      type: "modify",
      path: `src/layouts/{{ role }}/{{ role }}.routes.js`,
      pattern: /(\/\* x-next-page-route \*\/)/,
      template: `,\n    {{ name }}$1`
    },
    {
      type: "modify",
      path: `src/layouts/{{ role }}/{{ role }}.menu.vue`,
      pattern: /(<!-- x-next-menu -->)/,
      template: `<q-item to="/{{ kebabCase role }}/{{ kebabCase name }}${ routeSuffix }">\n        <q-item-side icon="widgets" />\n        <q-item-main label="{{ name }}" sublabel="{{ kebabCase pageType }} of {{ kebabCase name }}" />\n      </q-item>\n      $1`
    }
  ]

  return [...copyActions, ...modifyActions]
}

module.exports = {

  description: 'Create a new Page',
  prompts: [
    {
      type: "list",
      name: "pageType",
      message: "What is your page type?",
      choices: [
        'Blank',
        'Crud'
      ]
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What role it will be rendered?',
      choices: availableRoles
    }
  ],
  actions
}
