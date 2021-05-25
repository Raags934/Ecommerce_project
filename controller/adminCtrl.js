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



/**
 * Add category by admin
 */
 out.addEditCategory = async (body) => {
    console.log(body.headers);
    await joiValidator.validator(schema._add_edit_category, body.requestbody);
    let _r = await adminService._add_category(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};


/**
 * Add sub category by admin
 */
 out.addEditSubCategory = async (body) => {
    console.log(body.headers);
    await joiValidator.validator(schema._add_edit_sub_category, body.requestbody);
    let _r = await adminService._add_sub_category(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};

out.addEditDetailedSubCategory = async (body) => {
    console.log(body.headers);
    await joiValidator.validator(schema._add_edit_detailed_sub_category, body.requestbody);
    let _r = await adminService._add_detailed_sub_category(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};


/**
 * list category by admin
 */
 out.listCategory = async (body) => {
    delete body.headers;
    await joiValidator.validator(schema._list_schema,  body.requestbody);
    let _r = await adminService._list_category( body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};


out.listAllSubCategory = async (body) => {
    delete body.headers;
    await joiValidator.validator(schema._list_all_schema, body.requestbody);
    let _r = await adminService._list_sub_category(body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};



/**
 * Add edit product by admin
 */
 out.addEditProduct = async (body) => {
    await joiValidator.validator(schema._add_edit_product, body.requestbody);
    let _r = await adminService._add_edit_product(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};


/**
 * Add edit product inventary by admin
 */
 out.addEditProductInventary = async (body) => {
    await joiValidator.validator(schema._add_edit_product_inventary, body.requestbody);
    let _r = await adminService._add_edit_product_inventary(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};


/**
 * Add edit product inventary by admin
 */
 out.exportUserDataToCSV = async (body) => {
    await joiValidator.validator(schema._export_user_data, body.requestbody);
    let _r = await adminService._export_user_data(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};


/**
 * Add edit product inventary by admin
 */
 out.importUserDataFromCSV = async (body) => {
    await joiValidator.validator(schema._import_user_data, body.requestbody);
    let _r = await adminService._import_user_data(body.headers, body.requestbody);
    return {status: ResponseStatusCode.SUCCESS, data: _r};
};