const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  terms_and_condition: { type: String, required: false},
  privacy_policy :{ type: String, required: false},
  legal_disclaimer :{ type: String, required: false},

  /** to add diffrent kind of service price by admin example giftwrap price  */
  gift_wrap: { type: Number, default: false }, // If gift wrap is true then 90 is more added./
  free_shipping: { type: Number, default: false }, // If free shipping is  false then 150 is more adding to total amount 
  cash_free: { type: Number, default: false }, // If cash_free  is false then 150 is more adding to total amount
  custome: { type: Number, default: false },// IF user want to add some custome print then extra charges will be applicable
}, {
    timestamps: true
  });

module.exports = mongoose.model('AdminDefaults', schema);
