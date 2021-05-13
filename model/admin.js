const mongoose = require('mongoose');
const {Status} = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
  first_name: { type: String, required: true, index: true },
  last_name: { type: String, required: true, index: true },
  email: { type: String, trim: true, required: true, index: true },
  password: { type: String, required: true, index: true },
  role: [Array],// to handle admin role
  super_admin: { type: Boolean, default: false },
  access_token: { type: String, default: '', index: true },
  status: {
    type: Number, default: Status.ENABLE,index:true,
    enum: [
      Status.DISABLE,
      Status.DELETED,
      Status.ENABLE
    ]
  },
}, {timestamps: true}
);

module.exports = mongoose.model('Admin', schema);
