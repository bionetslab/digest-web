// import Vue from "vue";
import Router from "vue-router";
import * as CONFIG from "./Config"
import Validation from "@/components/Validation";
import Documentation from "@/components/Documentation";
import About from "@/components/About";
const router = new Router({
        mode: "history",
        base: CONFIG.PATH_PREFIX,
        routes: [
            // {path:"/explore/:view/result/:job", component:App},
            // {path:"/", redirect:"/home"},
            {path: "/", component: Validation},
            {path: "/configure", component: Validation},
            {path: "/result", component: Validation},
            {path:"/documentation", component:Documentation},
            {path:"/about", component:About}
        ]
    },

);

export default router
