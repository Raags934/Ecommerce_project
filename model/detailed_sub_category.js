const mongoose = require('mongoose');
const {Status} = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
  category_id: { type: Schema.Types.ObjectId, refPath: "category", index: true },
  sub_category_id: { type: Schema.Types.ObjectId, refPath: "sub_category", index: true },
  detailed_sub_category_name :{ type: String, required: true, index: true },
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

module.exports = mongoose.model('DetailedSubCategory', schema);
