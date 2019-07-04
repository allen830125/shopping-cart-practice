<template>
    <div class="member_container">
        <div class="member_info" v-if="isLogin">
            <div class="info_title">
                <span>您好，{{$store.state.user_name}}</span>
                <a @click="loginOut">登出</a>
            </div>
            <div class="info_list">
                <ul>
                    <template v-for="list in infoList">
                        <li @click="selectList(list.value)" :class="list.status">{{list.display}}</li>
                    </template>
                </ul>
            </div>
            <div class="info_content">
                <div class="content_info">
                    <template v-if="selectedList === 'info'">
                        <div class="info_member">
                            <template v-for="list in memberInfoList">
                                <label v-if="!list.is_hidden">{{list.display}}</label>
                                <input v-if="!list.is_hidden" class="input-medium" :type="list.type" v-model="list.data"
                                    :reqired="list.is_required" :disabled="list.is_disabled">
                            </template>
                        </div>
                    </template>
                    <template v-if="selectedList === 'order'">
                        <div class="info_order">
                            <div class="order_tr">
                                <div class="order_td">
                                    <span>order no</span>
                                </div>
                                <div class="order_td">
                                    <span>order date</span>
                                </div>
                                <div class="order_td">
                                    <span>payment status</span>
                                </div>
                                <div class="order_td">
                                    <span>payment type</span>
                                </div>
                                <div class="order_td">
                                    <span>order status</span>
                                </div>
                                <div class="order_td">
                                    <span>order remark</span>
                                </div>
                            </div>
                            <template v-for="data in orderDataList">
                                <div class="order_tr">
                                    <div class="order_td">
                                        <span>{{data.order_no}}</span>
                                    </div>
                                    <div class="order_td">
                                        <span>{{data.order_date}}</span>
                                    </div>
                                    <div class="order_td">
                                        <span>{{data.payment_state}}</span>
                                    </div>
                                    <div class="order_td">
                                        <span>{{data.payment_type}}</span>
                                    </div>
                                    <div class="order_td">
                                        <span>{{data.order_status}}</span>
                                    </div>
                                    <div class="order_td">
                                        <span>{{data.order_remark}}</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="member_login" v-else>
            <div class="login_content">
                <template v-if="isRegister">
                    <span>註冊個人帳號</span>
                    <template v-for="list in registerDataList">
                        <input class="input-medium" :type="list.type" :placeholder="list.display" v-model="list.data"
                            :reqired="list.is_required">
                    </template>
                    <button class="btn-medium" @click="register">立即加入</button>
                </template>
                <template v-else>
                    <span>會員登入</span>
                    <template v-for="list in loginDataList">
                        <input class="input-medium" :type="list.type" :placeholder="list.display" v-model="list.data"
                            :reqired="list.is_required">
                    </template>
                    <div class="content_option">
                        <button class="btn-medium" @click="loginIn">登入</button>
                        <button class="btn-medium" @click="isRegister = true">立即註冊</button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import moment from "moment";

    export default {
        name: "member",
        data() {
            return {
                isLogin: true,
                isRegister: false,
                infoList: [],
                selectedList: "",
                memberInfoList: [{
                        name: "user_name",
                        data: "",
                        type: "text",
                        is_required: true,
                        is_disabled: true,
                        is_hidden: false,
                        display: "用戶名"
                    },
                    {
                        name: "user_email",
                        data: "",
                        type: "email",
                        is_required: true,
                        is_disabled: true,
                        is_hidden: false,
                        display: "e-mail",
                    },
                    {
                        name: "user_password",
                        data: "",
                        type: "password",
                        is_required: true,
                        is_disabled: true,
                        is_hidden: false,
                        display: "密碼"
                    }
                ],
                registerDataList: [],
                loginDataList: [],
                orderDataList: []
            }
        },
        mounted() {
            this.initPageLoad();
        },
        methods: {
            async getUserData() {
                let userName = this.$store.state.user_name || "";
                if (userName === "") {
                    await this.$store.dispatch("get_member_data");
                    let storeUserName = this.$store.state.user_name || ""
                    this.isLogin = storeUserName !== "";
                }
            },
            async getMemberAllData() {
                let doRule = await axios.post("/api/getMemberRule");
                let ruleData = doRule.data || {};
                if (ruleData.success) {
                    let memberData = ruleData.member_data
                    if (memberData != null) {
                        this.memberInfoList.forEach((list, idx) => {
                            this.memberInfoList[idx].data = memberData[list.name];
                        });
                        let orderList = memberData.order.filter(data => data.is_checkout);
                        orderList.forEach(data => {
                            data.order_date = moment(data.order_date).format("YYYY/MM/DD");
                            this.orderDataList.push(data)
                        });
                    }
                } else {
                    alert(ruleData.errorMsg);
                }
            },
            async initData() {
                if (!this.isLogin) {
                    this.registerDataList = [{
                            name: "user_name",
                            data: "",
                            type: "text",
                            is_required: true,
                            display: "用戶名"
                        },
                        {
                            name: "user_password",
                            data: "",
                            type: "password",
                            is_required: true,
                            display: "密碼"
                        },
                        {
                            name: "confirm_password",
                            data: "",
                            type: "password",
                            is_required: true,
                            display: "確認密碼"
                        },
                        {
                            name: "user_email",
                            data: "",
                            type: "email",
                            is_required: true,
                            display: "e-mail"
                        }
                    ];
                    this.loginDataList = [{
                            name: "user_email",
                            data: "",
                            type: "email",
                            is_required: true,
                            display: "e-mail"
                        },
                        {
                            name: "user_password",
                            data: "",
                            type: "password",
                            is_required: true,
                            display: "密碼"
                        }
                    ];
                } else {
                    this.infoList = [{
                            value: "info",
                            display: "個人資訊",
                            status: "border-bottom"
                        },
                        {
                            value: "order",
                            display: "訂單列表",
                            status: ""
                        }
                    ];
                    this.selectedList = this.infoList[0].value;
                    await this.getMemberAllData();
                }
            },
            async initPageLoad() {
                await this.getUserData();
                this.initData();
            },
            selectList(value) {
                let selectedIndex = this.infoList.findIndex(data => data.value === value);
                let nowSelectedIndex = this.infoList.findIndex(data => data.status === "border-bottom");
                if (selectedIndex > -1 && nowSelectedIndex > -1) {
                    this.infoList[selectedIndex].status = "border-bottom";
                    this.infoList[nowSelectedIndex].status = "";
                    this.selectedList = this.infoList[selectedIndex].value;
                }
            },
            async register() {
                let isRegister = true;
                let msg = "";
                let param = {}
                for (let list of this.registerDataList) {
                    if (list.data === "") {
                        isRegister = false;
                        msg = `${list.display}為必填!`;
                        break;
                    }
                    param[list.name] = list.data;
                }
                if (!isRegister) {
                    alert(msg);
                    return;
                }
                let doRule = await axios.post("/api/addMemberRule", param);
                let ruleData = doRule.data || {};
                if (ruleData.success) {
                    this.isLogin = true;
                    this.initPageLoad();
                } else {
                    alert(ruleData.errorMsg);
                }
            },
            async loginIn() {
                let isLogin = true;
                let msg = "";
                let param = {}
                for (let list of this.loginDataList) {
                    if (list.data === "") {
                        isRegister = false;
                        msg = `${list.display}為必填!`;
                        break;
                    }
                    param[list.name] = list.data;
                }
                if (!isLogin) {
                    alert(msg);
                    return;
                }
                let doRule = await axios.post("/api/memberRule", param);
                let ruleData = doRule.data || {};
                if (ruleData.success) {
                    this.$store.dispatch("set_member_data", ruleData.member_data);
                    this.isLogin = true;
                    this.initPageLoad();
                } else {
                    alert(ruleData.errorMsg);
                }
            },
            async loginOut() {
                await this.$store.dispatch("login_out_member_data");
                this.initPageLoad();
            }
        }
    }
</script>