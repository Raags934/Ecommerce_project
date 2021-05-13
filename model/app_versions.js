
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    latest_IOS_version : {type: Number, required:true},
    latest_android_version : {type: Number, required:true},
    critical_android_version : {type: Number, required:true},
    critical_IOS_version : {type: Number, required:true},
    timeStamp: {type: Date, default: Date.now}
});


module.exports = mongoose.model('AppVersions', schema);
