<template>
    <div class="container">
        <div class="header" :class="{'sticky': scrolled}">
            <div class="header_menu">
                <button class="pointer menu_button" @click="setMenuPanel">
                    <i class="fas fa-bars fa-1x"></i>
                </button>
            </div>
            <div class="header_logo">
                <a class="pointer">
                    <router-link to="/">
                        <img src="img/cooker.png">
                    </router-link>
                </a>
            </div>
            <div class="header_other">
                <ul>
                    <li @mouseover="searchInputSta = 'show-inline-block'" @mouseleave="searchInputSta = 'hide'">
                        <div :class="searchInputSta">
                            <input type="text" class="other_search_input" v-model="searchData" />
                        </div>
                        <span class="pointer other_icon" @click="doSearch">
                            <router-link :to="searchPath">
                                <i class="fas fa-search fa-1x"></i>
                            </router-link>
                        </span>
                    </li>
                    <li>
                        <span class="pointer other_icon">
                            <router-link to="/member/myAccount">
                                <i class="fas fa-user fa-1x"></i>
                            </router-link>
                        </span>
                    </li>
                    <li>
                        <span class="pointer other_icon">
                            <router-link to="/cart">
                                <i class="fas fa-shopping-cart fa-1x"></i>
                            </router-link>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="content">
            <div class="menuPanel" :class="menuPanelStatus">
                <ul>
                    <li v-for="(menu, idx) in menuLists">
                        <template v-if="menu.text != null">
                            <div class="paenl_first_list">
                                <label class="pointer hover-brown">
                                    <template v-if="menu.path != null">
                                        <router-link :to="menu.path" :name="menu.name"> {{menu.text}} </router-link>
                                    </template>
                                    <template v-else>
                                        <a>{{menu.text}}</a>
                                    </template>
                                </label>
                                <span class="pointer" @click="setList(idx)">
                                    <template v-if="menu.children.length > 0">
                                        <i :class="menu.arrow_dir"></i>
                                    </template>
                                </span>
                            </div>
                        </template>
                        <template v-if="menu.children.length > 0">
                            <div class="paenl_sencond_list" :class="menu.list_sta">
                                <ul>
                                    <li v-for="child in menu.children">
                                        <span class="pointer hover-brown">
                                            <template v-if="child.path != null">
                                                <router-link :to="child.path" :name="child.name"> {{child.text}}
                                                </router-link>
                                            </template>
                                            <template v-else>
                                                <a>{{child.text}}</a>
                                            </template>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </li>
                </ul>
            </div>
            <div class="mainPanel width-80" :class="mainPanelStatus">
                <router-view :key="$route.path"></router-view>
            </div>
        </div>
        <div class="footer" :class="footerStatus">
            <div class="statement">
                Do nulla quis veniam aliquip cillum pariatur incididunt ipsum incididunt quis veniam sint est. Nisi
                minim ad nisi cupidatat incididunt aliquip officia officia reprehenderit minim amet. Et excepteur magna
                mollit nulla reprehenderit id do ex et. Ea adipisicing in adipisicing eiusmod irure nulla ad proident
                ullamco veniam. Ex est aute minim occaecat enim ad esse enim exercitation duis aute.
            </div>
            <div class="contact">
                Exercitation aliquip aute eu non sint nostrud esse aliqua non. Ad et labore do ex sunt occaecat veniam.
                Deserunt aute nostrud eiusmod sit elit aute aliqua est labore eiusmod laborum. In velit incididunt
                mollit esse officia veniam duis Lorem amet adipisicing. Anim magna excepteur cupidatat ad in quis.
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "indexPage",
        data() {
            return {
                menuLists: [],
                isShowMenu: true,
                menuPanelStatus: "",
                mainPanelStatus: "",
                footerStatus: "",
                isShowSearchInput: false,
                searchInputSta: "hide",
                scrolled: false,
                searchData: "",
                searchPath: "/all/search"
            }
        },
        created() {
            window.addEventListener("scroll", this.handleScroll);
        },
        mounted() {
            this.initPageLoad();
        },
        methods: {
            handleScroll() {
                let header = document.getElementsByClassName("header");
                var sticky = header.offsetTop || 0;
                if (window.pageYOffset > sticky) {
                    this.scrolled = true;
                } else {
                    this.scrolled = false;
                }

                if (this.scrolled) {
                    if (this.isShowMenu) {
                        if (!this.menuPanelStatus.includes(" menu-sticky")) {
                            this.menuPanelStatus += " menu-sticky";
                        }
                        this.mainPanelStatus = "padding-left-20";
                        this.footerStatus = "padding-left-20";
                    }
                } else {
                    if (this.isShowMenu) {
                        this.menuPanelStatus = "";
                    }
                    this.mainPanelStatus = "";
                    this.footerStatus = "";
                }
            },
            initPageLoad() {
                this.menuLists = [{
                        text: "關於",
                        children: [],
                        arrow_dir: "",
                        list_sta: "",
                        path: "/about",
                        name: "about"
                    },
                    {
                        text: "新品",
                        children: [{
                                text: "上衣",
                                children: [],
                                path: "/new/clothes",
                                name: "new"
                            },
                            {
                                text: "褲子",
                                children: [],
                                path: "/new/pants",
                                name: "new"
                            },
                            {
                                text: "鞋子",
                                children: [],
                                path: "/new/shoes",
                                name: "new"
                            },
                            {
                                text: "其他",
                                children: [],
                                path: "/new/other",
                                name: "new"
                            }
                        ],
                        arrow_dir: "down",
                        list_sta: "hide",
                        path: "/new/all",
                        name: "new"
                    },
                    {
                        text: "商品",
                        children: [{
                                text: "上衣",
                                children: [],
                                path: "/all/clothes",
                                name: "all"
                            },
                            {
                                text: "褲子",
                                children: [],
                                path: "/all/pants",
                                name: "all"
                            },
                            {
                                text: "鞋子",
                                children: [],
                                path: "/all/shoes",
                                name: "all"
                            },
                            {
                                text: "其他",
                                children: [],
                                path: "/all/other",
                                name: "all"
                            }
                        ],
                        arrow_dir: "down",
                        list_sta: "hide",
                        path: "/all/all",
                        name: "all"
                    },
                    {
                        text: "其他",
                        children: [{
                            text: "聯絡我們",
                            children: []
                        }],
                        arrow_dir: "down",
                        list_sta: "hide"
                    }
                ];
                this.setMenuPanelShowHide();
            },
            setMenuPanel() {
                this.isShowMenu = !this.isShowMenu;
                this.setMenuPanelShowHide();
            },
            setMenuPanelShowHide() {
                this.menuPanelStatus = this.isShowMenu ? "show-inline-block" : "show-off-panel-slide-up";
                if (this.isShowMenu && this.scrolled) {
                    this.menuPanelStatus += " menu-sticky"
                }
                let anotherClass = this.isShowMenu ? "" : " hide";
                setTimeout(() => {
                    this.menuPanelStatus += anotherClass;
                }, 600);
                this.mainPanelStatus = this.isShowMenu && this.scrolled ? "padding-left-20" : "";
                this.footerStatus = this.isShowMenu && this.scrolled ? "padding-left-20" : "";
            },
            setList(index) {
                let arrowDir = this.menuLists[index].arrow_dir || "down";
                let listSta = this.menuLists[index].list_sta || "down";
                this.menuLists[index].arrow_dir = arrowDir === "down" ? "up" : "down";
                let nowListSta = this.menuLists[index].arrow_dir;
                this.menuLists[index].list_sta = nowListSta === "up" ? "show-list" : "hide-list";
                let anotherClass = nowListSta === "up" ? "" : " hide";
                setTimeout(() => {
                    this.menuLists[index].list_sta += anotherClass;
                }, 300);
            },
            doSearch() {
                let queryParam = this.searchData;
                if (this.searchData === "") {
                    queryParam = "search";
                }
                this.searchPath = "/all/" + queryParam;
            }
        }
    }
</script>