`use strict`;

module.exports = {
    Server: {
        PROJECT_NAME: process.env.PROJECT_NAME || "Ecommerce"
    },
    ResponseStatusCode: {
        SUCCESS: 200,
        NOTFOUND: 404,
        UNAUTHORIZED: 401,
        BADREQUEST: 400,
        USERALREADYEXIST: 402,
        INVALIDTOKEN: 403,
    },

    PasswordEncryption: {
        SALT: 11,
    },

    SecretKey: {
        JWT_SECRET_KEY_USER: "supersecret",
        JWT_SECRET_KEY_ADMIN: "superadmin"
    },

    Role: {
        ADMIN: 'Admin',
        USER: 'User',
    },
    Status: {
        DISABLE: 0,
        ENABLE: 1,
        DELETED: 2
    },
    PaymentMethod: {
        CASHFREE: 0,
        CASHONDELIVERY: 1,
    },
    PaymentStatus: {
        PENDING: 0,
        DONE: 1,
    },
    OrderStatus: {
        PENDING: 0,
        ACCEPTED: 1,
        RELEASED: 2,
        DELIVERED: 3,
        PARTIALREFUND: 4,
        FULLREFUND: 5,
        CANCELLEDBYADMIN: 5,
        CANCELLEDBYUSER: 5,
    },
    RefundStatus: {
        INPROGRESS: 0,
        DONE: 1,
    },
    Size: {
        SMALL: 0,
        MEDIAM: 1,
        LARGE: 2,
        XTRA_LARGE: 3
    },
    NotificationType: {
        NEW_POST: 1,
    },

    Type: {
        GOOGLE: 1,
        FACEBOOK: 2,
    },

    DefaultAdminDetail: {
        FIRST_NAME: 'Super',
        LAST_NAME: 'Admin',
        EMAIL: 'admin@gmail.com',
        PASSWORD: 'admin@123',
        DEFAULT_SUPER_ADMIN: 'true'
    },
    Mailer: {
        service: 'gmail',
        auth: {
            user: 'sahil.codebrew@gmail.com',
            pass: 'Raags#@786'
        }
    },

    MailContent: {
        otpTemplate : "Your Koaala Password Reset Link is",
        subject: "Password Reset Request for Koaala",
        otpSubject: 'Koaala Password Reset Link',
        welcomeSubject: 'Welcome to Koaala',
    },

};
