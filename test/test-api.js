var assert = require('chai').assert;
var OpenBazaarAPI = require('../index');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

assert.isDefined(process.env.OB_PASSWORD, 'openbazaar password is not defined in environment! OB_PASSWORD');
assert.isDefined(process.env.OB_USERNAME, 'openbazaar username is not defined in environment! OB_USERNAME');

var apiOptions = {
  "password": process.env.OB_PASSWORD,
  "username": process.env.OB_USERNAME,
  "host": process.env.OB_HOST,
  "proto": process.env.OB_PROTO,
  "port": process.env.OB_PORT
};
apiOptions = _(apiOptions).omit(_.isUndefined);

var ob = new OpenBazaarAPI(apiOptions);


describe('api', function() {
  describe('isValidGUID', function() {
    it('should return false for guid of invalid length', function() {
      assert.isFalse(ob.isValidGUID('a06aa22a38f0e62221ab74464c311bd88305'));
    });

    it('should return false for guid that is not a string', function() {
      assert.isFalse(ob.isValidGUID({"a06aa22a38f0e62221ab74464c311bd88305f88c": "a06aa22a38f0e62221ab74464c311bd88305f88c"}));
    });

    it('should return true for a valid guid that is capitalized', function() {
      assert.isTrue(ob.isValidGUID('A06AA22A38F0E62221AB74464C311BD88305F88C'));
    });

    it('should return true for a valid guid that is lowercase', function() {
      assert.isTrue(ob.isValidGUID('a06aa22a38f0e62221ab74464c311bd88305f88c'));
    });
  });





  describe('login', function() {

    it('should log in to the openbazaar server', function(done) {
      ob.login(function(err) {
        assert.isNull(err);
        done();
      });
    });

    it('should create a header.txt file containing cookie', function(done) {
      ob.login(function(err) {
        assert.isNull(err);
        var h = fs.readFileSync(path.join(__dirname, '..', 'headers.txt'), {'encoding': 'utf8'});
        assert.isString(h);
        assert.match(h, /Set-Cookie:/, 'Set-Cookie not found in header file. This can happen if your username/password combo is wrong.');
        done();
      });
    });
  });

  describe('profile', function() {
    it('should bork if receiving no args', function() {
      assert.throws(ob.profile, /no arguments/);
    });

    it('should accept one param, a callback, callback profile as object', function(done) {
      ob.profile(function(err, prof) {
        assert.isNull(err);
        assert.isObject(prof);
        assert.isString(prof.profile.short_description, 'did not see your store description. do you have one set in your openbazaar?');
        //console.log('        '+prof.profile.short_description);
        done();
      });
    });

    it('should accept two params, a GUID and a callback, callback profile as object', function(done) {
      ob.profile('a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, prof) {
        assert.isNull(err);
        assert.isObject(prof);
        assert.match(ob.profile.website, /openbazaar\.org/);
        done();
      })
    });

    it('should bork if receiving an invalid GUID', function(done) {
      ob.profile('asdfasfa44t4fa89398', function(err, prof) {
        assert.match(err, /invalid GUID/);
        done();
      });
    });


  });
});
