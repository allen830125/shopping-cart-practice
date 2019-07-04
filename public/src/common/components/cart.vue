<template>
    <div class="cart_container">
        <div class="cart_table">
            <div class="table_title">
                <span>cart: {{cartDataList.length}}</span>
            </div>
            <div class="table_list">
                <div class="list_tr">
                    <div class="product list_td">
                        <span>product info</span>
                    </div>
                    <div class="quatity list_td">
                        <span>quatity</span>
                    </div>
                    <div class="price list_td">
                        <span>price</span>
                    </div>
                    <div class="remark list_td">
                        <span>remark</span>
                    </div>
                    <div class="delete list_td">
                        <span>delete product</span>
                    </div>
                </div>
                <template v-for="data in cartDataList">
                    <div class="list_tr">
                        <div class="product list_td">
                            <div class="product_info">
                                <img :src="data.path">
                                <span>{{data.name}}</span>
                            </div>
                        </div>
                        <div class="quatity list_td">
                            <input type="number" class="input-medium" v-model="data.quatity">
                        </div>
                        <div class="price list_td">
                            <span>$NT {{data.price}}</span>
                        </div>
                        <div class="remark list_td">
                            <textarea v-model="data.remark" rows="3" cols="18"></textarea>
                        </div>
                        <div class="delete list_td">
                            <span class="delete_icon pointer" @click="delProduct(data)">
                                <i class="fas fa-trash"></i>
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="cart_list">
            <div class="list_title">
                <span>訂單金額</span>
            </div>
            <div class="list_item">
                <ul>
                    <li>
                        <span>未折扣金額</span>
                        <span>$NT {{allPrice}}</span>
                    </li>
                    <li v-if="isFirstDiscount">
                        <span>首購優惠</span>
                        <span>-$NT {{firstDiscount}}</span>
                    </li>
                    <li v-if="isDisplayDiscount">
                        <span>折價券/折扣碼</span>
                        <span>-$NT {{couponDiscount}}</span>
                    </li>
                </ul>
            </div>
            <div class="list_discount">
                <div class="discount_checkbox">
                    <input type="checkbox" v-model="isDisplayDiscount">
                    <span>使用折扣碼</span>
                </div>
                <div class="discount_input" v-if="isDisplayDiscount">
                    <input type="text" class="input-bottom" v-model="discountCode" placeholder="輸入折扣碼">
                    <button @click="useDiscount" class="btn-medium">使用</button>
                </div>
            </div>
            <div class="list_bill">
                <div class="bill_total">
                    <span>總計</span>
                    <span>$NT {{totalPrice}}</span>
                </div>
                <button @click="checkout" class="btn-medium">結帳</button>
            </div>
        </div>
        <div class="dialog-mask" v-show="isLoading">
            <div class="dialog-wrapper">
                <div class="dialog-container-for-loading">
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import store from "../store";

    export default {
        name: "cart",
        data() {
            return {
                isLoading: false,
                isUseDiscount: false,
                isDisplayDiscount: false,
                isFirstDiscount: false,
                discountCode: "",
                cartDataList: []
            }
        },
        mounted() {
            this.initPageLoad();
        },
        computed: {
            couponDiscount() {
                let data = 0;
                if (this.isUseDiscount) {
                    data = 100;
                }
                return data;
            },
            firstDiscount() {
                let data = 0;
                if (this.isFirstDiscount) {
                    data = 50;
                }
                return data;
            },
            allPrice() {
                let returnData = 0;
                this.cartDataList.forEach(data => {
                    let price = data.price || 0;
                    returnData += price;
                });
                return returnData;
            },
            totalPrice() {
                let data = this.allPrice;
                if (this.isFirstDiscount) {
                    data -= this.firstDiscount;
                }
                if (this.isUseDiscount) {
                    data -= this.couponDiscount;
                }

                return data;
            }
        },
        methods: {
            async getCartData() {
                let cartDataList = [];
                this.cartDataList = [];
                this.isLoading = true;
                let doRule = await axios.post("/api/cartRule");
                let ruleData = doRule.data || {};
                this.isLoading = false;
                if (ruleData.success) {
                    cartDataList = ruleData.cart_data;
                    cartDataList.forEach(data => {
                        data.path = data.img_path;
                    })
                } else {
                    alert(ruleData.errorMsg);
                }
                cartDataList.forEach(data => {
                    this.cartDataList.push(data);
                });
            },
            async initPageLoad() {
                await this.getCartData();
            },
            useDiscount() {
                if (this.discountCode === "abcd") {
                    this.isUseDiscount = true;
                } else {
                    this.isUseDiscount = false;
                    alert("驗證碼錯誤");
                }
            },
            async checkout() {
                let doRule = await axios.post("/api/doCheckoutRule", this.cartDataList);
                let ruleData = doRule.data;
                if (ruleData.success) {
                    this.initPageLoad();
                } else {
                    alert(ruleData.errorMsg);
                }
            },
            async delProduct(data = {}) {
                if (Object.keys(data).length === 0) {
                    return;
                }
                let question = confirm("確定要移除？");
                if (!question) {
                    return;
                }

                this.isLoading = true;
                let doRule = await axios.post("/api/delCartRule", data);
                let ruleData = doRule.data || {};
                this.isLoading = false;
                let cartDataList = [];
                this.cartDataList = [];
                if (ruleData.success) {
                    cartDataList = ruleData.cart_data;
                    cartDataList.forEach(data => {
                        data.path = data.img_path;
                    })
                } else {
                    alert(ruleData.errorMsg);
                }
                cartDataList.forEach(data => {
                    this.cartDataList.push(data);
                });
            },
        }
    }
</script>