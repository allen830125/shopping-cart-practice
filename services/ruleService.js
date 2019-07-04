const moment = require("moment");
const {
    md5
} = require("md5js");
const fs = require("fs");
const path = require("path");

const mongoAgent = require("../models/mongodb/index.js");
const tools = require("../utils.js");


// 發票兌獎
exports.invoceRule = async(postData) => {
    try {
        let month = postData.month || "";
        let param = {
            month_type: month
        };

        let winningNumber = await mongoAgent.WinningNumber.find(param) || [];
        winningNumber = tools.mongoDocToObject(winningNumber);
        let invoce = await mongoAgent.Invoce.find(param) || [];
        invoce = tools.mongoDocToObject(invoce);

        let specialData = winningNumber.filter(data => data.winning_type === "special") || {};
        let lessSpecialData = winningNumber.filter(data => data.winning_type === "lessSpecial") || {};
        let firstData = winningNumber.filter(data => data.winning_type === "first") || [];
        let sixthData = winningNumber.filter(data => data.winning_type === "sixth") || [];

        let allWinning = [{
                type: "special",
                number: specialData,
                winning: [],
                amount: specialData.length > 0 ? specialData[0].amount : 0
            },
            {
                type: "lessSpecial",
                number: lessSpecialData,
                winning: [],
                amount: specialData.length > 0 ? lessSpecialData[0].amount : 0
            },
            {
                type: "first",
                number: firstData,
                winning: [],
                amount: specialData.length > 0 ? firstData[0].amount : 0
            },
            {
                type: "second",
                number: ["splitWinningNumber1"],
                winning: [],
                amount: 40000
            },
            {
                type: "third",
                number: ["splitWinningNumber2"],
                winning: [],
                amount: 10000
            },
            {
                type: "forth",
                number: ["splitWinningNumber3"],
                winning: [],
                amount: 4000
            },
            {
                type: "fifth",
                number: ["splitWinningNumber4"],
                winning: [],
                amount: 1000
            },
            {
                type: "sixth",
                number: ["splitWinningNumber5", sixthData[0], sixthData[1]],
                winning: [],
                amount: 200
            }
        ];

        let winningData = [];
        let winningAmount = 0;

        allWinning.forEach(all => {
            all.number.forEach(data => {
                if (typeof data === "string" && data.substring(0, data.length - 1) === "splitWinningNumber") {
                    let typeWinning = [];
                    firstData.forEach(first => {
                        let winning = invoce.filter(iData => {
                            let digital = data.substr(-1);
                            let nowNumber = splitWinningNumber(iData.number, digital);
                            let compareNumber = splitWinningNumber(first.number, digital);
                            return nowNumber === compareNumber;
                        });
                        winning.forEach(wData => {
                            typeWinning.push(wData);
                        })
                    });
                    typeWinning.forEach(tData => {
                        let winningData = {
                            date: tData.date,
                            month_type: tData.month_type,
                            number: tData.number
                        }
                        all.winning.push(winningData);
                    });
                } else {
                    let typeWinning = invoce.filter(iData => iData === data.number);
                    typeWinning.forEach(tData => {
                        let winningData = {
                            date: tData.date,
                            month_type: tData.month_type,
                            number: tData.number
                        }
                        all.winning.push(winningData);
                    });
                }
            })
        });

        allWinning.forEach(all => {
            all.winning.forEach(wData => {
                wData.date = moment(wData.date).format("YYYY/MM/DD");
                winningData.push(wData);
            })
            winningAmount += all.winning.length * all.amount;
        });

        return {
            winningData: winningData,
            winningAmount: winningAmount
        };

    } catch (err) {
        throw new Error(err);
    }
};
// 取得商品資料
exports.productRule = async(postData) => {
    try {
        let productSta = postData.status || "all";
        let productTyp = postData.type || "";
        let param = {};

        if (productSta === "new") {
            param["launched_date"] = {};
            param["launched_date"]["$gte"] = moment().add(-7, 'd').toISOString();
            param["launched_date"]["$lt"] = moment().toISOString();
        }

        if (productTyp !== "all") {
            let typeList = ["clothes", "pants", "shoes", "other"];
            if (typeList.includes(productTyp)) {
                param["product_type"] = productTyp;
            } else {
                let productName = productTyp;
                if (productName !== "search" && productName !== "") {
                    param["product_name"] = new RegExp(productName, 'i')
                }
            }
        }

        let productSort = postData.sort || ""
        let sortParam = {}
        if (productSort !== "") {
            if (productSort === "price") {
                sortParam["product_price"] = -1;
            } else {
                sortParam["launched_date"] = -1;
            }
        }

        let productData = await mongoAgent.Product.find(param).sort(sortParam) || [];
        productData = tools.mongoDocToObject(productData);

        let returnData = [];
        productData.forEach(data => {
            returnData.push({
                path: data.product_img,
                name: data.product_name,
                price: data.product_price,
                id: data.product_id,
                remark: data.product_remark,
                quatity: data.product_quatity,
                size: data.product_size
            });
        });

        return {
            product_data: returnData
        };
    } catch (err) {
        throw new Error(err);
    }
};
// 取得會員資料
exports.memberRule = async(postData, session) => {
    try {
        let param = {
            user_email: postData.user_email,
            user_password: md5(postData.user_password)
        }
        let memberData = await mongoAgent.Member.findOne(param) || {};
        memberData = tools.mongoDocToObject(memberData);

        return {
            member_data: memberData
        };

    } catch (err) {
        throw new Error(err);
    }
};
// 取得購物車資料
exports.cartRule = async(postData, session) => {
    try {
        let member = session.member;
        let cartList = [];
        let memberData = {};
        if (member != null) {
            let findData = {
                user_name: member.user_name,
                user_password: member.user_password,
                user_email: member.user_email,
            }
            memberData = await mongoAgent.Member.findOne(findData);
            memberData = tools.mongoDocToObject(memberData);
            let orderList = memberData.order || [];
            cartList = orderList.filter(data => {
                return data.is_checkout === false;
            });
        }
        return {
            cart_data: cartList,
            member_data: memberData
        }
    } catch (err) {
        throw new Error(err);
    }
};

