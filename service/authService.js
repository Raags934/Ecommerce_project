`use strict`;

const Jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { user, admin } = require("../model");
const { ResponseStatusCode, SecretKey, Role,Status } = require('../utils/constant');
const { Unauthorized } = require('../utils/responseMessage')

/**
 * verifyToken is used to verify token
 */
const verifyToken = async function (req, res, next) {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.replace("Bearer ", "");
        if (token !== 'GUEST') {
            Jwt.verify(token, SecretKey.JWT_SECRET_KEY_USER, async (error, payload) => {
                if (error) {
                    return res.status(ResponseStatusCode.INVALIDTOKEN)
                        .send(Unauthorized);
                }
                let data  = await checkScope(payload);
                if(!data){
                    res.status(ResponseStatusCode.UNAUTHORIZED);
                    return res.send({status: ResponseStatusCode.UNAUTHORIZED, message:Unauthorized});
                }
                /** To carrier */
                req.body = {headers : data , requestbody: req.body};
                next();
            });
        } else {
            req.body = {headers : {} , requestbody: req.body};
            next();
        }
        /** Here token is verify with secret key */
    }
    else {
        res.status(ResponseStatusCode.UNAUTHORIZED);
        return res.send(Unauthorized);
    }
};

const checkScope = async function (payload) {
    let _user;
    try {
        let criteria = {_id : mongoose.Types.ObjectId(payload._id), status: {$eq : Status.ENABLE}};
        if (Role.ADMIN === payload.scope) {
            _user = await admin.findOne(criteria).lean(true);
        }
        else if (Role.USER === payload.scope) {
            _user = await user.findOne(criteria);
        }

        if (!_user) {
           return null
        }else{
            return _user;
        }
    }
    catch (e) {
        throw e
    }
}



const verifySuperAdminToken = async function (req, res, next) {

    const authorization = req.headers.authorization;

    if (authorization) {
        const token = authorization.replace("Bearer ", "");
            Jwt.verify(token, SecretKey.JWT_SECRET_KEY_ADMIN, async (error, payload) => {
                if (error) {
                    return res.status(ResponseStatusCode.INVALIDTOKEN)
                        .send(Unauthorized);
                }
                else {
                    /** To carrie */
                    payload = await checkScope(payload);
                    if(!payload){
                        res.status(ResponseStatusCode.UNAUTHORIZED);
                        return res.send({status: ResponseStatusCode.UNAUTHORIZED, message:Unauthorized});
                    }
                    req.body = {headers : payload , requestbody : req.body};
                    next();
                }
            });
        /** Here token is verify with secret key */
    }
    else {
        console.log('in else-------');

        res.status(ResponseStatusCode.BADREQUEST);
        return res.send(Unauthorized);
    }
};


module.exports = {
    verifyToken: verifyToken,
    verifySuperAdminToken: verifySuperAdminToken
};
