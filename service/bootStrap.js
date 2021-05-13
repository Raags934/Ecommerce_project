`use strict`;

const queries = require('./queries');
const Model = require('../model');
const {DefaultAdminDetail} = require('../utils/constant');
const { encryptPassword } = require("../utils/commonFunction");


let out = {};
module.exports = out;

/**
 * Check default admin details are available or not
 * @returns {Promise<boolean|any>}
 */
out.checkAdminDetail = async () => {
    try {
        let data, criteria = {};
        criteria = {email: DefaultAdminDetail.EMAIL}
        data = await queries.getOneDoc(Model.admin, criteria);

        if (!data) {
            let dataToSave = {
                first_name: DefaultAdminDetail.FIRST_NAME,
                last_name: DefaultAdminDetail.LAST_NAME,
                email: DefaultAdminDetail.EMAIL,
                password: await encryptPassword(DefaultAdminDetail.PASSWORD),
                super_admin: DefaultAdminDetail.DEFAULT_SUPER_ADMIN,
            }
            return await queries.saveData(Model.admin, dataToSave);
        }
        return true;
    } catch(error) {
        throw error;
    }
};
out.checkAdminDetail();
