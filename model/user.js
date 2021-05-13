const mongoose = require('mongoose');
const { Status } = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
  first_name: { type: String, sparse: true },
  last_name: { type: String, sparse: true },
  email_address: { type: String, trim: true, index: true },
  password: { type: String },
  otp: { type: String, default: '', sparse: true },
  reset_password_link: { type: String, default: '', sparse: true },
  notification_byAdmin :  { type: Boolean, default: true },//during registration user can enable and disable about the notification of onlgoing product and permotion

  /*************  Default billing address of user  */
  country: { type: String, required: false, index: true },
  mobile: { type: Number, required: false, index: true },
  access_token: { type: String, default: '', index: true },



  facebook_id: { type: String, default: '', sparse: true }, //for linkdin
  google_id: { type: String, default: '', sparse: true }, // for google
  // apple_id: { type: String, default: '', sparse: true }, // for google

  login_type: { type: String, default: 0 },// /** 0 ==> internal app , 1 ===>> google , 2 ===>> linkedin , 3 - apple */

  last_login: { type: Date, default: '', },
  device_token: { type: String, default: '' },

  status: {
    type: Number, default: Status.ENABLE, index: true,// to block or delete customer
    enum:
      [
        Status.DISABLE,
        Status.ENABLE,
        Status.DELETED
      ]
  },
  blocked_by: { type: Schema.Types.ObjectId, refPath: "admin" },
  deleted_by: { type: Schema.Types.ObjectId, refPath: "admin" },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', schema);
