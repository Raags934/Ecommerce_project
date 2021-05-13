const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  state: { type: String, required: true, index: true },//state name
  tax_amount: { type: String, required: true},// tax amount on the basis state(sgst)

  added_by: { type: Schema.Types.ObjectId, refPath: "admin", sparse: true },
},
  {
    timestamps: true
  });

module.exports = mongoose.model('StateTax', schema);
