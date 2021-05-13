`use strict`;

const {adminService, joiValidator} = require('../service');
const {ResponseStatusCode} = require('../utils/constant');
const schema = require('../utils/joiSchema');

const out = {};
module.exports = out;


/**
 * Add  edit admin/sub admin by admin
 */
out.addEditAdmin = async (body) => {
    await joiValidator.validator(schema._add_edit_admin, body.requestbody);
    let _r = await adminService._add_edit_admin(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};


/**
 * Forgot password of admin
 */
out.forgotPassword = async (body) => {
    await joiValidator.validator(schema._forgot_admin_password, body);
    let _r = await adminService._forgot_admin_password(body);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};

/**
 * Set new password of admin
 */
out.setNewAminPassword = async (body) => {
    await joiValidator.validator(schema._new_admin_password, body);
    let _r = await adminService._new_admin_password(body);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};

/**
 * Login admin
 */
out.loginAdmin = async (body) => {
    await joiValidator.validator(schema._login_admin, body);
    let _r = await adminService._login_admin(body);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};

/**
 * Logout admin
 */
out.adminLogout = async (body) => {
    let _r = await adminService._admin_logout(body);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};

/**
 * changePassword by admin
 */
 out.changePassword = async (body) => {
    await joiValidator.validator(schema._change_password, body.requestbody);
    let _r = await adminService._change_password(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};
