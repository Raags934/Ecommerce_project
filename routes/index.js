`use strict`;
const routes = require("../utils/apiHandlers");
const {messageLogs} = require("../utils/commonFunction");
const {ResponseStatusCode} = require("../utils/constant");
const {APINotExists} = require("../utils/responseMessage");


module.exports = (app) => {
    for(let _r of routes) {
        let middleware = _r.middleware || [];
        if(_r.isFile) {
            app.route(_r.api)[_r.method](...middleware, _r.handler);
        } else {
            app.route(_r.api)[_r.method](...middleware, common(_r.handler));
        }
    }

    app.route("*").all(function nofound(req, res) {
        res.status(ResponseStatusCode.NOTFOUND);

        return res.send(APINotExists)
    })
};

/**
 * Common handlers
 * @param handler
 * @returns {function(...[*]=)}
 */
function common(handler) {
    return async (req, res) => {
        try {
            let body = {
                ...(req.body || {}),
                ...(req.params || {}),
                ...(req.query || {})
            };
            let _d = await handler(body);
            return res.status(_d.status).send(_d.data);
        } catch(error) {
            messageLogs(error.message)

            res.status(error.status);
            // return res.send(error.message);
            return res.send ({ status : error.status , message :error.message})
        }
    }
}
