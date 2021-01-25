import Dashboard from 'pages/Admin/Dashboard/Dashboard.routes'
import Profile from 'pages/Admin/Profile/Profile.routes'
/* x-next-page-route-import */
import Merchants from 'pages/Admin/Merchant/Merchant.routes'
import Stores from 'pages/Admin/Store/Store.routes'
import Products from 'pages/Admin/Product/Product.routes'
import Sales from 'pages/Admin/Sales/Sales.routes'
import SalesProduct from 'pages/Admin/SalesProduct/Sales.routes'
import Settings from 'pages/Admin/Settings/Settings.routes'
import Taxes from 'pages/Admin/Tax/Tax.routes'
import Lotteries from 'pages/Admin/Lottery/Lottery.routes'
import Suppliers from 'pages/Admin/Supplier/Supplier.routes'
import Ratings from 'pages/Admin/Ratings/Rating.routes'
import ProductCategories from 'pages/Admin/Productcategory/Category.routes'
import Surprize from 'pages/Admin/Promosurprise/Promosurprise.routes'
import Level from 'pages/Admin/Level/Level.routes'
import Point from 'pages/Admin/Point/Point.routes'
import History from 'pages/Admin/Historypoint/History.routes'
import Reset from 'pages/Admin/Resetlevel/Reset.routes'
import Historysurprize from 'pages/Admin/Historysurprize/History.routes'

export default {
  path: '/admin',
  meta: {
    requiresLogin: true
  },
  component: () => import('layouts/Admin/Admin.layout'),
  children: [{
      path: '',
      redirect: '/admin/dashboard'
    },
    Dashboard,
    Profile,
    Merchants,
    Stores,
    Products,
    Sales,
    SalesProduct,
    Settings,
    Taxes,
    Lotteries,
    Suppliers,
    ProductCategories,
    Ratings,
    Surprize,
    Level,
    Point,
    History,
    Reset,
    Historysurprize
  ]
}
