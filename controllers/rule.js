const ruleSvc = require("../services/ruleService.js");

exports.invoceRule = async(req, res) => {
    let returnData = {
        success: true,
        isWinning: true,
        winningData: [],
        winningAmount: 0,
        errorMsg: ""
    };
    try {
        getInvoceData = await ruleSvc.invoceRule(req.body);
        returnData.isWinning = getInvoceData.winningAmount > 0;
        returnData.winningData = getInvoceData.winningData;
        returnData.winningAmount = getInvoceData.winningAmount;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }

    res.json(returnData);
};

exports.productRule = async(req, res) => {
    let returnData = {
        success: true,
        product_data: {},
        errorMsg: ""
    };
    try {
        let getProductData = await ruleSvc.productRule(req.body);
        returnData.product_data = getProductData.product_data;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.memberRule = async(req, res) => {
    let returnData = {
        success: true,
        member_data: {},
        errorMsg: ""
    };
    try {
        let getMemberData = await ruleSvc.memberRule(req.body);
        let memberData = {
            user_name: getMemberData.member_data.user_name,
            user_auth: getMemberData.member_data.user_auth,
        };
        req.session.member = getMemberData.member_data;
        returnData.member_data = memberData;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.cartRule = async(req, res) => {
    let returnData = {
        success: true,
        cart_data: [],
        errorMsg: ""
    };
    try {
        let getCartData = await ruleSvc.cartRule(req.body, req.session);
        returnData.cart_data = getCartData.cart_data;
        req.session.member = getCartData.member_data;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.getMemberRule = (req, res) => {
    let returnData = {
        success: true,
        member_data: {},
        errorMsg: ""
    };
    try {
        returnData.member_data = req.session.member || {};

    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.loginOutMemberRule = (req, res) => {
    let returnData = {
        success: true,
        errorMsg: ""
    };
    try {
        delete req.session.member;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.addMemberRule = async(req, res) => {
    let returnData = {
        success: true,
        member_data: {},
        errorMsg: ""
    };
    try {
        let addProductData = await ruleSvc.addMemberRule(req.body, req.session);
        req.session.member = addProductData.member_data;
        returnData.member_data = addProductData.member_data;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.addProductRule = async(req, res) => {
    let returnData = {
        success: true,
        product_data: {},
        errorMsg: ""
    };
    try {
        let addProductData = await ruleSvc.addProductRule(req.body, req.session);
        returnData.product_data = addProductData.product_data;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.delProductRule = async(req, res) => {
    let returnData = {
        success: true,
        errorMsg: ""
    };
    try {
        await ruleSvc.delProductRule(req.body, req.session);
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.putToCartRule = async(req, res) => {
    let returnData = {
        success: true,
        member_data: {},
        errorMsg: ""
    };
    try {
        let setCartData = await ruleSvc.putToCartRule(req.body, req.session);
        returnData.member_data = setCartData.member_data;
        req.session.member = setCartData.member_data;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.delCartRule = async(req, res) => {
    let returnData = {
        success: true,
        cart_data: [],
        errorMsg: ""
    };
    try {
        let setCartData = await ruleSvc.delCartRule(req.body, req.session);
        returnData.cart_data = setCartData.cart_data;
        req.session.member = setCartData.member_data;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};

exports.doCheckoutRule = async(req, res) => {
    let returnData = {
        success: true,
        cart_data: [],
        errorMsg: ""
    };
    try {
        let doCheckoutData = await ruleSvc.doCheckoutRule(req.body, req.session);
        returnData.cart_data = doCheckoutData.cart_data;
        req.session.member = doCheckoutData.member_data;
    } catch (err) {
        console.error(err);
        returnData.success = false;
        returnData.errorMsg = err.message || err;
    }
    res.json(returnData);
};