var assert = require('chai').assert;
var OpenBazaarAPI = require('../index');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var semver = require('semver');
var debug = require('debug')('insane-openbazaar-api');


debug('OB_HOST=%s\nOB_PASSWORD=%s\nOB_USERNAME=%s\nOB_PROTO=%s\n\
OB_PORT=%s\nOB_LIVE_TEST=%s\nDEBUG=%s',
process.env.OB_HOST,
process.env.OB_PASSWORD,
process.env.OB_USERNAME,
process.env.OB_PROTO,
process.env.OB_PORT,
process.env.OB_LIVE_TEST,
process.env.DEBUG);


const guidRegEx = /[a-f0-9]{40}/;



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

    it('should be OK with using HTTPS', function() {
      var sslApiOptions = {
        "proto": "https",
        "username": "test",
        "password": "test"
      };
      assert.doesNotThrow((function() {new OpenBazaarAPI(sslApiOptions) }));
    });

  });









  describe('controllers', function() {

    beforeEach(function(done) {
      var apiOptions = {};
      // Easy way to test against a live OpenBazaar-Server instead of Drakov
      if (process.env.OB_LIVE_TEST) {
        apiOptions = {
          "port": process.env.OB_PORT,
          "host": process.env.OB_HOST,
          "username": process.env.OB_USERNAME,
          "password": process.env.OB_PASSWORD
        }
      }
      else {
        apiOptions = {
          "password": 'test',
          "username": 'test',
          "port": 3000,
        };
      }

      var badOptions = _.extend({}, apiOptions, {
        "host": "example.com"
      });

      ob = new OpenBazaarAPI(apiOptions);
      obb = new OpenBazaarAPI(badOptions);

      // delete header file which contains auth cookie @todo delete
      // try { fs.unlinkSync(path.join(__dirname, '..', 'headers.txt')) }
      // catch(e) { assert.equal(e.code, 'ENOENT', 'I cant handle this error') }
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



    // Notes about get() https://github.com/insanity54/insane-openbazaar-api/issues/3
    xdescribe('get', function() {

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
          //console.log(reply);
          assert.isObject(reply);
          assert.match(reply.profile.website, /openbazaar\.org/);
          done();
        });
      });

      it('should log in, if not already logged in', function(done) {
        assert.equal(ob.cookieString, '');
        ob.get('profile', 'a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
          //console.log(ob.cookieString);
          assert.isNull(err);
          assert.isObject(reply);
          assert.match(reply.profile.website, /openbazaar\.org/);
          done();
        });
      });

      it('should log in again if the existing cookieString is expired', function(done) {
        ob.cookieString = 'TWISTED_SESSION=beefbeefdeadbeefdeadbeefbeeff666';
        ob.get('profile', 'a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
          //console.log(reply);
          assert.isNull(err);
          assert.isObject(reply);
          assert.match(reply.profile.website, /openbazaar\.org/);
          done();
        });
      });
    });


    describe('API', function() {
      beforeEach(function(done) {
        ob.login({
          username: process.env.OB_LIVE_TEST ? process.env.OB_USERNAME : 'test',
          password: process.env.OB_LIVE_TEST ? process.env.OB_PASSWORD : 'test'
        }, function(err, code, body) {
          assert.isNull(err);
          assert.equal(200, code);
          assert.isDefined(body);
          done();
        });
      });

      describe('GET requests', function() {
        this.timeout(process.env.OB_LIVE_TEST ? (1000 * 10) : (1000 * 1));

        describe('get_image', function() {
          it('should return an array of images', function(done) {
            ob.get_image(function(err, images) {
              assert.isNull(err);
              assert.isDefined(images);
              assert.isArray(images);
              done();
            });
          });
        });
        describe('profile', function() {

          xit('should bork if there is no authentication cookie available', function(done) {
            ob.profile('a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
              assert.match(err, /no cookie/);
              assert.isNull(reply);
              done();
            });
          });

          it('should bork if receiving no args', function() {
            assert.throws(ob.profile, /no arguments/);
          });

          it('should accept one param, a callback. Then callback with profile object', function(done) {
            // this will fail if running against a live OpenBazaar-Server server that is not serving a store
            ob.profile(function(err, prof) {
              assert.isNull(err, 'Did not see your store profile. is this OpenBazaar-Server instance hosting a store?');
              assert.isObject(prof);
              assert.isString(prof.profile.short_description);
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
        describe('get_listings', function() {
          it('should callback with array of listings', function(done) {
            ob.get_listings(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('get_followers', function() {
          it('should callback with array of followers', function(done) {
            ob.get_followers(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('get_settings', function() {
          it('should callback with settings json', function(done) {
            ob.get_settings(function(err, code, body) {
              debug('callback! err=%s, code=%s, body=%s', err, code, body);
              assert.isNull(err);
              assert.equal(200, code);
              assert.isObject(body);
              assert.isString(body.currency_code);
              done();
            });
          });
        });
        describe('get_notifications', function() {
          it('should callback with notification object', function(done) {
            ob.get_notifications(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isObject(body);
              assert.isNumber(body.unread);
              assert.isArray(body.notifications);
              console.log(body);
              done();
            });
          });
        });
        describe('get_chat_messages', function() {
          it('should callback with array of chats', function(done) {
            ob.get_chat_messages({'guid': 'd47eea06209d3da8dc10937399a9cf1c3dd4dca4'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              assert.isString(body[0].guid);
              assert.match(body[0].guid, guidRegEx);
              done();
            });
          });

          it('should bork if not receiving guid parameter', function(done) {
            ob.get_chat_messages(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('get_chat_conversations', function() {
          it('should callback with array of conversations', function(done) {
            ob.get_chat_conversations(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              console.log(body)
              done();
            });
          });
        });
        describe('contracts', function() {
          it('should throw with message saying to use a get/set/delete prefix', function() {
            assert.throws(
              (function() {
                ob.contracts(function(err, contracts) {});
              }), /Please use/);
          });
        });
        describe('get_contracts', function() {
          it('should return with array of contracts', function(done) {
            ob.get_contracts(function(err, code, contracts) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(contracts);
              done();
            });
          });
        });
        describe('shutdown', function() {
          it('should callback with ???', function(done) {
            ob.get_followers(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isDefined(body);
              done();
            });
          });
        });
        describe('get_sales', function() {
          it('should get an array of sales', function(done) {
            ob.get_sales(function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('get_purchases', function() {
          it('should callback with array of purchases', function(done) {
            ob.get_purchases(function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('connected_peers', function() {
          it('should callback with array of peers', function(done) {
            ob.connected_peers(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('routing_table', function() {
          it('should callback with array of guids', function(done) {
            ob.routing_table(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              assert.match(body[0].guid, guidRegEx);
              done();
            });
          });
        });
        describe('get_order', function() {
          it('should callback with order object', function(done) {
            ob.get_order({'order_id': '8da26ad7af510bc5e94c3f4314865c60578d18b6'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              debug('err=%s, code=%s, body=%s', err, code, body)
              assert.isObject(body);
              done();
            });
          });
          // it('should callback with order object (send Array obj.order_id)', function(done) {
          //   ob.get_order([{'order_id': '8da26ad7af510bc5e94c3f4314865c60578d18b6'}], function(err, code, body) {
          //     assert.isNull(err);
          //     assert.equal(code, 200);
          //     assert.isObject(body);
          //     done();
          //   });
          // });
          it('should bork if not receiving order_id', function(done) {
            ob.get_order(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('get_cases', function() {
          it('should callback with array of cases', function(done) {
            ob.get_cases(function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('order_messages', function() {
          it('should callback with array of messages', function(done) {
            ob.order_messages({'order_id': '8da26ad7af510bc5e94c3f4314865c60578d18b6'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              done();
            });
          });
          it('should bork if not receiving args', function(done) {
            ob.order_messages(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('get_ratings', function() {
          it('should accept guid param and return an array of ratings objects', function(done) {
            ob.get_ratings({'guid': 'd47eea06209d3da8dc10937399a9cf1c3dd4dca4'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              done();
            });
          });
          it('should accept guid param and contract_id and return an array of ratings objects', function(done) {
            ob.get_ratings({'guid': 'd47eea06209d3da8dc10937399a9cf1c3dd4dca4'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              done();
            });
          });
          it('should accept no params and return an array of ratings objects', function(done) {
            ob.get_ratings(function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('btc_price', function() {
          it('should accept no params and callback with currencyCodes object', function(done) {
            ob.btc_price(function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isObject(body);
              assert.isObject(body.currencyCodes);
              done();
            });
          });
          it('should accept currency param and callback with exchange rate and currency codes', function(done) {
            ob.btc_price({'currency': 'BTC'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isObject(body);
              assert.isNumber(body.btcExchange);
              assert.isObject(body.currencyCodes);
              done();
            });
          });
        });
      });

      describe('POST requests', function() {
        describe('login', function() {

          it('should bork if not receiving username and password', function(done) {
            assert.throws((function() {
              ob.login(function(err, code, body) {});
            }, /username and password/));
          });

          it('should log in to the openbazaar server', function(done) {
            ob.login({
              username: process.env.OB_LIVE_TEST ? process.env.OB_USERNAME : 'test',
              password: process.env.OB_LIVE_TEST ? process.env.OB_PASSWORD : 'test'
            }, function(err, status, body) {
              assert.isNull(err);
              assert.equal(status, 200);
              assert.isDefined(body);
              done();
            });
          });

          it('should NOT create a headers.txt file containing cookie', function(done) {
            // 'headers.txt exists. Are you using an old version of insane-openbazaar-api? please update!'
            ob.login({
              username: process.env.OB_LIVE_TEST ? process.env.OB_USERNAME : 'test',
              password: process.env.OB_LIVE_TEST ? process.env.OB_PASSWORD : 'test'
            }, function(err, status, body) {
              assert.isNull(err);
              assert.equal(status, 200);
              assert.isDefined(body);
              assert.throws(
                (function() {
                  // node versions 0.10 and below do not have fs.accessSync()
                  if (semver.satisfies(process.versions.node, '0.6 - 0.10')) {
                    if (!fs.existsSync(path.join(__dirname, '..', 'headers.txt'))) throw new Error('ENOENT');
                  } else {
                    fs.accessSync(path.join(__dirname, '..', 'headers.txt'));
                  }
                }), /ENOENT/);
              done();
            });
          });

          it('should store authentication cookie in memory', function(done) {
            ob.login({
              username: process.env.OB_LIVE_TEST ? process.env.OB_USERNAME : 'test',
              password: process.env.OB_LIVE_TEST ? process.env.OB_PASSWORD : 'test'
            }, function(err, status, body) {
              assert.isNull(err);
              assert.equal(status, 200);
              assert.isDefined(body);
              assert.match(ob.cookieString, /[a-f0-9]{32}/);
              done();
            });
          });
        });
        describe('follow', function() {
          it('should callback ???', function(done) {
            ob.follow(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('unfollow', function() {
          it('should callback with ???', function(done) {
            ob.unfollow(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('profile', function() {
          it('should callback profile object', function(done) {
            ob.profile(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isObject(body);
              assert.isString(body.short_description);
              done();
            });
          });
        });
        describe('social_accounts', function() {
          it('should callback ???', function(done) {
            ob.social_accounts(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('contracts', function() {
          it('should callback ???', function(done) {
            ob.contracts(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('make_moderator', function() {
          it('should callback ???', function(done) {
            ob.make_moderator(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('unmake_moderator', function() {
          it('should callback ???', function(done) {
            ob.unmake_moderator(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('purchase_contract', function() {
          it('should callback ???', function(done) {
            ob.purchase_contract(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('confirm_order', function() {
          it('should callback ???', function(done) {
            ob.confirm_order(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('upload_image', function() {
          it('should callback ???', function(done) {
            ob.upload_image(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('complete_order', function() {
          it('should callback ???', function(done) {
            ob.complete_order(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('settings', function() {
          it('should throw, telling to use a get/set prefix', function() {
            assert.throws(
              (function() {
                ob.settings(function(err, contracts) {});
              }), /Please use/);
          });
        });
        describe('mark_notification_as_read', function() {
          it('should callback ???', function(done) {
            ob.mark_notification_as_read(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('broadcast', function() {
          it('should callback ???', function(done) {
            ob.broadcast(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('mark_chat_message_as_read', function() {
          it('should callback ???', function(done) {
            ob.mark_chat_message_as_read(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('check_for_payment', function() {
          it('should callback with success', function(done) {
            ob.check_for_payment({'order_id': '2006247e6d2d49c5d960dcaa1c0305e387577607'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isObject(body);
              assert.isDefined(body.success);
              assert.isTrue(body.success);
              done();
            });
          });
          it('should bork if not receiving order_id in params', function(done) {
            ob.check_for_payment(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('dispute_contract', function() {
          it('should callback with success', function(done) {
            ob.dispute_contract({'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isObject(body);
              assert.isTrue(body.success);
              done();
            });
          });
          it('should bork when not receiving params', function(done) {
            ob.dispute_contract(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('close_dispute', function() {
          it('should callback with success', function(done) {
            ob.close_dispute({'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isObject(body);
              assert.isTrue(body.success);
              done();
            });
          });
          it('should bork if not receiving args', function(done) {
            ob.close_dispute(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('release_funds', function() {
          it('should callback with success', function(done) {
            ob.release_funds({'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isObject(body);
              assert.isTrue(body.success);
              done();
            });
          });
          it('should bork if not receiving arguments', function(done) {
            ob.release_funds(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('refund', function() {
          it('should accept an order_id param and callback with success', function(done) {
            ob.refund({'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isObject(body);
              assert.isTrue(body.success);
              done();
            });
          });
          it('should bork if not receiving params', function(done) {
            ob.refund(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
        describe('mark_discussion_as_read', function() {
          // @todo //ccc
          it('should accept an id param and callback with success', function(done) {
            ob.mark_discussion_as_read({'id': 'abcdef'}, function(err, code, body) {
              assert.isNull(err);
              assert.equal(code, 200);
              assert.isObject(body);
              assert.isTrue(body.success);
              done();
            });
          });
          it('should bork if not receiving params', function(done) {
            ob.mark_discussion_as_read(function(err, code, body) {
              assert.match(err, /params are required/);
              assert.isNull(code);
              assert.isNull(body);
              done();
            });
          });
        });
      });

      describe('DELETE requests', function() {
        describe('social_accounts', function() {
          it('should throw, suggesting to use a get/set prefix', function() {
            assert.throws(
              (function() {
                ob.social_accounts(function(err, code, accounts) {});
              }), /Please use/);
          });
        });
        describe('delete_social_accounts', function() {
          it('should return ???', function(done) {
            ob.delete_social_accounts(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isDefined(body);
              done();
            });
          });
        });
        describe('delete_contracts', function() {
          it('should callback ???', function(done) {
            ob.delete_contracts(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
        describe('chat_conversation', function() {
          it('should callback ???', function(done) {
            ob.delete_chat_conversation(function(err, code, body) {
              assert.isNull(err);
              assert.equal(200, code);
              assert.isArray(body);
              done();
            });
          });
        });
      });
    });
  });
});
