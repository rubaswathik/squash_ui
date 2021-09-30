import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from '../components/auth/AuthLayout'
import AppLayout from '../components/admin/AppLayout'
import Login from '../components/auth/login/Login.vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(Router)
Vue.use(require('vue-cookies'))
//
const EmptyParentComponent = {
  template: '<router-view></router-view>',
}

function loginAuthGuard (to, from, next) {
  var accessToken = Vue.$cookies.get('x-access-token')
  if (accessToken) {
    Vue.$cookies.keys().forEach(cookie => Vue.$cookies.remove(cookie))
  }
  var isAuthenticated = localStorage.getItem('LoggedInUser')
  if (to.meta.isLoggedInCheck) {
    if (isAuthenticated) {
      next('/')
      return
    }
  }

  next()
}

function loginAuthcode (to, from, next) {
  next()
}

export default new Router({
  routes: [
    {
      path: '*',
      redirect: { name: 'login' },
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          name: 'login',
          path: 'login',
          meta: {
            isLoggedInCheck: true,
          },
          beforeEnter: loginAuthGuard,
          component: Login,
        },
        {
          name: 'signup',
          path: 'signup',
          meta: {
            isLoggedInCheck: true,
          },
          beforeEnter: loginAuthGuard,
          component: () => import('../components/auth/signup/Signup.vue'),
        },
        {
          path: '',
          redirect: { name: 'login' },
        },
      ],
    },
    {
      path: '/404',
      component: EmptyParentComponent,
      children: [],
    },
    {
      name: 'Admin',
      path: '/admin',
      component: AppLayout,
      children: [
        {
          name: 'dashboard',
          path: 'dashboard',
          component: () => import('../components/dashboard/Dashboard.vue'),
          default: true,
        },
        {
          name: 'profile',
          path: 'profile',
          component: () => import('../components/profile/Profile.vue'),
          children: [],
        },
        {
          name: 'logout',
          path: 'logout',
          props: true,
          component: () => import('../components/logout/Logout.vue'),
          children: [],
        },
        {
          name: 'announcement',
          path: 'announcement',
          props: true,
          component: () => import('../components/announcement/Announcement.vue'),
          children: [],
        }
      ],
    },
  ],
})
