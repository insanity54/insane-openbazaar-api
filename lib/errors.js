var util = require('util');


module.exports.AuthorizationError = function AuthorizationError(message) {
    this.name = "AuthorizationError";
    this.message = (message || "");
}
util.inherits(module.exports.AuthorizationError, Error);
