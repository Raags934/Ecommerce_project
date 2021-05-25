`use strict`;

const { category, sub_category, admin, detailed_sub_category, product, product_inventary, user, notification, reading } = require("../model");
const responseMessage = require("../utils/responseMessage");
const { tokenGenerator, decryptPassword, sendEmail, encryptPassword, sendMultiNotification } = require("../utils/commonFunction");
const { Role, SecretKey, ResponseStatusCode, MailContent, Status, NotificationType, PublishedType } = require("../utils/constant");
const moment = require('moment');
const mongoose = require('mongoose');
const ExcelJs = require('exceljs');
const excelToJson = require('convert-excel-to-json');



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

out._change_password = async (userData, body) => {

    if (!await decryptPassword(body.old_password, userData.password)) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.WrongOldPassword };
    }
    else if (await decryptPassword(body.new_password, userData.password)) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.SamePassword };
    }
    else {
        let password = await encryptPassword(body.new_password);
        await admin.findOneAndUpdate({ _id: userData._id }, { password: password });
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

            if (!_admin) {
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
    await admin.findOneAndUpdate(criteria, (dataToUpdate)).lean(true);

    return { status: ResponseStatusCode.SUCCESS, message: responseMessage.AdminSuccessfullyLogout }
};



/**
 * admin add category .
 */

out._add_category = async (userData, body) => {
    let criteria = { category_name: new RegExp('^' + body.category_name, 'i') };
    if (body.id) criteria._id = { $ne: body.id };

    let _category_details = await category.findOne(criteria).lean(true);
    if (_category_details) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.CategoryYouAreTryingToAddIsAlreadyExist }
    }

    if (!body.id) {
        body.added_by = userData._id;
        await category(body).save();
    }
    else await category.findOneAndUpdate({ _id: body.id }, body, { new: true }).lean(true);

    return { status: ResponseStatusCode.SUCCESS, message: body.id ? responseMessage.CategoryUpdatedSuccessfully : responseMessage.CategoryAddedSuccessfully }
};



out._add_sub_category = async (userData, body) => {
    let criteria = { sub_category_name: new RegExp('^' + body.sub_category_name, 'i') };
    if (body.id) criteria._id = { $ne: body.id };

    let _category_details = await sub_category.findOne(criteria).lean(true);
    if (_category_details) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.CategoryYouAreTryingToAddIsAlreadyExist }
    }

    if (!body.id) {
        body.added_by = userData._id;
        await sub_category(body).save();
    }
    else await sub_category.findOneAndUpdate({ _id: body.id }, body, { new: true }).lean(true);

    return { status: ResponseStatusCode.SUCCESS, message: body.id ? responseMessage.CategoryUpdatedSuccessfully : responseMessage.CategoryAddedSuccessfully }
};




out._add_detailed_sub_category = async (userData, body) => {
    let criteria = { detailed_sub_category_name: new RegExp('^' + body.detailed_sub_category_name, 'i'), sub_category_id: body.sub_category_id };
    if (body.id) criteria._id = { $ne: body.id };

    let _category_details = await detailed_sub_category.findOne(criteria).lean(true);
    if (_category_details) {
        throw { status: ResponseStatusCode.BADREQUEST, message: responseMessage.CategoryYouAreTryingToAddIsAlreadyExist }
    }

    if (!body.id) {
        body.added_by = userData._id;
        await detailed_sub_category(body).save();
    }
    else await detailed_sub_category.findOneAndUpdate({ _id: body.id }, body, { new: true }).lean(true);

    return { status: ResponseStatusCode.SUCCESS, message: body.id ? responseMessage.CategoryUpdatedSuccessfully : responseMessage.CategoryAddedSuccessfully }
};

/**
 * admin list all category .
 */

out._list_category = async (body) => {
    let criteria = { status: { $ne: Status.DELETED } };
    if (body.search) criteria.category_name = new RegExp('^' + body.search, 'i');

    let [data, count] = await Promise.all([
        await category.find(criteria, {}).skip(Number(body.skip || 0)).limit(Number(body.limit || 10)).sort({ _id: -1 }).lean(true),
        await category.countDocuments(criteria)
    ]);

    return { data, count }

};


