<template>
  <div class="dashboard">
    <va-card align="center"
      justify="center">
           <h1>Welcome To Intranet!</h1>
     </va-card>
  </div>
</template>

<script>
import Vue from 'vue'
import vueResource from 'vue-resource'

Vue.use(vueResource)
export default {
  name: 'dashboard',
}
</script>