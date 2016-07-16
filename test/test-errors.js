var assert = require('chai').assert;
var OpenBazaarAPI = require('../lib/errors');
var debug = require('debug')('insane-openbazaar-api');



describe('Custom Errors', function() {
  describe('AuthorizationError', function() {
    it('should be an instance of Error', function() {
      var err = new OpenBazaarAPI.AuthorizationError("you are not the guy");
      assert.isString(err.message);
      assert.instanceOf(err, OpenBazaarAPI.AuthorizationError);
      assert.instanceOf(err, Error);
    });
  });
});
