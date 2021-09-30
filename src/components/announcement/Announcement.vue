<template>
  <div v-if="isshowgrid">
    <va-card title="Announcement List">
      <div class="row align--center">
        <div class="flex xs12 md6">
          <va-input class="va-input-search-container"
            :value="term"
            placeholder="search"
            @input="search"
            removable
          >
            <va-icon name="fa fa-search" slot="prepend" />
          </va-input>
        </div>
        <div class="flex xs12 md3 offset--md3">
          <va-button color="success" icon="fa fa-plus" @click="add()">Add Announcement</va-button>
        </div>
      </div>
      <va-data-table
        :fields="fields"
        :data="filteredData"
        :per-page="parseInt(perPage)"
        clickable
      >
        <template slot="actions" slot-scope="props">
          <va-button flat small color="gray" icon="fa fa-pencil" @click="edit(props.rowData)" class="ma-0"></va-button>
        </template>
      </va-data-table>
    </va-card>
  </div>
  <div v-else-if='isshowForm'>
    <div>
      <va-card :title="title">
        <template slot="actions">
          <va-button color="gray" @click="list()">List</va-button>
        </template>
        <div>
          <form>
            <span class="va-form-label va-form-required-label">Subject</span>
            <va-input
              v-model.trim="subject"
              type="text"              
              placeholder="Enter subject"
              :error="!!subjectErrors.length"
              :error-messages="subjectErrors"
            />
            <span class="va-form-label va-form-required-label">Category</span>
            <va-select
              v-if="isCreate"
              placeholder="Select Category"
              v-model="category"
              searchable
              textBy="data"
              :options="categoryArr"
              :error="!!categoryErrors.length"
              :error-messages="categoryErrors"
            />
            <va-input
              v-if="isUpdate"
              v-model.trim="category"
              type="text"              
              placeholder="Enter category"
              :disabled="true "
            />
            <span class="va-form-label va-form-required-label">Description</span>
            <textarea class="text_box" v-model="description" />
            <span v-if="category.data == 'Event'" class="va-form-label va-form-required-label">Location</span>
            <va-input
              v-if="category.data == 'Event'"
              v-model.trim="location"
              type="text"              
              placeholder="Enter Location"
              :error="!!locationErrors.length"
              :error-messages="locationErrors"
            />
            <span v-if="category.data == 'Event'" class="va-form-label va-form-required-label">Date</span><br>

              <datepicker
               v-if="category.data == 'Event'"
                class="date_picker"
                v-model="date"
                format="MMM dd yyyy"
                :error="!!dateErrors.length"
                :error-messages="dateErrors"
              />
              <span v-if="category.data == 'Event'" class="va-form-label va-form-required-label">Time</span><br>
             <va-input
             v-if="category.data == 'Event'"
              v-model.trim="time"
              class = "flex xs2"
              type="text"              
              placeholder="Enter time"
              :error="!!timeErrors.length"
              :error-messages="timeErrors"
            />
            <span v-if="category.data == 'Reminder'" class="va-form-label va-form-required-label">Expires on</span><br>
              <datepicker
               v-if="category.data == 'Reminder'"
                class="date_picker"
                v-model="expires_on"
                format="MMM dd yyyy"
                :error="!!expiresErrors.length"
                :error-messages="expiresErrors"
              />
              <span class="va-form-label va-form-required-label">Notify To</span>
            <textarea class="text_box" v-model="notify" placeholder="Enter multiple email id and seperate by commas" />
            <div class="d-flex justify--end mt-3">
              <va-button type="submit" class="my-0 va-button-normal-cancel" @click.prevent="list()">Cancel</va-button>
              <va-button v-if="isCreate" type="submit" class="my-0" @click.prevent="createGenres()">Send</va-button>
              <va-button v-if="isUpdate" type="submit" class="my-0" @click.prevent="updateGenres()">Update</va-button>              
            </div>
          </form>
        </div>
      </va-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import vueResource from 'vue-resource'
