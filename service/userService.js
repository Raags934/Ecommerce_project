`use strict`;

const { user, admin_defaults, post, notification, reading, author, category, app_versions } = require("../model");
const responseMessage = require("../utils/responseMessage");
const { encryptPassword, tokenGenerator, decryptPassword, sendEmail, sendSingleNotification } = require("../utils/commonFunction");
const { Role, SecretKey, ResponseStatusCode, Menu_Author, Type, Status, PublishedType, MailContent, NotificationType } = require("../utils/constant");
const moment = require('moment');
const _ = require('lodash');


const out = {};
module.exports = out;

/**
 * User registered
 */
out._userRegister = async (body) => {
    let criteria = { email_address: body.email_address, status: { $ne: Status.DELETED } };
    let _user = await user.findOne(criteria).lean(true);
    if (_user)
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.UserAlreadyExist };

    let _encryptPassword = await encryptPassword(body.password);
    body.password = _encryptPassword;

    _user = await user(body).save();

    if (_user.email_address)
        // sendEmail(body.email_address, MailContent.welcomeSubject, await welcomeEmail());/** add welcome template here */
        sendEmail(body.email_address, MailContent.welcomeSubject, 'Welcome to koaala.co');


    let role = Role.USER;
    let secretKey = SecretKey.JWT_SECRET_KEY_USER;
    let token = await tokenGenerator(role, _user['_id'], secretKey);

    let dataToUpdate = { access_token: token };
    if (body.device_token) dataToUpdate.device_token = body.device_token;

    _user = await user.findOneAndUpdate(criteria, dataToUpdate, { new: true }).lean(true);

    // Data mutated with requred key
    const mutatedData = (_u) => {
        return {
            _id: _u._id,
            access_token: _u.access_token,
            email: _u.email_address
        }
    };

    return { status: ResponseStatusCode.SUCCESS, message: responseMessage.Success, data: mutatedData(_user) };
};




/**
 * Login to appliction with help of register email and password
 */
out._userValidateOtp = async (body) => {
    let checkpassword = false;
    let criteria = { email_address: body.email_address, status: { $in: [Status.ENABLE, Status.DISABLE] } };

    let _user = await user.findOne(criteria).lean(true);
    if (!_user) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.EmailDoesNotExist }
    }
    else if (_user && _user.status === Status.DISABLE) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.AccountBlocked }
    }
    /**Here we convert the  */
    if (_user.password)
        checkpassword = await decryptPassword(body.password, _user.password);

    /**Here compareSync return true or false */
    if (!checkpassword)
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.IncorrectPassword };
    else {
        let otp = '';
        for (let i = 0; i < 4; i++) {
            otp += Math.floor(Math.random() * 10)
        }

        // sendEmail(body.email, MailContent.otpSubject, await forgotEmail({ otp }));
        sendEmail(body.email_address, MailContent.otpSubject, `Your Otp is ${otp}`);

        body.otp = otp;
        body.password = _user.password

        _user = await user.findOneAndUpdate(criteria, (body));
        if (_user) {
            return { status: ResponseStatusCode.SUCCESS, message: responseMessage.EmailIsSuccessfullySendOnEmail }
        }
    }
};


/**
 * Otp validation with help of email
 */

out._userLoginWithOtp = async (body) => {
    let role, secretKey, token;
    let criteria = { email_address: body.email_address };
    let _user = await user.findOne(criteria).lean(true);
    if (_user) {
        if (body.otp === _user.otp) {
            let previousDate = moment(_user.updatedAt);
            let current = moment();

            if (current.diff(previousDate, 'minutes') >= 15) {
                return { status: ResponseStatusCode.BADREQUEST, message: responseMessage.OtpExpired }
            }
            else {
                role = Role.USER; secretKey = SecretKey.JWT_SECRET_KEY_USER;
                token = await tokenGenerator(role, _user['_id'], secretKey);

                let dataToUpdate = { access_token: token , otp : ''};
                if (body.device_token) dataToUpdate.device_token = body.device_token;

                _user = await user.findOneAndUpdate(criteria, dataToUpdate, { new: true }).lean(true);
                const mutatedData = (_u) => {
                    return {
                        _id: _u._id,
                        access_token: _u.access_token,
                        email: _u.email_address
                    }
                }
                return { status: ResponseStatusCode.SUCCESS, message: responseMessage.Success, data: mutatedData(_user) };
            }

        } else {
            throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.OtpYouEnterIsIncorrect }
        }
    } else {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.DataNotFoundWithThisEmail }
    }
};
























// /**
//  * Login to appliction with help of register email and password
//  */
// out._userLogin = async (body) => {
//     let role, secretKey, token; let checkpassword = false;
//     let criteria = { email_address: body.email_address, status: { $in: [Status.ENABLE, Status.DISABLE] } };

//     let _user = await user.findOne(criteria).lean(true);
//     if (!_user) {
//         throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.EmailDoesNotExist }
//     }
//     else if (_user && _user.status === Status.DISABLE) {
//         throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.AccountBlocked }
//     }
//     /**Here we convert the  */
//     if (_user.password)
//         checkpassword = await decryptPassword(body.password, _user.password);

