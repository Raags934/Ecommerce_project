const mongoose = require('mongoose');
const {NotificationType,Status} = require('../utils/constant');
const Schema = mongoose.Schema;


const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, refPath: "user", index: true },
    post_id: { type: Schema.Types.ObjectId, refPath: "post", index: true },
    type: { type: Number, default: NotificationType.NEW_POST,
        enum: [
            NotificationType.NEW_POST,
        ]
    },
    is_read: {type:Boolean,default: false},
    status: {
        type: Number, default: Status.ENABLE, index:true,
        enum: [
            Status.DISABLE,
            Status.DELETED,
            Status.ENABLE]
    },
}, {timestamps: true});

module.exports = mongoose.model('Notification', schema);
