const mongoose = require('mongoose');
const { RefundStatus } = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
    product_id: { type: Schema.Types.ObjectId, refPath: "product", index: true }, // refund for individual product 
    size: { type: String, required: true },
    color :{ type: String, required: true },
    quantity:  { type: Number, default: 0},

    added_by: { type: Schema.Types.ObjectId, refPath: "admin" },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('ProductInventory', schema);