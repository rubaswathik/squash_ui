<template>  

  <form class="login-form" @submit.prevent="onsubmit">
<p style="font-size: 25px;">Make your life easy with Intranet!</p>
<!-- <p style="font-size: 15px;"><u>Login to your app</u></p> -->
  
    <span class="va-form-label va-form-required-label">Username</span>
    <va-input
      v-model="username"
      type="text"
      placeholder="Username"
      required="true"
    />
     <span class="va-form-label va-form-required-label">Password</span>
    <va-input
      v-model="password"
      type="password"
      placeholder="Password"
      required="true"
    />
    
    <div class="d-flex justify--center mt-3 login-btn-container">      
      <va-button type="submit" class="my-0 login-btn" v-bind:class="{ 'disable-btn' : isLogging }">
      <span v-if="isLogging"><i class="fa fa-spinner fa-spin"></i></span>Confirm Email</va-button>
    </div>
  </form>

</template>

<script>
import config from '../../../i18n/en'
import Vue from 'vue'
import vueResource from 'vue-resource'
import { navigationRoutes } from '../../admin/app-sidebar/NavigationRoutes'
import { sidebar } from '../../../i18n/sidebar.js'

Vue.use(vueResource)
export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      keepLoggedIn: false,
      err_flag: false,
      err_msg: '',
      isLogging: false,
      showPassword: false,
      password: '',
      username: '',
    }
  },
  methods: {
    showHidePassword() {
         this.showPassword = !this.showPassword;
    },
    onsubmit () {
      this.isLogging = true;
      this.login_flag = true
      this.$http.post(config.menu.host + '/auth/login', { username: this.username, password: this.password})
        .then(data => {
          this.create_org_flag = false
          var response = data.body
          var vm = this
          Vue.$cookies.set('x-access-token', response.token)
          Vue.$cookies.set('user-id', response.userId)
          var navigation_routes = navigationRoutes.routes

          var user_role = response.roles
          var routes_data_by_role = []
          for (var i = 0; i < navigation_routes.length; i++) {
            if (navigation_routes[i].meta.authorize.includes(user_role)) {
              routes_data_by_role.push(navigation_routes[i])
            }
          }
          navigationRoutes.routes = routes_data_by_role
          this.$router.push({ name: 'dashboard' })
        
        }, () => {
          this.isLogging = false;
          this.err_flag = true
          this.err_msg = 'Invalid login credentials'
        })
    },
    checkCode(){
      console.log('verification_code',this.verification_code);
    },
  },
}
</script>

<style lang="scss">
  .login-btn-container {
    .login-btn {
      background: black !important;
      border-radius: 4px;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .login-form {
    .va-input__container {
      border: none;
      background: transparent;
      margin: 0;
    }
  }

  .disable-btn {
    opacity: 0.5;
    pointer-events: none;
    margin-right: 5px;
  }

  .field-icon {
    float: right;
    margin-right: 10px;
    margin-top: -43px;
    position: relative;
    z-index: 2;
    cursor: pointer;
  }

</style>
