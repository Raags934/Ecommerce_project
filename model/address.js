const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, refPath: "user", sparse: true },//coupan code 
  default_address: { 
      first_name : {type: String, required: true},
      last_name : {type: String, required: true},
      country : {type: String, required: true},
      street_address : {type: String, required: true},
      city: {type: String, required: true},
      state :{type: String, required: true},
      postalcode : {type: Number, required: true},
      phone : {type: Number, required: true},
      email_address : {type: Number, required: true},
  },// coupan amount 
  shipping_address:{
    first_name : {type: String, required: false},
    last_name : {type: String, required: false},
    country : {type: String, required: false},
    street_address : {type: String, required: false},
    city: {type: String, required: false},
    state :{type: String, required: false},
    postalcode : {type: Number, required: false},
    phone : {type: Number, required: false},
    email_address : {type: Number, required: false},
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Address', schema);
