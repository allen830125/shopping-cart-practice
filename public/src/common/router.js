import Vue from 'vue'
import VueRouter from 'vue-router'

import About from "./components/about";
import Index from "./components/index";
import Product from "./components/products";
import Member from "./components/member";
import Cart from "./components/cart";

Vue.use(VueRouter)

const routes = [{
    path: "/",
    component: Index
}, {
    path: "/about",
    component: About
}, {
    path: "/new/:type",
    name: "new",
    component: Product
}, , {
    path: "/all/:type",
    name: "all",
    component: Product
}, {
    path: "/member/:type",
    component: Member
}, {
    path: "/cart",
    component: Cart
}];

export default new VueRouter({
    routes
});