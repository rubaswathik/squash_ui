<template>
  <form v-if="detailFlag">
  <div v-if="getFlag">
    <span class="va-form-label va-form-required-label">Mail Address</span>
    <va-input
      v-model.trim="mail"
      type="text"
      placeholder="Enter Mail Address"
      required="true"
    />
    <span class="va-form-label va-form-required-label">Company Name</span>
    <va-input
      v-model.trim="company_name"
      type="text"
      placeholder="Enter Company Name"
      required="true"
    />
    <span class="va-form-label va-form-required-label">Location</span>
    <va-input
      v-model.trim="location"
      type="text"
      placeholder="Enter Location"
      required="true"
    />
    <span class="va-form-label va-form-required-label">No of Employees</span>
    <va-input
      v-model.trim="no_of_employees"
      type="text"
      placeholder="Enter No of Employees"
      required="true"
    />
    <span class="va-form-label va-form-required-label">Domain Name</span>
    <div class="row">
      <va-input
        v-model.trim="domain_name"
        type="text"
        placeholder="Enter Domain Name"
        required="true"
      />
      <va-button type="submit" style="background-image: linear-gradient(to right, rgb(0, 0, 0), rgb(13, 13, 13));" disabled>.intranet.com</va-button>
    </div>
    <div class="d-flex justify--center mt-3">
      <va-button type="submit" @click="getData()" style="background-image: linear-gradient(to right, rgb(0, 0, 0), rgb(13, 13, 13));">Next</va-button>
    </div>
    </div>
    <div v-if="!getFlag">
    <span class="va-form-label va-form-required-label">First Name</span>
    <va-input
      v-model.trim="first_name"
      type="text"
      placeholder="Enter First Name"
      required="true"
    />
    <span class="va-form-label va-form-required-label">Last Name</span>
    <va-input
      v-model.trim="last_name"
      type="text"
      placeholder="Enter Last Name"
      required="true"
    />
    <span class="va-form-label va-form-required-label">Password</span>
    <va-input
      v-model.trim="password"
      type="password"
      placeholder="Enter password"
      required="true"
    />
    <label v-if="isShowError" style="color: #f8706d;">{{err_message}}</label>
    <div class="d-flex justify--center mt-3">
      <va-button type="submit" @click="register()" style="background-image: linear-gradient(to right, rgb(0, 0, 0), rgb(13, 13, 13));">Complete</va-button>
    </div>
    </div>
    <va-modal
      v-model="showModal"
      title="User Detail"
      okText="Ok"
      @ok="okModal()"
      cancelText=''
      noOutsideDismiss
      noEscDismiss>
      <div><label>Email     : {{email}}</label></div>
      <div><label>Password  : {{password}}</label></div>
    </va-modal>
  </form>
  <form v-else-if="!detailFlag">
    <p style="font-size: 30px;">We have sent you a mail</p>
    <span class="va-form-label va-form-required-label">Enter Verification code</span>
    <va-input
      v-model="verification_code"
      type="text"
      placeholder="Enter Verification Code"
      required="true"
    />
    <va-button type="submit" style="background-image: linear-gradient(to right, rgb(0, 0, 0), rgb(13, 13, 13));" @click.prevent="checkCode()">Submit</va-button>
  </form>
</template>

<script>
import config from '../../../i18n/en'
import Vue from 'vue'
import vueResource from 'vue-resource'
Vue.use(vueResource)
export default {
  name: 'signup',
  data () {
    return {
      license_key: '',
      isShowError: false,
      showModal: false,
      email: '',
      password: 'df',
      err_message: '',
      company_name: 'sd',
      location: 'df',
      no_of_employees: '1',
      domain_name: 'fd',
      first_name: 'df',
      last_name: 'df',
      password: 'df',
      detailFlag: true,
      verification_code: '',
      mail: 'swathikathir98@gmail.com',
      getFlag: true,
    }
  },
  methods: {
    register () {
      this.isShowError = false
      this.showModal = false
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      
      var payload = {
        company_name : this.company_name,
        location: this.location,
        no_of_employees: this.no_of_employees,
        domain_name: this.domain_name,
        first_name: this.first_name,
        last_name: this.last_name,
        password: this.password,
        mail : this.mail,
      }
      this.$http.post(config.menu.host + '/user/code', payload).then(response => {
        loader.hide()
        console.log(response.body);
        var responseBody = response.body
        this.code = response.body.code
        this.detailFlag = false

        this.showModal = true
        // this.email = responseBody.mail_id
        // this.password = responseBody.password
      }, error => {
        loader.hide()
        this.isShowError = true
       console.log('error',error);
          this.err_message = error.body
        
      })
    },
    okModal () {
      this.$router.push({ name: 'login' })
    },
    getData(){
      this.getFlag = false
    },
    checkCode (){
      var payload = {
        company_name : this.company_name,
        location: this.location,
        no_of_employees: this.no_of_employees,
        domain_name: this.domain_name,
        first_name: this.first_name,
        last_name: this.last_name,
        password: this.password,
        mail : this.mail,
        code: this.verification_code,
      }
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.post(config.menu.host + '/user', payload).then(response => {
        loader.hide()
        console.log(response.body);
        Vue.notify({ text: response.body, type: 'success' })
        this.$router.push({ name: 'login' })
      }, error => {
        console.log('err',error);
        loader.hide()
        this.isShowError = true
        Vue.notify({ text: error.body, type: 'error' })
      })
    }
  },
}
</script>

<style lang="scss">
</style>