`use strict`;

const bcrypt = require('bcrypt');
const Config = require('../config');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const utils = require('./constant');
/** To Handle all common function */

/**To encrypt the user password */
const encryptPassword = async (password) => {
    let encryptedPassword = await bcrypt.hashSync(password.toString(), Config.constant.PasswordEncryption.SALT);
    return encryptedPassword;
}


/** To decrypt the encrypted password */
const decryptPassword = async (currentPassword, dbPassword) => {
    let decryptPassword;
    try {
        decryptPassword = await bcrypt.compareSync(currentPassword, dbPassword);
    } catch (error) {
        throw error
    }
    console.log("checkk the ---- checj te password ",decryptPassword);
    return decryptPassword;
}

/** Token generator */
const tokenGenerator = async (role, _id, SecretKey) => {
    let token = jwt.sign({ scope: role, "_id": _id }, SecretKey);
    return token
}

/** Function to handle  error  */
const convertErrorIntoReadableForm = async (error) => {
    let errorMessage = '';
    if (error.message.indexOf("[") > -1) {
        errorMessage = error.message.substr(error.message.indexOf("["));
    } else {
        errorMessage = error.message;
    }

    errorMessage = errorMessage.replace(/"/g, '');
    errorMessage = errorMessage.replace('[', '');
    errorMessage = errorMessage.replace(']', '');
    error.message = errorMessage;
    return error;
};

let messageLogs = (error, success) => {
    if (error)
        console.log(`\x1b[31m` + error);
    else
        console.log(`\x1b[32m` + success);
};



const sendEmail = async (emailId, sub, text) => {
    try {
        let transporter = nodemailer.createTransport(utils.Mailer);
        let mailOptions = {
            from: 'sahil.codebrew@gmail.com',
            to: emailId,
            subject: sub,
            text : text
            // html : text
        };
        let email = await transporter.sendMail(mailOptions);
        console.log('email---',email);
        return {};
    }
    catch (error) {
        throw error
    }
};


module.exports = {
    encryptPassword: encryptPassword,
    convertErrorIntoReadableForm,
    decryptPassword: decryptPassword,
    tokenGenerator: tokenGenerator,
    sendEmail: sendEmail,
    messageLogs
}