import { search } from '../../i18n/search.js'
import config from '../../i18n/en.json'
import { debounce } from 'lodash'
import Datepicker from 'vuejs-datepicker'
import VueTimepicker from 'vue2-timepicker'
Vue.use(vueResource)
export default {
  name: 'announcement',
    components: { Datepicker , VueTimepicker},
  beforeCreate () {
    const loader = Vue.$loading.show({ width: 40, height: 40 })
	    this.$http.get(config.menu.host + '/announcement/'+Vue.$cookies.get('user-id')).then(response => {
	      loader.hide()
	      this.announcementData = response.body
	      this.isshowForm = false
	      this.isshowgrid = true
        this.getAllGenres()
	    }, error => {
	      loader.hide()
	      if (error && error.body) {
	        Vue.notify({ text: error.body, type: 'error' })
	      }
	    })
  },
  data () {
    return {
      term: null,
      perPage: '10',
      perPageOptions: ['4', '6', '10', '20'],
      isshowgrid: false,
      isshowForm: false,
      isCreate: false,
      isUpdate: false,
      showRemoveModal: false,
      announcement: '',
      order: '',
      title: '',
      sc_category : '',
      announcementData: [],
      announcementErrors: [],
      priorityErrors: [],
      subject: '',
      subjectErrors: [],
      categoryErrors: [],
      categoryArr: [{id:1,data:'Announcement'},{id:2,data:'Event'},{id:3,data:'Reminder'}],
      description: '',
      locationErrors: [],
      location: '',
      category: '',
      date: new Date(),
      dateErrors: [],
      time: '',
      timeErrors: [],
      expiresErrors: [],
      expires_on: new Date(),
      notify: '',
    }
  },
  computed: {
    formReady () {
      return !this.announcementErrors.length && !this.priorityErrors.length
    },
    fields () {
      return [{
          name: 'sno',
          title: 'S.NO',
          width: '6%',
      },{
        name: '__slot:marker',
        width: '30px',
        dataClass: 'text-center',
      },
      {
        name: 'category',
        title: 'Category',
      },
      {
        name: 'description',
        title: 'Description',
      },
      {
        name: '__slot:actions',
        dataClass: 'text-right',
      }]
    },
    filteredData () {
      return search(this.term, this.announcementData)
    },
  },
  methods: {
	    getAllGenres () {
        this.isshowgrid = true
         this.announcementData = []
	      this.$http.get(config.menu.host + '/announcement/'+Vue.$cookies.get('user-id')).then(response => {
          let index = 0
          this.announcementData = response.body.map(function (item) {
              item.id = index++
              item.sno = index
              item.is_existing = true
              item.checkbox_value = false
              return item
          })
	        this.isshowgrid = true
	      })
	    },
    createGenres () {
      this.subjectErrors = this.subject ? [] : ['Subject is required']
      this.categoryErrors = this.category ? [] : ['Category is required']
      if (!this.formReady) {
        return
      }
      var payload = {
        subject: this.subject,
        category: this.category.data,
        description : this.description,
        date : this.date,
        time : this.time,
        expires_on : this.expires_on,
        notify : this.notify,
        location: this.location,
        user_id: Vue.$cookies.get('user-id')
      }
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.post(config.menu.host + '/announcement', payload).then(responseData => {
        loader.hide()
        if (responseData && responseData.body) {
          Vue.notify({ text: responseData.body, type: 'success' })
        }
        this.list()
      }, errResponse => {
        loader.hide()
        if (errResponse && errResponse.body) {
          Vue.notify({ text: errResponse.body, type: 'error' })
        }
      })
    },
    updateGenres () {
      var payload = {
        time: this.time,
        date: this.date,
        location : this.location,
        description: this.description,
        notify: this.notify
      }
      const loader = Vue.$loading.show({ width: 40, height: 40 })
      this.$http.put(config.menu.host + '/announcement/' + this.announcement_id, payload).then(responseData => {
        loader.hide()
        if (responseData && responseData.body) {
          Vue.notify({ text: responseData.body, type: 'success' })
        }
        this.list()
      }, errResponse => {
        loader.hide()
        if (errResponse && errResponse.body) {
          Vue.notify({ text: errResponse.body, type: 'error' })
        }
      })
    },
	  add () {
	    this.title = 'Create Announcement'
      this.announcement = ''
      this.category = ''
      this.subject = ''
      this.announcementErrors = []
      this.description = ''
       this.location = ''
        this.time = ''
          this.date = new Date()
           this.expires_on = new Date()
      this.categoryErrors = []
      this.priorityErrors = []
      this.isshowForm = true
      this.isshowgrid = false
      this.isUpdate = false
      this.isCreate = true
	    },
    edit (row) {
      this.title = 'Update Announcement'
      this.announcement_id = row.announcement_id
      this.announcement = row.announcement
      this.category = row.category
      this.description = row.description
      this.time = row.time
      this.location = row.location
      this.date = row.date
      this.expires_on = row.expires_on
      this.subject = row.subject
      this.notify = row.notify
      this.isshowgrid = false
      this.isshowForm = true
      this.isCreate = false
      this.isUpdate = true
    },
	    list () {
      this.isshowForm = false
      this.isshowgrid = true
      this.getAllGenres()
    },
	    search: debounce(function (term) {
	    	this.term = term
	    }, 400),
  },
}
</script>

<style scoped>
.text_box {
  width: 937px;
  height: 101px;
  border-color: black;
  border-radius: 10px;
  resize: none;
}

.fields {
  display: grid;
  grid-template-columns: 6fr 6fr 6fr 6fr 1fr 1fr;
  grid-gap: 1rem;
  margin-top: 2rem;
}

.content_width {
  width: 30px;
  height: 30px;
}

</style>