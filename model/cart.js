
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const schema = new Schema({

    product_id: { type: Schema.Types.ObjectId, refPath: "product", index: true }, //sub category id like pj /boxer
    user_id: { type: Schema.Types.ObjectId, refPath: "user", index: true }, //user  id  which provide user detail and address of user
    tags: { type: Schema.Types.ObjectId, refPath: "tag", index: true },

    coupan_id: { type: Schema.Types.ObjectId, refPath: "coupan", required: false },

    gift_wrap: { type: Boolean, default: false }, // If gift wrap is true then 90 is more added.
    free_shipping: { type: Boolean, default: false }, // If free shipping is  false then 150 is more adding to total amount 
    cash_free: { type: Boolean, default: false }, // If cash_free  is false then 150 is more adding to total amount

    selected_size: { type: String,required: false}, // user can select size
    char_size: { type: String,required: false}, // chart image .


    custome: { type: Boolean, default: false },// IF user want to add some custome print then extra charges will be applicable
    custome_description: { type: String, required: false },// print description // ?

    blocked_by: { type: Schema.Types.ObjectId, refPath: "admin" },
    deleted_by: { type: Schema.Types.ObjectId, refPath: "admin" },
    added_by: { type: Schema.Types.ObjectId, refPath: "admin" },

}, { timestamps: true });

module.exports = mongoose.model('Cart', schema);
