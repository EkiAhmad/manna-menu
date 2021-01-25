const roleLayout = require('./plops/role-layout.js')
const page = require('./plops/page.js')

module.exports = ( plop ) => {
  plop.setHelper('upperCase', (txt) => txt.toUpperCase());

  plop.setGenerator('Role Layout', roleLayout)
  plop.setGenerator('Page', page)
}
