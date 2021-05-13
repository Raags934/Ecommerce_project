const mongoose = require('mongoose');

/*** these is optional colletion we can create another collection for inventory or same thing can done in product  */
const Schema = mongoose.Schema;// pro // quatity managmnt //

const schema = new Schema({
    product_id: { type: Schema.Types.ObjectId, refPath: "product", index: true }, //sub category id like pj /boxer

    small: {
        quantity: { type: String, default: 0 },
        color: { type: String, default: '' },
    },

    mediam: {
        quantity: { type: String, default: 0 },
        color: { type: String, default: '' },
    },

    large: {
        quantity: { type: String, default: 0 },
        color: { type: String, default: '' },
    },

    extra_large: {
        quantity: { type: String, default: 0 },
        color: { type: String, default: '' },
    },
    double_x_large: {
        quantity: { type: String, default: 0 },
        color: { type: String, default: '' },
    },
    
    blocked_by: { type: Schema.Types.ObjectId, refPath: "admin" },
    deleted_by: { type: Schema.Types.ObjectId, refPath: "admin" },
    added_by: { type: Schema.Types.ObjectId, refPath: "admin" },

}, { timestamps: true });

module.exports = mongoose.model('ProductEnventry', schema);