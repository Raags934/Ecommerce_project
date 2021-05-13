const mongoose = require('mongoose');
const {Status} = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
  category_name: { type: String, required: true, index: true },
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

module.exports = mongoose.model('Category', schema);
