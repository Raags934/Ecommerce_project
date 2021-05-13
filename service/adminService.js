`use strict`;

const { category, author, admin, tag, post, user, admin_defaults, notification, reading } = require("../model");
const responseMessage = require("../utils/responseMessage");
const { tokenGenerator, decryptPassword, sendEmail, encryptPassword, sendMultiNotification } = require("../utils/commonFunction");
const { Role, SecretKey, ResponseStatusCode, MailContent, Status, NotificationType, PublishedType } = require("../utils/constant");
const moment = require('moment');
const mongoose = require('mongoose');
const _ = require('lodash');


const out = {};
module.exports = out;


/**
 * Login admin
 */

out._login_admin = async (body) => {

    let role, secretKey, token;
    let criteria = { email: body.email };

    let _admin = await admin.findOne(criteria).lean(true);
    if (!_admin) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.EmailDoesNotExist }
    }
    else if (_admin && _admin.status === Status.DISABLE) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.AccountBlocked }
    }
    else {
        /**Here we convert the  */
        let checkpassword = await decryptPassword(body.password, _admin.password);

        /**Here compareSync return true or false */
        if (!checkpassword)
            throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.IncorrectPassword };
        else {
            role = Role.ADMIN;
            secretKey = SecretKey.JWT_SECRET_KEY_ADMIN;
            token = await tokenGenerator(role, _admin['_id'], secretKey);
            _admin = await admin.findOneAndUpdate(criteria, { access_token: token }, { new: true }).lean(true);
            const mutatedData = (_u) => {
                return {
                    _id: _u._id,
                    access_token: _u.access_token,
                    first_name: _u.first_name,
                    last_name: _u.last_name,
                    email: _u.email
                }
            };
            return mutatedData(_admin);
        }
    }
};


/**
 * Add edit sub admin
 */

out._add_edit_admin = async (userData, body) => {

    let criteria = { email: body.email, status: { $in: [Status.DISABLE, Status.ENABLE] } };

    if (body.id) criteria._id = { $ne: body.id };

    let _admin_detail = await admin.findOne(criteria).lean(true);

    if (_admin_detail) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.AdminAlreadyExist }
    }

    if (!body.id) {
        body.added_by = userData._id;
        body.password = await encryptPassword('123456');
        await admin(body).save();
    }
    else {
        await admin.findOneAndUpdate({ _id: body.id }, body, { new: true });
    }

    return { status: ResponseStatusCode.SUCCESS, message: body.id ? responseMessage.AdminUpdatedSuccessfully : responseMessage.AdminAddedSuccessfully }
};


/** change password of admin */

out._change_password = async (userData, body)=>{

    if(!await decryptPassword(body.old_password, userData.password)){
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.WrongOldPassword};
    }
    else if (await decryptPassword(body.new_password, userData.password)){
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.SamePassword };
    }
    else {
        let  password  = await encryptPassword(body.new_password);
        await admin.findOneAndUpdate({_id:userData._id}, {password : password}) ;
        return { status: ResponseStatusCode.SUCCESS, message: responseMessage.NewPasswordSuccessfullySet }
    }
};


/** forget admin password */

out._forgot_admin_password = async (body) => {

    let criteria = { email: body.email };

    let _admin = await admin.findOne(criteria).lean(true);

    if (!_admin) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.EmailYouEnterIsNotRegister };
    }
     sendEmail(body.email, MailContent.subject, 'link or Otp');
    //  sendEmail(body.email, MailContent.subject, MailContent.adminForgotEmailTemplate + _admin._id);


    _admin = await admin.findOneAndUpdate(criteria, (body));
    if (_admin) {
        return { status: ResponseStatusCode.SUCCESS, message: responseMessage.EmailIsSuccessfullySendOnEmail }
    }
};


/** set new password */
out._new_admin_password = async (body) => {
    try {
        if (body.new_password !== body.confirm_password) {
            throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.PleaseEnterSamePasswordAsYouEnterInNewPasswordField }
        }
        else if (mongoose.isValidObjectId(body._id)) {
            let criteria = { _id: body._id };
            let _admin = await admin.findOne(criteria).lean(true);

            if(!_admin){
                throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.Unauthorized }
            }

            let previousDate = moment(_admin.updatedAt);
            let current = moment();

            if (current.diff(previousDate, 'minutes') <= 5) {

                let _encryptPassword = await encryptPassword(body.new_password);
                body.password = _encryptPassword;

                _admin = await admin.findOneAndUpdate(criteria, (body), { new: true });
                return { status: ResponseStatusCode.SUCCESS, message: responseMessage.NewPasswordSuccessfullySet }
            } else {
                throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.YourChangePasswordLinkIsExpire }
            }
        }
        else {
            throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.Forbidden }
        }
    }
    catch (e) {
        throw e
    }
};

/** Logout admin */
out._admin_logout = async (body) => {
    let criteria = { _id: body.headers._id };
    let dataToUpdate = { "access_token": "" };
    await admin.findOneAndUpdate(criteria, (dataToUpdate)).lean(true) ;

    return { status: ResponseStatusCode.SUCCESS, message: responseMessage.AdminSuccessfullyLogout }
};


