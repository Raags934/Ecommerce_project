const mongoose = require('mongoose');


const Schema = mongoose.Schema;// pro // quatity managmnt //

const schema = new Schema({
    category_id: { type: Schema.Types.ObjectId, refPath: "category", index: true }, //sub category id like pj /boxer

    sub_category_id: { type: Schema.Types.ObjectId, refPath: "subcategory", index: true }, //sub category id like pj /boxer

    related_product_id: [{ type: Schema.Types.ObjectId, refPath: "product", required: false, index: true }], //product related to other product 

    item_name: { type: String, required: true, index: true },// name of item 
    description_name: { type: String, required: true, index: true },// name of item 

    price: { type: Number, required: true, index: true },

    // product_image :[{ type: String}],//pack of 4 photo is there poin

    product_image: [// array of object 
        {
            image_name: { type: String, default: '' }
        },
        {
            thumbnail: { type: String, default: '' }
        },
    ],

    refund: { type: Number, required: true, index: true },//can be 10 day for all product or it also depend on individual product
    blocked_by: { type: Schema.Types.ObjectId, refPath: "admin" },
    deleted_by: { type: Schema.Types.ObjectId, refPath: "admin" },
    added_by: { type: Schema.Types.ObjectId, refPath: "admin" },

}, { timestamps: true });

module.exports = mongoose.model('Product', schema);