import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'

import * as CONFIG from "./Config"
import ApiService from "../services/api.service";
import vuetify from './plugins/vuetify'

ApiService.init(CONFIG.HOST_URL+CONFIG.CONTEXT_PATH)

Vue.prototype.$http = ApiService
Vue.use(VueRouter)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
