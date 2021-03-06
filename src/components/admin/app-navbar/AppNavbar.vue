<template>
  <nav
    class="app-navbar"
    :style="navbarStyle">
    <div class="app-navbar__content row">
      <div class="app-navbar__menu-container">
        <va-icon-menu
          class="app-navbar__menu"
          v-if="!minimized && !isTopBar"
          @click.native="$emit('update:minimized', !minimized)"
          :color="contextConfig.invertedColor ? $themes.gray : 'white'"
        />
        <va-icon-menu-collapsed
          class="app-navbar__menu"
          v-if="minimized && !isTopBar"
          @click.native="$emit('update:minimized', !minimized)"
          :color="contextConfig.invertedColor ? $themes.gray : 'white'"
        />
        <router-link
          class="app-navbar__logo mr-3"
          :to="{name:'dashboard'}"
          style="color: #2c82e0;">
          SA-INTRANET
        </router-link>
      </div>
      <!-- <va-button flat small icon="fa fa-pencil" @click="test()">btn </va-button>
      <va-button flat small icon="fa fa-pencil" @click="test()">btn </va-button>
      <va-button flat small icon="fa fa-pencil" @click="test()">btn </va-button>
      <va-button flat small icon="fa fa-pencil" @click="test()">btn </va-button>
      <va-button flat small icon="fa fa-pencil" @click="test()">btn </va-button> -->
      <label v-if="role =='OPERATOR'" style="color: black; padding-left: 800px;">Credits : {{amt}}</label>
      <app-navbar-actions
        class="app-navbar__actions md5 lg4"
        :user-name="username"
        :is-top-bar.sync="isTopBarProxy"/>
    </div>
  </nav>
</template>

<script>
import VaIconMenu from '../../../iconset/VaIconMenu'
import VaIconMenuCollapsed from '../../../iconset/VaIconMenuCollapsed'
import AppNavbarActions from './components/AppNavbarActions'
import { colorShiftHsl } from '../../../services/vuestic-ui'
import config from '../../../i18n/en'
import Vue from 'vue'
import vueResource from 'vue-resource'

Vue.use(vueResource)
export default {
  created () {
    this.$themes.primary = '#2c82e0'
    this.$themes.info = '#2c82e0'
    this.getUserInfo()
  },
  name: 'app-navbar',
  mixins: [],
  inject: ['contextConfig'],
  components: {
    VaIconMenu,
    VaIconMenuCollapsed,
    AppNavbarActions,
  },
  props: {
    isTopBar: {
      type: Boolean,
      required: true,
    },
    minimized: {
      type: Boolean,
      required: true,
    },
  },
  data () {
    return {
      username: '',
      role: '',
      amt: 0,
    }
  },
  computed: {
    isTopBarProxy: {
      get () {
        return this.isTopBar
      },
      set (isTopBar) {
        this.$emit('update:isTopBar', isTopBar)
      },
    },
    minimizedProxy: {
      get () {
        return this.minimized
      },
      set (minimized) {
        this.$emit('update:minimized', minimized)
      },
    },
    navbarStyle () {
      const style = {
        backgroundColor: 'white',
      }

      if (this.contextConfig.gradient) {
        style.backgroundColor = colorShiftHsl(this.$themes.secondary, {
          s: -13,
          l: 15,
        }).css
      }

      if (this.contextConfig.shadow === 'sm') {
        style.boxShadow = !this.isTopBar ? '0 2px 3px 0 rgba(52, 56, 85, 0.25)' : null
      }
      return style
    },
  },
  methods: {
    test () {
      this.$router.push('dashboard').catch(() => {})
    },
    getUserInfo () {
      let user_id = Vue.$cookies.get('user-id')
      if (typeof(user_id) == 'string') {
        this.$http.get(config.menu.host + '/user/' + user_id)
          .then(response => {
            this.role = response.data.roles
            this.username = response.data.first_name
            this.amt = 0
            if (this.role != 'CMS_MANAGER') {
              this.$http.get(config.menu.host + '/transaction/credit/calculation').then(res => {
                this.amt = (res.body.object).toFixed(2)
              })
            }
          }, function (err) {
          })
      } else {
        this.$router.push({ name: 'login' })
      }
    },
  },

}
</script>

<style lang="scss">
$nav-border-side-width: 3.1875rem;

.app-navbar {
  transition: background-color 0.3s ease; /* sidebar's bg color transitions as well -> consistency */
  display: flex;
  padding: 1rem 1rem;
  z-index: 1;

  &__content {
    z-index: 1;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
    flex: 1 1 auto;
  }

  &__center {
    display: flex;
    margin-left: 3rem;
    justify-content: space-between;
    align-items: center;
  }

  &__text {
    color: $lighter-gray;
  }

  &__button {
    width: 10rem;
    margin: 0 0 0 1rem !important;
    font-weight: bold;

    .va-button__content__icon-left.fa-github {
      font-size: 1.5rem;
    }
  }

  &__menu {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    margin-right: 1rem;
  }

  &__menu-container {
    display: flex;
    flex-wrap: nowrap;
    height: 1.5rem;
  }

  &__logo {
    width: 9.5rem;
    height: auto;
    align-items: center;

    & * {
      max-height: 100%;
      max-width: 100%;
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__actions {
    justify-content: flex-end;
  }

  &__mailto-link:hover {
    filter: brightness(85%);
  }

  &__shape {
    transition: border-top-color 0.3s ease; /* sidebar's bg color transitions as well -> consistency */
    width: 33%;
    max-width: 467px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    border-top: 4.215rem solid transparent; // hardcoded size
    border-left: $nav-border-side-width solid transparent;
    border-right: $nav-border-side-width solid transparent;
    height: 0;
  }

  @include media-breakpoint-down(lg) {
    &__button {
      display: none !important;
    }
  }

  @include media-breakpoint-down(md) {
    &__center {
      display: none !important;
    }
  }

  @include media-breakpoint-down(sm) {
    &__content {
      align-items: flex-end;
    }

    &__actions {
      margin-top: 1.25rem;
      justify-content: space-between;
      width: 100%;
    }

    &__shape {
      display: none;
    }
  }
}
</style>
