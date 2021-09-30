<template>
  <div>
    <va-card title="Update Profile">
      <div>
        <form  @submit.prevent="updateUser()">
          <span class="va-form-label">First Name</span>
          <va-input
            v-model.trim="user.first_name"
            type="text"            
            placeholder="Enter First Name"
            :disabled="true"
          />
          <span class="va-form-label">Last Name</span>
          <va-input
            v-model.trim="user.last_name"
            type="text"            
            placeholder="Enter Last Name"
            :disabled="true"
          />
          <span class="va-form-label">Password (Minimum length should be 8)</span>
          <va-input
            v-model.trim="user.password"
            type="password"            
            pattern="[A-Za-z0-9_@!./#&+-^]{8,}$"
            minlength="8"
            placeholder="Enter Password"
          />
          <div class="d-flex justify--end mt-3">
            <va-button type="submit" class="my-0">Update</va-button>
          </div>
        </form>
      </div>
    </va-card>
  </div>
</template>

<script>
import Vue from 'vue'
import vueResource from 'vue-resource'
import config from '../../i18n/en.json'
Vue.use(vueResource)

export default {
  name: 'profile',
  created () {
    this.getUser()
  },
  data () {
    return {
      user:{}
    }
  },
  computed: {
    checkpassword () {
      if (this.user.password.length >= 8) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    getUser () {
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.get(config.menu.host + '/user/' + this.$cookies.get('user-id'))
      .then(response => {
        loader.hide()
        this.user = response.body
      }, error => {
        loader.hide()
        if (error && error.body) {
          Vue.notify({ text: error.body,  type: 'error' })
        }
      })
    },
    updateUser () {
      console.log("password",this.user.password)
      if(this.user.password == ''){delete this.user.password}
      if (this.user.password && (this.user.password != '') && (!this.checkpassword)) {
        Vue.notify({
          text: 'Password Length must 8 Characters',
          type: 'error',
        })
        return
      }
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.put(config.menu.host + '/user/' + this.user.user_id, this.user)
      .then(response => {
        loader.hide()
        if (response && response.body) {
          Vue.notify({ text: response.body, type: 'success'})
        }
        this.getUser()
      }, error => {
        loader.hide()
        if (error && error.body) {
          Vue.notify({text: error.body, type: 'error'})
        }
      })
    },
  },
}
</script>

<style lang="scss">
</style>
