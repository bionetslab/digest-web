import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import * as CONFIG from "./Config"
import ApiService from "../services/api.service";

library.add(fas, far)

ApiService.init(CONFIG.HOST_URL + CONFIG.CONTEXT_PATH)

const app = createApp(App)

app.config.globalProperties.$config = CONFIG
app.config.globalProperties.$http = ApiService

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(vuetify)

app.mount('#app')
