import Vue from 'vue'
import vueResource from 'vue-resource'

Vue.use(vueResource)
var routes_data = [
  {
    name: 'dashboard',
    displayName: 'Dashboard',
    meta: {
      iconClass: 'vuestic-iconset vuestic-iconset-dashboard',
      authorize: [],
      flag: [],
    },
  },
  {
    name: 'announcement',
    displayName: 'Announcement',
    meta: {
      iconClass: 'fa fa-bullhorn',
      authorize: [],
      flag: [],
    },
  },
]

export const getNavigationRoutes = () => {
  return routes_data
}

var navigationRoutes = {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: getNavigationRoutes(),
  routes_copy: routes_data,
}

export { navigationRoutes }