//     /**Here compareSync return true or false */
//     if (!checkpassword)
//         throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.IncorrectPassword };
//     else {
//         role = Role.USER; secretKey = SecretKey.JWT_SECRET_KEY_USER;
//         token = await tokenGenerator(role, _user['_id'], secretKey);

//         let dataToUpdate = { access_token: token };
//         if (body.device_token) dataToUpdate.device_token = body.device_token;

//         _user = await user.findOneAndUpdate(criteria, dataToUpdate, { new: true }).lean(true);
//         const mutatedData = (_u) => {
//             return {
//                 _id: _u._id,
//                 access_token: _u.access_token,
//                 email: _u.email_address
//             }
//         };
//         return { status: ResponseStatusCode.SUCCESS, message: responseMessage.Success, data: mutatedData(_user) };

//     }
// };



out._socialLogin = async (body) => {
    let criteria = { status: { $in: [Status.ENABLE, Status.DISABLE] } };

    if (body.email_address) criteria.email_address = body.email_address;

    if (!body.email_address) {
        if (parseInt(body.type) === Type.GOOGLE) {
            criteria.google_id = body.uniqueId;
            body.google_id = body.uniqueId;

        } else if (parseInt(body.type) === Type.FACEBOOK) {
            criteria.facebook_id = body.uniqueId;
            body.facebook_id = body.uniqueId;
        }
    }
    if (parseInt(body.type) === Type.FACEBOOK && body.uniqueId) {
        body.facebook_id = body.uniqueId
    }

    let role = Role.USER;
    let secretKey = SecretKey.JWT_SECRET_KEY_USER;
    let token;


    let _user = await user.findOne(criteria).lean(true);

    body.login_type = body.type;

    if (_user) {
        /**If user already exist in db */
        token = await tokenGenerator(role, _user['_id'], secretKey);
        body.access_token = token;
        _user = await user.findOneAndUpdate(criteria, (body), { new: true }).lean(true);
    } else {

        _user = await user(body).save();
        token = await tokenGenerator(role, _user['_id'], secretKey);

        let dataToUpdate = { access_token: token };
        if (body.device_token) dataToUpdate.device_token = body.device_token;

        _user = await user.findOneAndUpdate(criteria, dataToUpdate, { new: true }).lean(true);
    }

    const mutatedData = (_u) => {
        return {
            _id: _u._id,
            access_token: _u.access_token,
            first_name: _u.first_name,
            last_name: _u.last_name,
            email: _u.email_address
        }
    };
    return { status: ResponseStatusCode.SUCCESS, message: responseMessage.Success, data: mutatedData(_user) };
};



out._forgotPassword = async (body) => {
    let criteria = { email_address: body.email };

    let _user = await user.findOne(criteria).lean(true);

    if (!_user) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.EmailYouEnterIsNotRegister };
    }

    let resetLink = 'https://www.cricbuzz.com/cricket-news/117370/bcci-face-logistical-conundrum-after-ipl-cancellation'

    sendEmail(body.email, MailContent.otpSubject, resetLink);

    body.reset_password_link = resetLink;

    _user = await user.findOneAndUpdate(criteria, (body));
    if (_user) {
        return { status: ResponseStatusCode.SUCCESS, message: responseMessage.EmailIsSuccessfullySendOnEmail }
    }
};

out._new_password = async (body) => {

    let criteria = { email_address: body.email };
    let _user = await user.findOne(criteria).lean(true);
    if (_user) {
        let previousDate = moment(_user.updatedAt);
        let current = moment();

        if (current.diff(previousDate, 'minutes') >= 15) {
            return { status: ResponseStatusCode.BADREQUEST, message: responseMessage.YourResetPasswordLinkIsExpire }
        }
        else {

            if (_user.password && await decryptPassword(body.new_password, _user.password)) {
                throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.SamePassword };
            }
            else if (body.new_password !== body.confirm_password) {
                throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.PleaseEnterSamePasswordAsYouEnterInNewPasswordField }
            } else {
                body.password = await encryptPassword(body.new_password);
                body.email_address = body.email;
                body.reset_password_link = '';


                _user = await user.findOneAndUpdate(criteria, (body)).lean(true);
                return { status: ResponseStatusCode.SUCCESS, message: responseMessage.NewPasswordSuccessfullySet }
            }
        }

    } else {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.DataNotFoundWithThisEmail }
    }
};


/** Logout user  */
out._user_logout = async (body) => {
    let criteria = { _id: body.headers._id };
    let dataToUpdate = { "access_token": "", device_token : ''};
    _user = await user.findOneAndUpdate(criteria, (dataToUpdate)).lean(true);

    return { status: ResponseStatusCode.SUCCESS, message: responseMessage.UserSuccessfullyLogout }
};



out.user_change_password = async (userData, body)=>{

    if(!await decryptPassword(body.current_password, userData.password)){
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.WrongOldPassword};
    }
    else if (await decryptPassword(body.new_password, userData.password)){
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.SamePassword };
    }
    else if (body.new_password !== body.confirm_password){
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.PasswordNotSame };
    }
    else {
        
        let  password  = await encryptPassword(body.new_password);
        await user.findOneAndUpdate({_id:userData._id}, {password : password}) ;
        return { status: ResponseStatusCode.SUCCESS, message: responseMessage.NewPasswordSuccessfullySet }
    }
};