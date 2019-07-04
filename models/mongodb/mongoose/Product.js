const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    launched_date: {
        type: Date,
        required: true
    },
    sold_date: {
        type: Date
    },
    product_name: {
        type: String,
        trim: true,
        required: true
    },
    product_type: {
        type: String,
        trim: true
    },
    product_price: {
        type: Number,
        trim: true,
        required: true
    },
    product_id: {
        type: String,
        trim: true,
        required: true
    },
    product_quatity: {
        type: Number,
        trim: true,
        required: true
    },
    product_size: {
        type: Array,
        trim: true
    },
    product_remark: {
        type: String
    },
    product_img: {
        type: String
    }
}, {
    collection: "Product"
});

ProductSchema.index({ product_id: 1, product_name: 1 });

mongoose.model("Product", ProductSchema);