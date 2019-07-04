<template>
    <div class="product_container">
        <div class="product_banner">
            <img :src="bannerPath" width="100%" height="100%">
        </div>
        <div class="prodcut_table">
            <div class="table_info">
                <div class="info_title">
                    <span>{{title}}</span>
                </div>
                <div class="info_list">
                    <ul>
                        <li v-if="$store.state.user_auth === 'A'">
                            <span :title="addProductTitle" class="pointer" @click="addProduct">
                                <i class="fas fa-plus"></i>
                            </span>
                        </li>
                        <li>
                            <span>商品排序</span>
                            <select v-model="productSort" @change="setProductSort()">
                                <option disabled value="">請選擇</option>
                                <template v-for="data in productSortList">
                                    <option :value="data.value">{{data.text}}</option>
                                </template>
                            </select>
                        </li>
                        <li>
                            <span>每頁顯示</span>
                            <select v-model="productNumber" @change="setProductNumber()">
                                <option disabled value="">請選擇</option>
                                <template v-for="data in productNumberList">
                                    <option :value="data.value">{{data.text}}</option>
                                </template>
                            </select>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="table_list">
                <div class="list_tr">
                    <div v-for="i in groupNumber" class="list_td">
                    </div>
                </div>
                <div v-for="(list, key) in productsList" class="list_tr">
                    <div v-for="(data, idx) in list" class="list_td">
                        <div class="td_picture">
                            <img :src="data.path">
                            <div class="picture_to_cart" :class="data.btn_class">
                                <span @click="openProductDetailDialog(data, 'cart')">加入購物車</span>
                            </div>
                        </div>
                        <div class="td_product_info">
                            <div class="info_name">
                                <span @click="openProductDetailDialog(data, 'detail')">
                                    {{data.name}}
                                </span>
                            </div>
                            <div class="info_price">
                                <span style="text-decoration: line-through;">
                                    $NT {{Math.floor(data.price/0.8)}}
                                </span>
                                <span style="color: red;">
                                    $NT {{data.price}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="product_pagination">
            <ul>
                <li v-if="pageList.length > 0" @click="changePage('pre')">
                    <i class="fas fa-angle-left"></i>
                </li>
                <li v-for="(page, idx) in pageList" :class="{'border-bottom': page.is_active}" @click="changePage(idx)">
                    {{page.number}}
                </li>
                <li v-if="pageList.length > 0">
                    <i class="fas fa-angle-right" @click="changePage('next')"></i>
                </li>
            </ul>

        </div>
        <div class="dialog" v-show="isShowDialog">
            <div class="dialog_mask">
                <div class="dialog_wrapper">
                    <div class="dialog_container">
                        <div class="container_content">
                            <div class="content_title">
                                <span class="pointer" @click="closeProductDetailDialog">
                                    <i class="fas fa-times fa-1x"></i>
                                </span>
                            </div>
                            <div class="content_main">
                                <div class="main_picture">
                                    <img :src="productDetail.path">
                                    <input type="file" v-if="isForAdd" ref="clearFile" accept=".png"
                                        @change="uploadImg">
                                </div>
                                <div class="main_info">
                                    <div class="info_title">
                                        <input type="text" class="input-medium" v-if="isForAdd"
                                            v-model="productDetail.name" placeholder="商品名稱">
                                        <span v-else>{{productDetail.name}}</span>
                                    </div>
                                    <div class="info_remark">
                                        <textarea v-if="isForAdd" rows="5" placeholder="商品備註" style="width: 100%;"
                                            v-model="productDetail.remark"></textarea>
                                        <span v-else>{{productDetail.remark}}
                                            Nostrud aliqua ad cupidatat ea in minim. In incididunt exercitation laboris
                                            deserunt dolor sit amet laborum deserunt anim sint. Pariatur qui officia
                                            deserunt ad fugiat velit nisi consequat velit deserunt amet velit amet.
                                        </span>
                                    </div>
                                    <div class="info_price">
                                        <template v-if="isForAdd">
                                            <label>$NT </label>
                                            <input type="number" class="input-medium" v-if="isForAdd"
                                                v-model="productDetail.price" placeholder="商品價錢" style="width: 87%;">
                                        </template>
                                        <template v-else>
                                            <span class="price_general">
                                                $NT {{Math.floor(productDetail.price / 0.8)}}
                                            </span>
                                            <span class="price_member">
                                                $NT {{productDetail.price}}
                                            </span>
                                        </template>
                                    </div>
                                    <div class="info_option">
                                        <template v-if="isForCart">
                                            <span>大小</span>
                                            <select class="select-medium" v-model="selectedSize">
                                                <option disabled value="">請選擇</option>
                                                <template v-for="size in productDetail.size">
                                                    <option :value="size">{{size}}</option>
                                                </template>
                                            </select>
                                            <span>數量</span>
                                            <input type="number" class="input-medium" min="1"
                                                :max="productDetail.quatity" placeholder="1" v-model="selectedQuatity">
                                            <button class="btn-medium" @click="putToCart()">加入購物車</button>
                                        </template>
                                        <template v-if="isForDel">
                                            <button class="btn-medium" @click="delProduct">刪除</button>
                                        </template>
                                        <template v-if="isForAdd">
                                            <span>商品大小</span>
                                            <div v-for="size in productSizeList" style="width: 30%; margin:5px;">
                                                <input type="checkbox" :id="size" :value="size"
                                                    v-model="productDetail.size">
                                                <span style="margin-left: -5px;">{{size}}</span>
                                            </div>
                                            <span>上架日期</span>
                                            <input type="date" class="input-medium"
                                                v-model="productDetail.launched_date">
                                            <span>下架日期</span>
                                            <input type="date" class="input-medium" v-model="productDetail.sold_date">
                                            <span>商品種類</span>
                                            <select class="select-medium" v-model="productDetail.type">
                                                <option disabled value="">請選擇</option>
                                                <template v-for="data in productTypeList">
                                                    <option :value="data.value">{{data.display}}</option>
                                                </template>
                                            </select>
                                            <span>商品數量</span>
                                            <input type="number" class="input-medium" v-model="productDetail.quatity">
                                            <button class="btn-medium" @click="confirmAddProduct">新增</button>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog">
            <div class="dialog_mask" v-show="isLoading">
                <div class="dialog_wrapper">
                    <div class="dialog_container_for_loading">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import moment from "moment";

    export default {
        name: "products",
        data() {
            return {
                isShowDialog: false,
                isForCart: false,
                isForDel: false,
                isForAdd: false,
                isLoading: false,
                title: "",
                addProductTitle: "新增商品",
                bannerPath: "",
                productSata: "",
                productType: "",
                productSort: "",
                productNumber: "",
                groupNumber: 4,
                productSortList: [{
                        value: "price",
                        text: "價錢"
                    },
                    {
                        value: "date",
                        text: "時間"
                    }
                ],
                productNumberList: [{
                        value: 24,
                        text: "24"
                    },
                    {
                        value: 36,
                        text: "36"
                    },
                    {
                        value: 48,
                        text: "48"
                    }
                ],
                allProduct: [],
                imgFile: {},
                productSizeList: ['S', 'M', 'L'],
                productTypeList: [{
                        value: "clothes",
                        display: "上衣"
                    },
                    {
                        value: "pants",
                        display: "褲子"
                    },
                    {
                        value: "shoes",
                        display: "鞋子"
                    },
                    {
                        value: "other",
                        display: "其他"
                    },
                ],
                productsList: [],
                productDetail: {},
                selectedSize: "",
                selectedQuatity: "",
                pageList: []
            }
        },
        async beforeRouteUpdate(to, from, next) {
            let param = to.params;
            let name = to.name;
            let productSta = name || "";
            let productType = param == null ? "" : param.type;
            // await this.initPageLoad(productSta, productType);
            next();
        },
        async mounted() {
            let param = this.$route.params;
            let name = this.$route.name;
            let productSta = name || "";
            let productType = param == null ? "" : param.type;
            await this.initPageLoad(productSta, productType);
        },
        methods: {
            async getMemberData() {
                let userName = this.$store.state.user_name || "";
                if (userName === "") {
                    await this.$store.dispatch("get_member_data");
                }
            },
            async getProductData() {
                let param = this.$route.params;
                let name = this.$route.name;
                let productSta = name || "";
                let productType = param == null ? "" : param.type;
                let params = {
                    status: productSta,
                    type: productType,
                    sort: this.productSort,
                };
                this.isLoading = true;
                let doRule = await axios.post("/api/procductRule", params);
                let ruleData = doRule.data || {};
                this.isLoading = false;
                if (ruleData.success) {
                    this.allProduct = [];
                    let dbData = ruleData.product_data || [];
                    dbData.forEach(data => {
                        this.allProduct.push(data);
                    });
                } else {
                    alert(ruleData.errorMsg);
                }
            },
            setProduct(new_page_index = 0) {
                this.productsList = [];
                let productLength = this.allProduct.length > this.productNumber ?
                    this.productNumber : this.allProduct.length;
                let groupLength = Math.ceil(productLength / this.groupNumber);
                for (let i = 0; i < groupLength; i++) {
                    let groupData = []
                    for (let j = 0; j < this.groupNumber; j++) {
                        let index = new_page_index * this.productNumber + i * this.groupNumber + j;
                        let product = this.allProduct[index]
                        if (product != null) {
                            groupData.push(product);
                        } else {
                            break;
                        }
                    }
                    this.productsList.push(groupData);
                }
            },
            setPagination(index = 0) {
                if (this.allProduct.length > 0) {
                    this.pageList = [];
                    let pageNumber = Math.ceil(this.allProduct.length / this.productNumber);
                    for (let key = 0; key < pageNumber; key++) {
                        let page = {
                            number: Number(key) + 1,
                            is_active: false
                        }
                        this.pageList.push(page);
                    }
                    this.pageList[index].is_active = true;
                }
            },
            async initPageLoad(product_sta = "", product_type = "") {
                this.bannerPath = product_sta === "new" ? "img/banner_fix2.png" : "img/banner2_fix1.png";
                this.title = product_type;
                this.productNumber = this.productNumberList[0].value;
                await this.getMemberData();
                await this.getProductData();
                this.setProduct();
                this.setPagination();
            },
            changePage(pageType = 1) {
                let nowPageIndex = this.pageList.findIndex(data => data.is_active);
                if (nowPageIndex === -1) {
                    return;
                }
                if (pageType === 'pre') {
                    if (!this.pageList[0].is_active) {
                        this.pageList[nowPageIndex].is_active = false;
                        this.pageList[nowPageIndex - 1].is_active = true;
                    }
                } else if (pageType === 'next') {
                    if (!this.pageList[this.pageList.length - 1].is_active) {
                        this.pageList[nowPageIndex].is_active = false;
                        this.pageList[nowPageIndex + 1].is_active = true;
                    }
                } else {
                    this.pageList[nowPageIndex].is_active = false;
                    this.pageList[pageType].is_active = true;
                }

                let newPageIndex = this.pageList.findIndex(data => data.is_active);
                if (newPageIndex === -1) {
                    return;
                }
                this.setProduct(newPageIndex);
            },
            async setProductSort() {
                await this.getProductData();
                this.setProduct();
                this.setPagination();
            },
            setProductNumber() {
                this.setProduct();
                this.setPagination();
            },
            openProductDetailDialog(product_info, type) {
                this.isShowDialog = true;
                this.isForCart = type === "cart";
                this.isForDel = type == "detail" && this.$store.state.user_auth === 'A';
                this.isForAdd = type === "add" && this.$store.state.user_auth === 'A';
                this.productDetail = product_info;
            },
            closeProductDetailDialog() {
                this.isShowDialog = false;
                this.isForCart = false;
                this.isForAdd = false;
                this.isForDel = false;
                this.productDetail = {};
                this.selectedSize = "";
                this.selectedQuatity = "";
                if (this.$refs.clearFile != null) {
                    this.$refs.clearFile.value = "";
                }
            },
            async putToCart() {
                let userName = this.$store.state.user_name || "";
                if (userName === "") {
                    await this.$store.dispatch("get_member_data");
                    if (this.$store.state.user_name === "") {
                        alert("請登入");
                        return;
                    }
                }
                let params = {
                    name: this.productDetail.name,
                    img_path: this.productDetail.path,
                    size: this.selectedSize,
                    quatity: this.selectedQuatity,
                    price: this.productDetail.price,
                    product_id: this.productDetail.id,
                }
                this.isLoading = true;
                let doRule = await axios.post("/api/putToCartRule", params);
                let ruleData = doRule.data || {};
                this.isLoading = false;
                setTimeout(() => {
                    if (ruleData.success) {
                        this.$store.dispatch("set_cart_data", ruleData.member_data);
                        alert("已放入購物車");
                        this.closeProductDetailDialog();
                    } else {
                        alert(ruleData.errorMsg);
                    }
                }, 100);

            },
            addProduct() {
                let addData = {
                    img_name: "",
                    name: "",
                    remark: "",
                    path: "",
                    price: 0,
                    size: [],
                    launched_date: "",
                    sold_date: "",
                    type: "",
                    quatity: 1
                };
                this.openProductDetailDialog(addData, "add");
            },
            uploadImg(e) {
                let file = e.target.files[0];
                this.productDetail.img_name = file.name;
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    this.productDetail.path = e.target.result;
                }
            },
            async confirmAddProduct() {
                let isAdd = true;
                for (let key of Object.keys(this.productDetail)) {
                    let data = this.productDetail[key];
                    if (typeof data !== "number") {
                        isAdd = data.length > 0 ? true : false
                    }
                    if (!isAdd) {
                        break;
                    }
                }
                if (!isAdd) {
                    alert("資料未填寫完整");
                    return;
                }
                this.isLoading = true;
                let doRule = await axios.post("/api/addProduct", this.productDetail);
                let ruleData = doRule.data || {};
                this.isLoading = false;
                setTimeout(() => {
                    if (ruleData.success) {
                        let newProduct = ruleData.product_data;
                        this.allProduct.splice(0, 0, newProduct);
                        this.setProduct(0);
                        this.closeProductDetailDialog();
                    } else {
                        alert(ruleData.errorMsg);
                    }
                }, 100);
            },
            async delProduct() {
                if (Object.keys(this.productDetail).length === 0) {
                    return;
                }
                let question = confirm("確定要移除？");
                if (!question) {
                    return;
                }

                this.isLoading = true;
                let doRule = await axios.post("/api/delProductRule", this.productDetail);
                let ruleData = doRule.data || {};
                this.isLoading = false;
                setTimeout(() => {
                    if (ruleData.success) {
                        this.allProduct = this.allProduct.filter(data => data.id !== this.productDetail.id);
                        this.setProduct(0);
                        this.closeProductDetailDialog();
                    } else {
                        alert(ruleData.errorMsg);
                    }
                }, 100);
            }
        }
    }
</script>