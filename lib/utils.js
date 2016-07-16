module.exports.isAuthError = function isAuthError(body) {
    return /Authorization Error/.test(body);
}


module.exports.JSONparse = function JSONparse(maybeJSON) {
    if (typeof maybeJSON === 'string') {
        try {
            maybeJSON = JSON.parse(maybeJSON);
        } catch (e) {
            return maybeJSON;
        }
    }
    return maybeJSON;
}
