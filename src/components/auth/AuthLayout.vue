<template>
  <div>
    <div class="row auth-layout">
      <div class="flex xs12 pa-3 flex-center auth-display-none">
        <router-link class="py-5 flex-center" to="/">
        </router-link>
      </div>      
      <div class="col justify--center logo-container">
        <img class="icon" src="@/assets/Group-3.png" />
        <img src="@/assets/icons/aboutus.png" />
      </div>
      <div class="col justify--center login-container">
        <va-card class="auth-layout__card">
            <va-tabs
              v-model="tabIndex"
              center>
              <va-tab>Login</va-tab>
              <va-tab>Register</va-tab>
            </va-tabs>
            <va-separator/>
            <div class="pa-3">
              <router-view/>
            </div>
          </va-card>
      </div>
    </div>    
  </div>
</template>


<script>
import config from '../../i18n/en'
import Vue from 'vue'
import vueResource from 'vue-resource'
Vue.use(vueResource)

const tabs = [
  'login',
  'signup',
]
export default {
  name: 'AuthLayout',
  
  data () {
    return {
      selectedTabIndex: 0,
      tabTitles: ['login', 'createNewAccount'],
    }
  },
  computed: {
    tabIndex: {
      set (tabIndex) {
        this.$router.push({ name: tabs[tabIndex] })
      },
      get () {
        return tabs.indexOf(this.$route.name)
      },
    },
  },
}
</script>

<style lang="scss">
.auth-layout {
  align-items: center;
  height: 100vh;

  &__card {
    width: 100%;
    max-width: 600px;
  }

  &__options {
    @include media-breakpoint-down(xs) {
      flex-direction: column;
    }
  }
}

.auth-display-none {
  display: none;
}

.flex-auto {
  flex: auto;
}

.row {
  display: flex;
}

.col {
  flex: 1;
  display: flex;
}

.logo-container {
  height: 100%;
  align-items: center;
  background: #ffffff;
  position: relative;

  & .icon {
    width: 200px;
    height: 200px;
    position: absolute;
    top: -55px;
    left: -65px;
  }

  & .font-label {
    font-size: 40px;
    color: white;
  }
}

.login-container {
  height: 100%;
  align-items: center;
  background: $alpha-color;
}
</style>