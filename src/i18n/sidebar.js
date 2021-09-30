import { navigationRoutes } from '../components/admin/app-sidebar/NavigationRoutes'
import Vue from 'vue'
import vueResource from 'vue-resource'
Vue.use(vueResource)

export var sidebar = function () {

  var navigation_routes = []
  navigation_routes = navigationRoutes.routes_copy
  var routes_data_by_role = []

  for (var i = 0; i < navigation_routes.length; i++) {
    routes_data_by_role.push(navigation_routes[i])
  }
  return navigationRoutes.routes = routes_data_by_role
}
