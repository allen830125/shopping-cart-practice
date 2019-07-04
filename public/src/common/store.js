import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex);

const state = {
    user_name: "",
    user_auth: "",
};
const mutations = {
    set_member_data(state, payload) {
        state.user_name = payload.user_name || "";
        state.user_auth = payload.user_auth || "";
    }
};
const actions = {
    set_member_data({
        commit
    }, payload) {
        commit("set_member_data", payload);
    },
    async get_member_data({
        commit
    }) {
        let doRule = await axios.post("/api/getMemberRule");
        let ruleData = doRule.data || {};
        let memberData = {};
        if (ruleData.success) {
            memberData = ruleData.member_data;
        }
        commit("set_member_data", memberData);
    },
    async login_out_member_data({
        commit
    }) {
        let doRule = await axios.post("/api/loginOutMemberRule");
        let ruleData = doRule.data || {};
        let memberData = {};
        if (ruleData.success) {
            memberData = {
                user_name: "",
                user_auth: ""
            };
        }
        commit("set_member_data", memberData);
    }
};
const getters = {};

export default new Vuex.Store({
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
});