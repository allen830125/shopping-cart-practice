const ruleCrtl = require("./controllers/rule.js");
const pageCrtl = require("./controllers/page.js");

module.exports = (app) => {

    // 頁面
    app.get("/", pageCrtl.indexPage);

    // api
    // 發票兌獎
    app.post("/api/invoceRule", ruleCrtl.invoceRule);
    // 取得商品資料
    app.post("/api/procductRule", ruleCrtl.productRule);
    // 取得會員資料
    app.post("/api/memberRule", ruleCrtl.memberRule);
    // 取得購物車資料
    app.post("/api/cartRule", ruleCrtl.cartRule);
    // 取得session中會員資料
    app.post("/api/getMemberRule", ruleCrtl.getMemberRule);
    // 登出會員資料(刪除session 中會員資料)
    app.post("/api/loginOutMemberRule", ruleCrtl.loginOutMemberRule);
    // 新增會員資料
    app.post("/api/addMemberRule", ruleCrtl.addMemberRule);
    // 新增商品資料
    app.post("/api/addProduct", ruleCrtl.addProductRule);
    // 刪除商品資料
    app.post("/api/delProductRule", ruleCrtl.delProductRule);
    // 新增購物車資料
    app.post("/api/putToCartRule", ruleCrtl.putToCartRule);
    // 刪除購物車資料
    app.post("/api/delCartRule", ruleCrtl.delCartRule);
    // 結帳
    app.post("/api/doCheckoutRule", ruleCrtl.doCheckoutRule);
};