/**
 *  List all sub  category  by using parent id .
 */

out._list_sub_category = async (body) => {
    let criteria = { status: { $ne: Status.DELETED } };
    if (body.id) criteria.category_id = body.id;

    let _sub_category_detail = await sub_category.find(criteria, { _id: 1 }).lean(true);
    _sub_category_detail = _sub_category_detail.map(i => (i._id))



    let data = await sub_category.aggregate([
        {
            $match: {
                '_id': { $in: _sub_category_detail }
            }
        },
        {
            $lookup:
            {
                from: 'detailedsubcategories',
                localField: "_id",
                foreignField: "sub_category_id",
                as: "result"
            }
        },
        {
            $project:
            {
                sub_category_name: 1,
                "result.detailed_sub_category_name": 1,
                "result._id": 1
            }
        }
    ])

    return { data };
};



/** Add product by admin  */

out._add_edit_product = async (userData, body) => {

    let product_image = []

    product_image.push({ product_image_name: body.product_image_name, product_thumbnail_name: body.product_thumbnail_name })
    body.product_image = product_image
    let postData;

    if (!body.id) {
        body.added_by = userData._id;
        postData = await product(body).save();
    }
    else {
        postData = await product.findOneAndUpdate({ _id: body.id }, body).lean(true);
    }
    return { status: ResponseStatusCode.SUCCESS, message: body.id ? responseMessage.PostUpdatedSuccessfully : responseMessage.PostAddedSuccessfully }
};


/** Add product inventary by admin  */

out._add_edit_product_inventary = async (userData, body) => {
    if (!body.id) {
        body.added_by = userData._id;
        let color = body.color.split(',')
        let quantity = body.quantity.split(',')

        for (let i = 0; i < color.length; i++) {
            body.color = color[i];
            body.quantity = quantity[i];
            postData = await product_inventary(body).save();
        }
    }
    else {
        postData = await product_inventary.findOneAndUpdate({ _id: body.id }, body).lean(true);
    }
    return { status: ResponseStatusCode.SUCCESS, message: body.id ? responseMessage.PostUpdatedSuccessfully : responseMessage.PostAddedSuccessfully }
};


/** export data into csv format by admin*/

out._export_user_data = async (userData, body) => {
    // const startDate = moment(body.start_date).startOf('month').toDate();
    // const endDate = moment(body.end_date).endOf('month').toDate();

        const users = await user.find({});
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('My Users');
        worksheet.columns = [
            { header: 'first_name', key: 'first_name', width: 20 },
            { header: 'last_name', key: 'last_name', width: 20 },
            { header: 'email_address', key: 'email_address', width: 40 },
            { header: 'country', key: 'country', width: 20 },
            { header: 'mobile', key: 'mobile', width: 30 },
        ];
        let count = 1;
        users.forEach(user => {
            worksheet.addRow(user);
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        const data = await workbook.xlsx.writeFile('users.xlsx');
        return { status: ResponseStatusCode.SUCCESS, message: responseMessage.CsvFileGeneratedSuccessful }
};


out._import_user_data = async (userData, body) => {
    // const startDate = moment(body.start_date).startOf('month').toDate();
    // const endDate = moment(body.end_date).endOf('month').toDate();
    const excelData = excelToJson({
        sourceFile: 'users.xlsx',
        sheets:[{
            // Excel Sheet Name
            name: 'My Users',
            
            // Header Row -> be skipped and will not be present at our result object.
            header:{
                rows: 1
            },
            
            // Mapping columns to keys
            columnToKey: {
                A: 'first_name',
                B: 'last_name',
                C: 'email_address',
                D: 'country',
                E: 'mobile'
            }
        }]
    });
    
    // -> Log Excel Data to Console
    console.log(excelData);
        return { status: ResponseStatusCode.SUCCESS, message: responseMessage.CsvFileGeneratedSuccessful }
};