import { createRouter, createWebHistory } from 'vue-router'
import * as CONFIG from "./Config"
import Validation from "@/components/Validation.vue"
import Documentation from "@/components/Documentation.vue"
import About from "@/components/About.vue"

const router = createRouter({
  history: createWebHistory(CONFIG.PATH_PREFIX),
  routes: [
    { path: "/", component: Validation },
    { path: "/configure", component: Validation },
    { path: "/result", component: Validation },
    { path: "/documentation", component: Documentation },
    { path: "/about", component: About }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 64,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

export default router
