const mongoose = require('mongoose');
const {RefundStatus} = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
  order_id: { type: Schema.Types.ObjectId, refPath: "order", index: true },//order id on which refund is done 
  product_id: { type: Schema.Types.ObjectId, refPath: "product", index: true }, // refund for individual product 
  refund_Status :{
    type: Number, default: RefundStatus.INPROGRESS, index:true,
    enum: [
      RefundStatus.INPROGRESS,
      RefundStatus.DONE,
    ]
  },// coupan amount 
  refund_amount : {type : Number, required : true},

  refund_by: { type: Schema.Types.ObjectId, refPath: "admin", sparse: true },
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Refund', schema);
