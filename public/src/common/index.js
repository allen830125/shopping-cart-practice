import Vue from "vue";

import router from "./router";
import store from "./store";

import IndexPage from "./components/indexPage";
import invoce from "./components/invoce.vue";

router.beforeEach(async(to, from, next) => {
    let toPath = to.path || "";
    if (toPath === "/cart" && store.state.user_name === "") {
        await store.dispatch("get_member_data");
        if (store.state.user_name === "") {
            next("/member/login");
        } else {
            next();
        }
    } else {
        next();
    }
})

const vm = new Vue({
    el: "#index",
    router,
    store,
    render: h => h(IndexPage)
});