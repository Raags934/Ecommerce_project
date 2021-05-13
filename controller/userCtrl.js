`use strict`;

const { userService, joiValidator } = require('../service');
const { ResponseStatusCode } = require('../utils/constant');
const schema = require('../utils/joiSchema');

const out = {};
module.exports = out;

/**
 * User controller
 */
out.userRegistration = async (body) => {
    await joiValidator.validator(schema._user_register, body);
    let _r = await userService._userRegister(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};


out.userValidateOtp = async (body) => {
    await joiValidator.validator(schema._user_validate_otp, body);
    let _r = await userService._userValidateOtp(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};


/**
 * To handle login activity of user
 */
out.userLoginwithOtp = async (body) => {
    await joiValidator.validator(schema._user_login_with_otp, body);
    let _r = await userService._userLoginWithOtp(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};

/**
 * To Handle Social Login
 */
out.socialGoogleLogin = async (body) => {
    await joiValidator.validator(schema._social_login, body);
    let _r = await userService._socialLogin(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};

/**
 * To Recover password of user.
 */
out.forgotPassword = async (body) => {
    await joiValidator.validator(schema._forgot_password, body);
    let _r = await userService._forgotPassword(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};

/**
 * To validate otp.
 */
out.validateLink = async (body) => {
    await joiValidator.validator(schema._validate_link, body);
    let _r = await userService._validateLink(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};


/**
 * To set new password.
 */
out.setNewPassword = async (body) => {
    await joiValidator.validator(schema._new_password, body);
    let _r = await userService._new_password(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};

/**
 * Logout user.
 */
out.userLogout = async (body) => {
    let _r = await userService._user_logout(body);
    return { status: ResponseStatusCode.SUCCESS, data: _r };
};



/**
 * changePassword by user
 */
 out.userChangePassword = async (body) => {
    await joiValidator.validator(schema.user_change_password, body.requestbody);
    let _r = await userService.user_change_password(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};