const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    product_id: { type: Schema.Types.ObjectId, refPath: "product", index: true }, 
    transaction_id: { type: Schema.Types.ObjectId, refPath: "product", index: true },
}, {timestamps:true}
);

module.exports = mongoose.model('Transaction', schema);
