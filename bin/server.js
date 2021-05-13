`use strict`;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('../config/logger');
const connect = require('./connection');
const {messageLogs} = require('../utils/commonFunction');
const {ServerSuccess} = require('../utils/responseMessage');

const PORT = process.env.PORT;
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use((bodyParser.json()));

app.use(express.static('uploads'));

/** middleware for api's logging with deployment mode */
let apiLooger = (req, res, next)=>{
    messageLogs(null, `api hitted ${req.url} env: ${process.env.NODE_ENV || "local"} body: ${JSON.stringify((req.body || req.query))}`);
    next();
};


/** Used logger middleware for each api call **/
app.use(apiLooger);

require('../routes')(app);


/*******************************
 ****** Connect database *******
 *******************************/
module.exports = () => {
    /**If database connection is succesfully
     *  Then only server is running.
     */
    connect().then(message => {
        logger.info(`${message}`);
        app.listen(process.env.PORT || 3000, function () {
            logger.info(`${ServerSuccess} ${process.env.PORT || PORT}`);

            console.log(`${ServerSuccess} ${process.env.PORT || PORT}`);
        });
    }).catch(error => {
        process.exit(error);
    });
};
