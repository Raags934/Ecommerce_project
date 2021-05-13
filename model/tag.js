const mongoose = require('mongoose');
const { Status } = require('../utils/constant');

const Schema = mongoose.Schema;

const schema = new Schema({
    tag_name: { type: String, required: true, index: true },
    added_by: { type: Schema.Types.ObjectId, refPath: "admin", required: false,sparse:true },
    blocked_by: { type: Schema.Types.ObjectId, refPath: "admin", required: false, sparse: true },
    status: {
        type: Number, default: Status.ENABLE, index:true,
        enum: [
          Status.DISABLE,
          Status.DELETED,
          Status.ENABLE]
      },
}, {timestamps:true}
);

module.exports = mongoose.model('Tag', schema);
