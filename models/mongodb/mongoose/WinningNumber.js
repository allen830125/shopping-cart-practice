const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WinningNumberSchema = new Schema({
    month_type: {
        type: String,
        trim: true,
        required: true
    },
    number: {
        type: String,
        trim: true,
        required: true
    },
    amount: {
        type: Number,
        require: true
    },
    wining_type: {
        type: Number,
        require: true
    }
}, {
    collection: "WinningNumber"
});

WinningNumberSchema.index({
    month_type: 1,
    number: 1
});

mongoose.model("WinningNumber", WinningNumberSchema);