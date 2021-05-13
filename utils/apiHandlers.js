`use strict`;
const {userCtrl, adminCtrl} = require("../controller");
const {verifyToken} = require("../service/authService");
const {verifySuperAdminToken} = require("../service/authService");

module.exports = [
    /** User routes */
    {method: "post", api: "/api/v1/user_registration", handler: userCtrl.userRegistration},
    
    {method: "post", api: "/api/v1/user_validate_otp", handler: userCtrl.userValidateOtp},
    {method: "post", api: "/api/v1/user_login_with_otp", handler: userCtrl.userLoginwithOtp},

    {method: "post", api: "/api/v1/social_login", handler: userCtrl.socialGoogleLogin},
    {method: "post", api: "/api/v1/user_logout", handler: userCtrl.userLogout, middleware: [verifyToken]},
    {method: "post", api: "/api/v1/user_change_password", handler: userCtrl.userChangePassword, middleware: [verifyToken]},

    {method: "post", api: "/api/v1/forget_password", handler: userCtrl.forgotPassword},
    {method: "post", api: "/api/v1/set_new_password", handler: userCtrl.setNewPassword},





    {method: "post", api: "/api/v1/login_admin", handler: adminCtrl.loginAdmin},
    {method: "post", api: "/api/v1/add_edit_admin", handler: adminCtrl.addEditAdmin, middleware: [verifySuperAdminToken]},

    {method: "post", api: "/api/v1/change_password", handler: adminCtrl.changePassword, middleware: [verifySuperAdminToken]},
    {method: "post", api: "/api/v1/forgot_admin_password", handler: adminCtrl.forgotPassword},
    {method: "post", api: "/api/v1/set_admin_password", handler: adminCtrl.setNewAminPassword},

    {method: "post", api: "/api/v1/logout_admin", handler: adminCtrl.adminLogout, middleware: [verifySuperAdminToken]},




];
