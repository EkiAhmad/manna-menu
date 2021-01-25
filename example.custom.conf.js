const endpoint = {
  development: 'http://localhost:4000',
  production: 'https://manna.asia/cms-api'
}

const vuePlugins = [
  'i18n',
  'axios',
  'vuelidate',
  'vue-quill-editor'
]

const i18n = 'en-us'

const components = [
  'QActionSheet',
  // 'QAjaxBar',
  'QAlert',
  'QAutocomplete',
  'QBreadcrumbs',
  'QBreadcrumbsEl',
  'QBtn',
  'QBtnDropdown',
  'QBtnGroup',
  'QBtnToggle',
  'QCard',
  'QCardActions',
  'QCardMain',
  'QCardMedia',
  'QCardSeparator',
  'QCardTitle',
  //'QCarousel',
  //'QCarouselControl',
  //'QCarouselSlide',
  'QChatMessage',
  'QCheckbox',
  'QChip',
  'QChipsInput',
  'QCollapsible',
  'QColor',
  'QColorPicker',
  //'QContextMenu',
  'QDatetime',
  'QDatetimePicker',
  'QDialog',
  //'QEditor',
  //'QFab',
  //'QFabAction',
  'QField',
  'QIcon',
  //'QInfiniteScroll',
  'QInnerLoading',
  'QInput',
  'QInputFrame',
  'QItem',
  'QItemMain',
  'QItemSeparator',
  'QItemSide',
  'QItemTile',
  'QItemWrapper',
  //'QKnob',
  'QLayout',
  'QLayoutDrawer',
  'QLayoutFooter',
  'QLayoutHeader',
  'QList',
  'QListHeader',
  'QModal',
  'QModalLayout',
  'QOptionGroup',
  'QPage',
  'QPageContainer',
  //'QPageSticky',
  'QPagination',
  //'QParallax',
  'QPopover',
  //'QProgress',
  //'QPullToRefresh',
  'QRadio',
  //'QRange',
  'QRating',
  //'QResizeObservable',
  'QRouteTab',
  'QScrollArea',
  'QScrollObservable',
  'QSearch',
  'QSelect',
  'QSlideTransition',
  'QSlider',
  'QSpinner',
  //'QStep',
  //'QStepper',
  //'QStepperNavigation',
  'QTab',
  'QTabPane',
  'QTable',
  'QTableColumns',
  'QTabs',
  'QTd',
  'QTh',
  //'QTimeline',
  //'QTimelineEntry',
  'QToggle',
  'QToolbar',
  'QToolbarTitle',
  'QTooltip',
  'QTr',
  //'QTree',
  'QUploader',
  'QPopupEdit',
  //'QVideo'
]

const directives = [
  // 'Ripple',
  // 'BackToTop',
  // 'CloseOverlay',
  // 'GoBack',
  // 'ScrollFire',
  // 'Scroll',
  // 'TouchHold',
  // 'TouchPan',
  // 'TouchSwipe',
]

const quasarPlugins = [
  'Notify',
  'Loading',
  // 'ActionSheet',
  // 'AddressbarColor',
  // 'AppFullscreen',
  // 'AppVisibility',
  // 'Cookies',
  'Dialog',
  // 'History',
  // 'Platform',
  // 'WebStorage',
  'LocalStorage'
  // 'SessionStorage'

]

const animations = 'all'

module.exports = {
  endpoint,
  framework: {
    components,
    directives,
    plugins: quasarPlugins,
    i18n
  },
  plugins: vuePlugins,
  animations
}