// 新增會員資料
exports.addMemberRule = async(postData, session) => {
    try {
        if (postData.user_password !== postData.confirm_password) {
            throw "確認密碼與密碼不同請確認"
        }
        let saveParam = {
            user_name: postData.user_name,
            user_password: md5(postData.user_password),
            user_email: postData.user_email,
            is_first: true,
            user_auth: 'B',
            order: []
        }
        let queryParam = {
            user_name: postData.user_name,
            user_password: md5(postData.user_password),
            user_email: postData.user_email
        }
        let memberData = await mongoAgent.Member.findOne(queryParam);
        if (memberData != null) {
            throw "帳號已重複"
        }
        await mongoAgent.Member(saveParam).save();
        memberData = await mongoAgent.Member.findOne(queryParam);
        memberData = tools.mongoDocToObject(memberData);

        return {
            member_data: memberData
        };

    } catch (err) {
        throw new Error(err);
    }
};
// 新增商品資料
exports.addProductRule = async(postData, session) => {
    try {
        let imgData = postData.path;
        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, "base64");
        let imgName = postData.img_name || "image.png";
        let saveName = path.resolve(__dirname, "../public/img/", imgName);
        fs.writeFileSync(saveName, dataBuffer, "base64");
        let productId = moment().format("YYYYMMDDHHmmss").toString();
        let queryParam = {
            product_id: productId
        };
        let saveParam = {
            "product_size": postData.size,
            "launched_date": moment(postData.launched_date).toISOString(),
            "sold_date": moment(postData.sold_date).toISOString(),
            "product_name": postData.name,
            "product_type": postData.type,
            "product_price": Number(postData.price),
            "product_id": productId,
            "product_quatity": Number(postData.quatity),
            "product_remark": postData.remark,
            "product_img": "img/" + postData.img_name,
        }
        await mongoAgent.Product(saveParam).save();
        let productData = await mongoAgent.Product.findOne(queryParam);
        productData = tools.mongoDocToObject(productData);
        let returnData = {
            path: productData.product_img,
            name: productData.product_name,
            price: productData.product_price,
            id: productData.product_id,
            remark: productData.product_remark,
            quatity: productData.product_quatity,
            size: productData.product_size
        }
        return {
            product_data: returnData
        };

    } catch (err) {
        throw new Error(err);
    }
};
// 刪除商品資料
exports.delProductRule = async(postData, session) => {
    try {
        let member = session.member;
        if (member != null) {
            let queryParam = {
                user_name: member.user_name,
                user_password: member.user_password
            }
            let memberData = await mongoAgent.Member.findOne(queryParam);
            memberData = tools.mongoDocToObject(memberData);
            let order = memberData.order || [];
            order = tools.mongoDocToObject(order);
            let delProduct = postData;
            if (delProduct != null) {
                let proIndex = order.findIndex(data => data.product_id === delProduct.id && !data.is_checkout);
                if (proIndex > -1) {
                    throw "此商品尚未結帳不得刪除";
                } else {
                    await mongoAgent.Product.find({
                        product_id: delProduct.id
                    }).remove();
                }
            }
        }
    } catch (err) {
        throw new Error(err);
    }
};
// 商品放入購物車資料
exports.putToCartRule = async(postData, session) => {
    try {
        let param = postData || {};
        if (Object.keys(param).length > 0) {
            let saveData = {};
            saveData["$push"] = {
                order: param
            };
            let findData = {
                user_name: session.member.user_name,
                user_password: session.member.user_password,
                user_email: session.member.user_email,
            }
            let memberData = await mongoAgent.Member.findOne(findData);
            if (memberData != null) {
                await mongoAgent.Member.updateOne(findData, saveData);
                memberData = await mongoAgent.Member.findOne(findData);
            }
            memberData = tools.mongoDocToObject(memberData);
            return {
                member_data: memberData
            };
        }

    } catch (err) {
        throw new Error(err);
    }
};
// 刪除購物車資料
exports.delCartRule = async(postData, session) => {
    try {
        let member = session.member;
        let cartList = [];
        let newMemberData = {}
        if (member != null) {
            let queryParam = {
                user_name: member.user_name,
                user_password: member.user_password
            };
            let memberData = await mongoAgent.Member.findOne(queryParam);
            if (memberData != null) {
                memberData = tools.mongoDocToObject(memberData);
                let order = memberData.order || [];
                order = tools.mongoDocToObject(order);
                let newOrder = order.filter(data => data.product_id !== postData.product_id);
                memberData.order = newOrder;
                await mongoAgent.Member.updateOne(queryParam, memberData);
                newMemberData = await mongoAgent.Member.findOne(queryParam);
                newMemberData = tools.mongoDocToObject(newMemberData);
                let orderList = newMemberData != null ? newMemberData.order : [];
                cartList = orderList.filter(data => !data.is_checkout);
            }
        }
        return {
            member_data: newMemberData,
            cart_data: cartList
        }
    } catch (err) {
        throw new Error(err);
    }
};
// 結帳
exports.doCheckoutRule = async(postData, session) => {
    try {
        let cartData = postData;
        let member = session.member;
        let memberData = {};
        if (member != null) {
            let queryParam = {
                user_name: member.user_name,
                user_password: member.user_password
            };
            let newOrderList = [];
            memberData = await mongoAgent.Member.findOne(queryParam);
            cartData.forEach((cart, index) => {
                let newOrder = JSON.parse(JSON.stringify(cart));
                let param = {
                    is_checkout: true,
                    order_no: moment().format("YYYYMMDDHHmmss").toString() + index.toString(),
                    order_date: moment().toISOString(),
                    payment_state: "尚未付款",
                    order_status: "已訂購",
                    order_remark: cart.remark
                }
                newOrder = {
                    ...newOrder,
                    ...param
                };
                newOrderList.push(newOrder);
            });
            let saveData = {};
            saveData["$set"] = {
                order: newOrderList
            };
            await mongoAgent.Member.updateOne(queryParam, saveData);
            let newMemberData = await mongoAgent.Member.findOne(queryParam);
            if (newMemberData != null) {
                newMemberData = tools.mongoDocToObject(newMemberData);
                let orderList = newMemberData.order;
                orderList = tools.mongoDocToObject(orderList);
                cartData = orderList.filter(data => !data.is_checkout);
                member = newMemberData;
            }
        }
        return {
            member_data: memberData,
            cart_data: cartData
        }
    } catch (err) {
        throw new Error(err);
    }
};

function splitWinningNumber(number, numberOfDigital) {
    return number.toString().substring(numberOfDigital, 8);
}