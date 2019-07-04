const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
    user_name: {
        type: String,
        trim: true,
        required: true
    },
    user_password: {
        type: String,
        trim: true,
        required: true
    },
    user_email: {
        type: String,
        trim: true,
        required: true
    },
    is_first_order: {
        type: Boolean,
        required: true,
        default: false
    },
    user_auth: {
        type: String,
        required: false
    },
    order: [{
        name: {
            type: String,
            trim: true,
            required: true
        },
        img_path: {
            type: String,
            trim: true,
            required: true
        },
        size: {
            type: String,
            trim: true,
            required: true
        },
        quatity: {
            type: Number,
            trim: true,
            required: true,
            default: 0
        },
        remark: {
            type: String,
            trim: true,
            default: ""
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            default: 0
        },
        is_checkout: {
            type: Boolean,
            trim: true,
            required: true,
            default: false
        },
        product_id: {
            type: String,
            trim: true,
            required: true
        },
        order_no: {
            type: String,
            trim: true,
            required: true
        },
        order_date: {
            type: Date,
        },
        payment_state: {
            type: String,
            trim: true
        },
        payment_type: {
            type: String,
            trim: true
        },
        order_status: {
            type: String,
            trim: true
        },
        order_remark: {
            type: String,
            trim: true
        }
    }],
}, {
    collection: "Member"
});

MemberSchema.index({
    user_name: 1,
    user_password: 1,
    user_email: 1
}, {
    unique: true
});

mongoose.model("Member", MemberSchema);