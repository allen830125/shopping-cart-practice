const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InvoceSchema = new Schema({
    month_type: { type: String, trim: true, required: true },
    number: { type: String, trim: true, required: true },
    date: { type: Date, trim: true, required: true },
    user: { type: String, trim: true }
}, { collection: "Invoce" });

InvoceSchema.index({ month_type: 1, number: 1, date: 1 });

mongoose.model("Invoce", InvoceSchema);