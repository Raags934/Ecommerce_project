'use strict'

const {convertErrorIntoReadableForm} = require('../utils/commonFunction')
const { ResponseStatusCode } = require('../utils/constant');


const out = {};
module.exports = out;

/** To Handle Joi Validation */
out.validator = async (schema, body) => {
    try {
        await schema.validate(body);
    } catch (err) {
        let error = await convertErrorIntoReadableForm(err);
        throw  {status : ResponseStatusCode.BADREQUEST,message : error.message}
    }
};