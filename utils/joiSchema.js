`use strict`;

const Joi = require("joi");
class JoiSchema {

    /** User registration */
    get _user_register() {
        return Joi.object().keys({
            email_address: Joi.string().trim().email().required().lowercase(),
            password: Joi.string().required(),
            device_token: Joi.string()
        });
    }

    /** user name and passoward enter by user and send otp to register email*/
    get _user_validate_otp() {
        return Joi.object().keys({
            email_address: Joi.string().trim().email().required(),
            password: Joi.string().required(),
        })
    }


    /** User login with otp which is send on email */
    get _user_login_with_otp() {
        return Joi.object().keys({
            email_address: Joi.string().trim().email().required().lowercase(),
            otp: Joi.string().required(),
            device_token: Joi.string()

        })
    }



    /**  Social login */
    get _social_login() {
        return Joi.object().keys({
            first_name: Joi.string().trim(),
            last_name: Joi.string().trim(),
            uniqueId: Joi.string().required(),
            email_address: Joi.string().trim().email().lowercase(),
            type: Joi.number().required(),
            device_token: Joi.string()
        });
    }


    /** Forgot Password */
    get _forgot_password() {
        return Joi.object().keys({
            email: Joi.string().trim().email().required().lowercase(),
        });
    }



    /** After forget set new password */
    get _new_password() {
        return Joi.object().keys({
            email: Joi.string().trim().email().required().lowercase(),
            new_password: Joi.string().required(),
            confirm_password: Joi.string().required(),
        });
    }



    /** User change password  */
    get user_change_password() {
        return Joi.object().keys({
            current_password: Joi.string().required(),
            new_password: Joi.string().required(),
            confirm_password: Joi.string().required(),
        });
    }



    /** List product  */
    get _list_post() {
        return Joi.object().keys({
            search: Joi.string().trim(),
            _id: Joi.string(),
        });
    }














/************ admin *****End **********api*************************** */

    get _login_admin() {
        return Joi.object().keys({
            email: Joi.string().trim().email().required().lowercase(),
            password: Joi.string().min(3).required()
        });
    }


    get _add_edit_admin() {
        return Joi.object().keys({
            id: Joi.string().description('for edit only'),

            first_name: Joi.string(),
            last_name: Joi.string(),
            email: Joi.string().trim().email().lowercase(),
            super_admin: Joi.boolean(),
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
            confirm_password: Joi.string().required(),
        });
    }


    get _add_edit_category() {
        return Joi.object().keys({
            id: Joi.string().description('only for edit case'),
            category_name: Joi.string().trim().required(),
        });
    }

    get _add_edit_sub_category() {
        return Joi.object().keys({
            id: Joi.string().description('only for edit case'),
            category_id: Joi.string().required(),
            sub_category_name: Joi.string().trim().required(),
        });
    }

    get _add_edit_detailed_sub_category() {
        return Joi.object().keys({
            id: Joi.string().description('only for edit case'),
            category_id: Joi.string().required(),
            sub_category_id: Joi.string().required(),
            detailed_sub_category_name: Joi.string().trim().required(),
        });
    }


    get _list_schema() {
        return Joi.object().keys({
            id: Joi.string(),
            search : Joi.string().trim(),
        });
    }



    get _list_all_schema() {
        return Joi.object().keys({
            id: Joi.string(),
        });
    }




    get _add_edit_product() {
        return Joi.object().keys({
            id: Joi.string().description('For edit only').trim(),

            category_id: Joi.string().trim(),
            sub_category_id: Joi.string().trim(),
            detailed_sub_category_id: Joi.string().trim(),

            related_product_id: Joi.array(),
            item_name: Joi.string().trim(),
            description_name: Joi.string().trim(),
            price: Joi.number(),
            product_image_name: Joi.string(),
            product_thumbnail_name: Joi.string(),
            refund: Joi.number(),
        });
    }


    get _add_edit_product_inventary() {
        return Joi.object().keys({
            id: Joi.string().description('For edit only').trim(),

            product_id: Joi.string().trim(),
            size: Joi.string(),
            color: Joi.string(),
            quantity: Joi.string(),

        });
    }


    get _export_user_data() {
        return Joi.object().keys({
            start_date: Joi.string(),
            end_date: Joi.string(),
        });
    }


    get _import_user_data() {
        return Joi.object().keys({
            start_date: Joi.string(),
            end_date: Joi.string(),
        });
    }


}
module.exports = new JoiSchema();

