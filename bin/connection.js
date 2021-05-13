"use strict";
const mongoose = require('mongoose');

// Configuring the database
const dbConfig = require('../config/dbInfo');

// Connecting to the database
module.exports = async () => {
    try {
        let options = {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(dbConfig.Server_Config.Url, options);
        console.log("Mongo Connected!")
    }catch (error) {
        console.log("ERRR!");

        console.log(error);
    }
};
