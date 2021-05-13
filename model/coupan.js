const mongoose = require('mongoose');
const {Status} = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
  coupan_code: { type: String, required: true, index: true },//coupan code 
  coupan_amount: { type: String, required: true },// coupan amount 
  status: {
    type: Number, default: Status.ENABLE, index:true,// status is enable until coupan code is not used . when coupan code is used then status is disable
    enum: [
      Status.DISABLE,
      Status.DELETED,
      Status.ENABLE
    ]
  },

  added_by: { type: Schema.Types.ObjectId, refPath: "admin", sparse: true },
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Coupan', schema);
