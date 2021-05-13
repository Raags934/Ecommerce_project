/**
 * logger is implemented to get all log and error info
 */
const {
    createLogger,
    transports,
    format
} = require('winston');
const logger = createLogger({
    transports: [
        /**
         * If we want to store log in file then we use transport.file else transport.console
         */
        new transports.File({
            filename: './logger/info.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.simple())// If we need output in simple then we can use format.simple , 
        }),
        new transports.File({
            filename: './logger/error.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.simple())// If we need output in simple then we can use format.simple , 
        }),
        new transports.File({
            filename: './logger/warn.log',
            level: 'warn',
            format: format.combine(format.timestamp(), format.simple())// If we need output in simple then we can use format.simple , 
        }),
    ]
})

module.exports = logger;