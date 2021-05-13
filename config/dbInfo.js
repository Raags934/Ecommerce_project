"use strict"
/****** Database configuration ******/


switch (process.env.NODE_ENV) {
    case 'local':{
        exports.Server_Config = {
            //PORT : 3000,
            PORT : 4000,
            Url: "mongodb://localhost/Ecommerce"
        };
        break;
    }
}











