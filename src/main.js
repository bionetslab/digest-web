import Vue from 'vue'
import App from './App.vue'

import * as CONFIG from "./Config"
import ApiService from "../services/api.service";
import vuetify from './plugins/vuetify'

ApiService.init(CONFIG.HOST_URL+CONFIG.CONTEXT_PATH)

Vue.prototype.$http = ApiService

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
