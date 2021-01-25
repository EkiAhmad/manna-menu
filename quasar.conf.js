// Configuration for your app
const path = require('path')
const {
  endpoint,
  plugins,
  framework,
  animations
} = require('./custom.conf.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins,
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons' // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      publicPath: '/cms-admin',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        // console.log(ctx, cfg)
        cfg.entry.app.push(path.resolve(__dirname, 'custom.conf.js'))
        cfg.resolve.alias.store = path.resolve(__dirname, 'src/store')
        cfg.resolve.alias.router = path.resolve(__dirname, 'src/router')
        /* cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        }) */

        //console.log(['spa','pwa'].indexOf(ctx.modeName))
        //console.log(ctx)
        //console.log(cfg.output)
        //console.log(['spa','pwa'].indexOf(ctx.modeName) > -1)

        if (['spa', 'pwa'].indexOf(ctx.modeName) > -1 && cfg.output && cfg.output.path) {
          console.log('Copying assets')
          cfg.plugins.push(new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/assets'),
            to: path.join(cfg.output.path, 'assets')
          }]))
        }

        cfg.plugins.push(new webpack.ProvidePlugin({
          'window.Quill': 'quill/dist/quill.js',
          'Quill': 'quill/dist/quill.js'
        }))
      },
      env: {
        API: JSON.stringify(endpoint)
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework,
    // animations: 'all' --- includes all animations
    animations,
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [{
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack(cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
