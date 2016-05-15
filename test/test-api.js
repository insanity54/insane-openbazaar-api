var assert = require('chai').assert;
var OpenBazaarAPI = require('../index');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');


// only run drakov from inside this modules if the environment is TRAVIS-CI.
// I do this because the output of drakov is messy.
// For local development, I much prefer to run drakov in a separate terminal
// example: `drakov -f ./spec.mf -s 3000`
if (process.env.TRAVIS) {
  var drakov = require('drakov');
  var drakovArgs = {
      sourceFiles: path.join(__dirname, '..', 'spec.md'),
      stealthmode: false,
      serverPort: 3000
  };
}

var ob;
var obb;

describe('api', function() {

  if (process.env.TRAVIS) {
    before(function(done) {
      drakov.run(drakovArgs, done);
    });

    after(function(done) {
      drakov.stop(done);
    });
  }


  describe('constructor', function() {
    it('should throw if you put a :// in the proto variable', function() {
      var invalidApiOptions = {
        "password": 'test',
        "username": 'test',
        "proto": "http://",
      };
      assert.throws((function() {new OpenBazaarAPI(invalidApiOptions) }), /please remove the colon slash slash/);
    });

    it('should throw if something other than http or https', function() {
      var invalidApiOptions = {
        "password": 'test',
        "username": 'test',
        "proto": "httr",
      };
      assert.throws((function() {new OpenBazaarAPI(invalidApiOptions) }), /either http or https/);
    });

  });









  describe('controllers', function() {

    beforeEach(function(done) {
      var apiOptions = {
        "password": 'test',
        "username": 'test',
        "port": 3000
      };

      var badOptions = _.extend({}, apiOptions, {
        "host": "example.com"
      });

      ob = new OpenBazaarAPI(apiOptions);
      obb = new OpenBazaarAPI(badOptions);

      // delete header file which contains auth cookie
      try { fs.unlinkSync(path.join(__dirname, '..', 'headers.txt')) }
      catch(e) { assert.equal(e.code, 'ENOENT', 'I cant handle this error') }
      done();
    });

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

    describe('get', function() {
      it('should bork if receiving no args', function() {
        assert.throws(ob.get);
      });

      it('should bork if receiving just one arg', function() {
        assert.throws(ob.get);
      });

      it('should bork if receiving just two args', function() {
        assert.throws(ob.get);
      });

      it('should get a profile', function(done) {
        ob.get('profile', 'a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
          assert.isNull(err);
          assert.isObject(reply);
          assert.match(reply.profile.website, /openbazaar\.org/);
          done();
        });
      });

      it('should log in, if not already logged in', function(done) {
        ob.get('profile', 'a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
          assert.isNull(err);
          assert.isObject(reply);
          assert.match(reply.profile.website, /openbazaar\.org/);
          done();
        });
      });
    });

    describe('profile', function() {

      describe('logged in', function() {
        beforeEach(function(done) {
          ob.login(function(err) {
            assert.isNull(err);
            done();
          });
        });

        it('should bork if receiving no args', function() {
          assert.throws(ob.profile, /no arguments/);
        });

        it('should accept one param, a callback. Then callback with profile object', function(done) {
          ob.profile(function(err, prof) {
            assert.isNull(err);
            assert.isObject(prof);
            assert.isString(prof.profile.short_description, 'did not see your store description. do you have one set in your openbazaar profile?');
            //console.log('        '+prof.profile.short_description);
            done();
          });
        });

        it('should accept two params, a GUID and a callback. Then callback with profile object', function(done) {
          ob.profile('a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
            assert.isNull(err);
            assert.isObject(reply);
            assert.match(reply.profile.website, /openbazaar\.org/);
            done();
          });
        });

        it('should bork if receiving an invalid GUID', function(done) {
          ob.profile('asdfasfa44t4fa89398', function(err, reply) {
            assert.match(err, /invalid GUID/);
            assert.isNull(reply);
            done();
          });
        });
      });

      describe('not logged in', function() {

        it('should bork if there is no authentication cookie available', function(done) {
          ob.profile('a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
            assert.match(err, /no cookie/);
            assert.isNull(reply);
            done();
          });
        });
      });

    });
  });
});
