`use strict`;

const Joi = require("joi");
class JoiSchema {

    get _user_register() {
        return Joi.object().keys({
            email_address: Joi.string().trim().email().required().lowercase(),
            password: Joi.string().required(),
            device_token : Joi.string()
        });
    }


    get _user_validate_otp() {
        return Joi.object().keys({
            email_address: Joi.string().trim().email().required(),
            password: Joi.string().required(),
        })
    }



    get _user_login_with_otp() {
        return Joi.object().keys({
            email_address: Joi.string().trim().email().required().lowercase(),
            otp: Joi.string().required(),
            device_token : Joi.string()

        })
    }


    get _social_login() {
        return Joi.object().keys({
            first_name: Joi.string().trim(),
            last_name: Joi.string().trim(),
            uniqueId: Joi.string().required(),
            email_address: Joi.string().trim().email().lowercase(),
            type: Joi.number().required(),
            device_token : Joi.string()
        });
    }

    get _forgot_password() {
        return Joi.object().keys({
            email: Joi.string().trim().email().required().lowercase(),
        });
    }


    get _new_password() {
        return Joi.object().keys({
            email: Joi.string().trim().email().required().lowercase(),
            new_password: Joi.string().required(),
            confirm_password : Joi.string().required(),
        });
    }

    get user_change_password() {
        return Joi.object().keys({
            current_password: Joi.string().required(),
            new_password: Joi.string().required(),
            confirm_password: Joi.string().required(),
        });
    }







    get _login_admin() {
        return Joi.object().keys({
            email: Joi.string().trim().email().required().lowercase(),
            password: Joi.string().min(3).required()
        });
    }


    get _add_edit_admin() {
        return Joi.object().keys({
            id : Joi.string().description('for edit only'),
    
            first_name: Joi.string(),
            last_name: Joi.string(),
            email: Joi.string().trim().email().lowercase(),
            super_admin :Joi.boolean(),
        });
    }

    get _change_password() {
        return Joi.object().keys({
            old_password: Joi.string().required(),
            new_password: Joi.string().required(),
        });
    }


    get _forgot_admin_password() {
        return Joi.object().keys({
            email: Joi.string().trim().email().required().lowercase(),
        });
    }

    get _new_admin_password() {
        return Joi.object().keys({
            _id: Joi.string().required(),
            new_password: Joi.string().required(),
            confirm_password : Joi.string().required(),
        });
    }

}
module.exports = new JoiSchema();

