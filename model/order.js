const mongoose = require('mongoose');
const {Status,PaymentMethod, PaymentStatus, OrderStatus} = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
  cart_id: [{ type: Schema.Types.ObjectId, refPath: "cart", index: true }],// to add 
  address_id: { type: Schema.Types.ObjectId, refPath: "address", index: true },  // default address  and shipping addres of user 
  order_notes: { type: String, required: false },// notes by user this can be optional

  sub_total : {type: Number, required: true},// actuall price value 
  payment_method : {
    type: Number, default: PaymentMethod.CASHFREE, index:true,
    enum: [
      PaymentMethod.CASHFREE,
      PaymentMethod.CASHONDELIVERY
    ]
  },// for cash on delivery payment status is false,


  payment_status : {
    type: Number, default: PaymentStatus.PENDING, index:true,
    enum: [
      PaymentStatus.PENDING,
      PaymentStatus.DONE
    ]
  },

  order_status : {
    type: Number, default: OrderStatus.PENDING, index:true,
    enum: [
      OrderStatus.PENDING,
      OrderStatus.ACCEPTED,
      OrderStatus.RELEASED,
      OrderStatus.DELIVERED,
      OrderStatus.PARTIALREFUND,
      OrderStatus.FULLREFUND,
      OrderStatus.CANCELLEDBYADMIN,
      OrderStatus.CANCELLEDBYUSER,
    ]
  },

  Igst : {type: Number, required: true}, 
  total_amount :  {type: Number, required: true},

  blocked_by: { type: Schema.Types.ObjectId, refPath: "admin", sparse: true },
  added_by: { type: Schema.Types.ObjectId, refPath: "admin", sparse: true },
  status: {
    type: Number, default: Status.ENABLE, index:true,
    enum: [
      Status.DISABLE,
      Status.DELETED,
      Status.ENABLE
    ]
  },  
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Order', schema);
