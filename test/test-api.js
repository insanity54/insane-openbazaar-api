var assert = require('chai').assert;
var OpenBazaarAPI = require('../index');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var semver = require('semver');
var debug = require('debug')('insane-openbazaar-api');

var testImg = fs.readFileSync(path.join(__dirname, '..', 'blobs', 'testimage.png.b64'));
var testImg2 = fs.readFileSync(path.join(__dirname, '..', 'blobs', 'testimage2.png.b64'));

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
        this.timeout(10000);
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
            assert.throws((function() {
                new OpenBazaarAPI(invalidApiOptions)
            }), /please remove the colon slash slash/);
        });

        it('should throw if something other than http or https', function() {
            var invalidApiOptions = {
                "password": 'test',
                "username": 'test',
                "proto": "httr",
            };
            assert.throws((function() {
                new OpenBazaarAPI(invalidApiOptions)
            }), /either http or https/);
        });

        it('should be OK with using HTTPS', function() {
            var sslApiOptions = {
                "proto": "https",
                "username": "test",
                "password": "test"
            };
            assert.doesNotThrow((function() {
                new OpenBazaarAPI(sslApiOptions)
            }));
        });

    });









    describe('controllers', function() {

        beforeEach(function(done) {
            var apiOptions = {};
            // Easy way to test against a live OpenBazaar-Server instead of Drakov
            if (process.env.OB_LIVE_TEST) {
                apiOptions = {
                    "proto": process.env.OB_PROTO,
                    "port": process.env.OB_PORT,
                    "host": process.env.OB_HOST
                }
                if (apiOptions.proto === 'https') {
                    apiOptions.ca = path.join(__dirname, '..', 'blobs', 'rootCA.3.crt');
                }
            } else {
                apiOptions = {
                    "port": 3000
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
                assert.isFalse(ob.isValidGUID({
                    "a06aa22a38f0e62221ab74464c311bd88305f88c": "a06aa22a38f0e62221ab74464c311bd88305f88c"
                }));
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


        describe('Ambiguous requests', function() {
            describe('profile', function() {
                it('should bork and recommend either a get_ or set_ prefix', function() {
                    assert.throws(
                        (function() {
                            ob.profile(function(err, contracts) {});
                        }), /Please use/);
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
            describe('settings', function() {
                it('should throw, telling to use a get/set prefix', function() {
                    assert.throws(
                        (function() {
                            ob.settings(function(err, contracts) {});
                        }), /Please use/);
                });
            });
            describe('social_accounts', function() {
                it('should throw, suggesting to use a get/set prefix', function() {
                    assert.throws(
                        (function() {
                            ob.social_accounts(function(err, code, accounts) {});
                        }), /Please use/);
                });
            });
        });

        describe('Authentication', function() {
            describe('Unauthenticated GET call', function() {
              it('should callback with an error if receiving invalid or no auth cookie', function(done) {
                  ob.cookieString = '';
                  ob.get_profile(function(err, status, body) {
                      debug('err=%s, status=%s, body=%s', err, status, body);
                      assert.instanceOf(err, Error);
                      assert.isNull(status);
                      assert.isNull(body);
                      done();
                  });
              });
            });
            describe('Unauthenticated POST call', function() {
              it('should callback with an error if receiving invalid or no auth cookie', function(done) {
                  ob.cookieString = '';
                  ob.post_profile({
                    "name": "Sunshine Martian",
                    "location": "UNITED_STATES"
                  }, function(err, status, body) {
                      debug('err=%s, status=%s, body=%s', err, status, body);
                      assert.instanceOf(err, Error);
                      assert.isNull(status);
                      assert.isNull(body);
                      done();
                  });
              });
            });
            describe('Unauthenticated DELETE call', function() {
              it('should callback with an error if receiving invalid or no auth cookie', function(done) {
                  ob.cookieString = '';
                  ob.delete_social_accounts({
                    "account_type": "twitter"
                  }, function(err, status, body) {
                      debug('err=%s, status=%s, body=%s', err, status, body);
                      assert.instanceOf(err, Error);
                      assert.isNull(status);
                      assert.isNull(body);
                      done();
                  });
              });
            });
            describe('login', function() {

                it('should callback with error if not receiving username and password', function(done) {
                    ob.login(function(err, code, body) {
                        debug(err);
                        assert.match(err, /params are required/);
                        assert.isNull(code);
                        assert.isNull(body);
                        done();
                    });
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
        });

        describe('Network requests', function() {
            beforeEach(function(done) {
                ob.login({
                    username: process.env.OB_LIVE_TEST ? process.env.OB_USERNAME : 'test',
                    password: process.env.OB_LIVE_TEST ? process.env.OB_PASSWORD : 'test'
                }, function(err, code, body) {
                    assert.isNull(err);
                    assert.equal(code, 200);
                    assert.isDefined(body);
                    done();
                });
            });


            describe('GET requests', function() {
                this.timeout(process.env.OB_LIVE_TEST ? (1000 * 10) : (1000 * 1));

                describe('get_image', function() {
                    it('should return a raw image', function(done) {
                        ob.get_image({
                            "hash": '55456e9efbafb5139977d1f86313eaac3293a88b'
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isNumber(body);
                            done();
                        });
                    });
                    it('should bork if not receiving hash parameter', function(done) {
                        ob.get_image(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                });
                describe('get_profile', function() {
                    it('should accept a guid and return a profile object', function(done) {
                        this.timeout(10000);
                        ob.get_profile({
                            'guid': 'a06aa22a38f0e62221ab74464c311bd88305f88c'
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isString(body.profile.short_description);
                            assert.match(body.profile.short_description, /Trade free/);
                            done();
                        });
                    });
                    it('should return own profile if receiving no params', function(done) {
                        ob.get_profile(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isString(body.profile.short_description);
                            done();
                        });
                    });
                });
                describe('get_listings', function() {
                    it('should accept no params and callback with object of own listings', function(done) {
                        ob.get_listings(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            done();
                        });
                    });
                    it('should accept guid param and callback with listings object', function(done) {
                        ob.get_listings({
                            "guid": "a06aa22a38f0e62221ab74464c311bd88305f88c"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            done();
                        });
                    });
                });
                describe('get_followers', function() {
                    it('should accept guid param and callback with followers object', function(done) {
                        ob.get_followers({
                            "guid": "a06aa22a38f0e62221ab74464c311bd88305f88c"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isArray(body.followers);
                            done();
                        });
                    });
                    it('should accept guid and start param and callback with followers object', function(done) {
                        ob.get_followers({
                            "guid": "a06aa22a38f0e62221ab74464c311bd88305f88c",
                            "start": 2
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isArray(body.followers);
                            done();
                        });
                    });
                    it('should accept no params and callback with followers object', function(done) {
                        ob.get_followers(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isArray(body.followers);
                            done();
                        });
                    });
                });
                describe('get_following', function() {
                    it('should accept guid param and callback with following object', function(done) {
                        ob.get_following({
                            "guid": "a06aa22a38f0e62221ab74464c311bd88305f88c"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isArray(body.following);
                            done();
                        });
                    });
                    it('should accept no params and callback with following object', function(done) {
                        ob.get_following(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isArray(body.following);
                            done();
                        });
                    });
                });
                describe('get_settings', function() {
                    it('should callback with settings json', function(done) {
                        ob.get_settings(function(err, code, body) {
                            debug('callback! err=%s, code=%s, body=%s', err, code, body);
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isString(body.currency_code);
                            done();
                        });
                    });
                });
                describe('get_notifications', function() {
                    it('should accept no params and callback with notification object', function(done) {
                        ob.get_notifications(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isNumber(body.unread);
                            assert.isArray(body.notifications);
                            done();
                        });
                    });
                });
                describe('get_chat_messages', function() {
                    it('should callback with array of chats', function(done) {
                        ob.get_chat_messages({
                            'guid': 'd47eea06209d3da8dc10937399a9cf1c3dd4dca4'
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isArray(body);
                            assert.isString(body[0].guid); // will be undefined if no valid guid was sent
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
                            assert.equal(code, 200);
                            assert.isArray(body);
                            done();
                        });
                    });
                });
                describe('get_contracts', function() {
                    it('should accept no params and callback with an empty object', function(done) {
                        ob.get_contracts(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            done();
                        });
                    });
                    it('should accept an id param and callback with contract object', function(done) {
                        ob.get_contracts({
                            "id": "6c3ab682de4ca527f5cb2d5775c737688dd13647"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            done();
                        });
                    });
                });
                describe('shutdown', function() {
                    it('should not callback', function() {
                        // this one is kind of awkward because openbazaar-server does not
                        // respond in the event of success. It only responds when unauthorized
                        // @todo see if openbazaar-server can change their endpoint to
                        //       respond before shutting down.
                        // @todo re-write this test so it actually catches failures
                        assert.doesNotThrow(ob.shutdown, /undefined/);
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
                    it('should accept no params and callback with peers object', function(done) {
                        ob.connected_peers(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isArray(body.peers);
                            assert.isNumber(body.num_peers);
                            done();
                        });
                    });
                });
                describe('routing_table', function() {
                    it('should accept no params and callback with array of routes', function(done) {
                        ob.routing_table(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isArray(body);
                            assert.match(body[0].guid, guidRegEx);
                            done();
                        });
                    });
                });
                describe('get_order', function() {
                    it('should callback with order object', function(done) {
                        ob.get_order({
                            'order_id': '8da26ad7af510bc5e94c3f4314865c60578d18b6'
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            done();
                        });
                    });
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
                        ob.order_messages({
                            'order_id': '8da26ad7af510bc5e94c3f4314865c60578d18b6'
                        }, function(err, code, body) {
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
                        ob.get_ratings({
                            'guid': 'd47eea06209d3da8dc10937399a9cf1c3dd4dca4'
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isArray(body);
                            done();
                        });
                    });
                    it('should accept guid param and contract_id and return an array of ratings objects', function(done) {
                        ob.get_ratings({
                            'guid': 'd47eea06209d3da8dc10937399a9cf1c3dd4dca4'
                        }, function(err, code, body) {
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
                        ob.btc_price({
                            'currency': 'BTC'
                        }, function(err, code, body) {
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
                describe('follow', function() {
                    it('should accept a guid to follow and callback with success', function(done) {
                        this.timeout(5000);
                        ob.follow({
                            "guid": "d47eea06209d3da8dc10937399a9cf1c3dd4dca4"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                    it('should bork if no params received', function(done) {
                        ob.follow(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                });
                describe('unfollow', function() {
                    it('should take a guid and callback with success', function(done) {
                        ob.unfollow({
                            "guid": "d47eea06209d3da8dc10937399a9cf1c3dd4dca4"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                    it('should bork if no params received', function(done) {
                        ob.unfollow(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                });
                describe('post_profile', function() {
                    it('should accept a profile object and return success', function(done) {
                        ob.post_profile({
                            "name": "Sunshine Martian",
                            "location": "UNITED_STATES"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                    it('should bork given no params', function(done) {
                        ob.post_profile(function(err, code, body) {
                            assert.isDefined(err);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                });
                describe('set_social_accounts', function() {
                    it('should bork given no params', function(done) {
                        ob.set_social_accounts(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                    it('should accept username and account_type parameters then callback with success', function(done) {
                        ob.set_social_accounts({
                            "username": "@sunshinemartian",
                            "account_type": "twitter"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('set_contracts', function() {
                    it('should bork when receiving no params', function(done) {
                        ob.set_contracts(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                    it('should accept a contract object and callback with success', function(done) {
                        ob.set_contracts({
                            "title": "DERP CONTRACT OF THE YEAR",
                            "terms_conditions": "you must be extra derpy to receive",
                            "returns": "you can return for one derpo",
                            "category": "tests",
                            "condition": "New",
                            "sku": "",
                            "keywords": ['derp', 'test'],
                            "expiration_date": "2016-06-17T11:10 UTC",
                            "metadata_category": "title",
                            "description": "derp item for you to derp with",
                            "currency_code": "USD",
                            "price": "5",
                            "process_time": "5 years",
                            "nsfw": "false",
                            "shipping_currency_code": "USD",
                            "shipping_domestic": "50",
                            "shipping_international": "100",
                            "images": [
                                'd19ce4ff4e8a98cf57f20705c47bc75dc574ed06',
                                'e7e6b5b2e74b9789d624f8aa7c9343f8388c2076'
                            ],
                            "free_shipping": "false"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('make_moderator', function() {
                    it('should accept no params and callback with success', function(done) {
                        ob.make_moderator(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('unmake_moderator', function() {
                    it('should accept no params and callback with success', function(done) {
                        ob.unmake_moderator(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('purchase_contract', function() {
                    it('should accept an id, quantity parameter and callback with success', function(done) {
                        this.timeout(10000);
                        ob.purchase_contract({
                            "id": "59dc82cde6191c478f276a62ac57aaf174b54ebd",
                            "quantity": 2,
                            "refund_address": "1UiiekN3k92Hik3F58dCUKm7WEJPx6NSN"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('confirm_order', function() {
                    it('should accept id parameter and callback with success', function(done) {
                        ob.confirm_order({
                            "id": "f4942393f5d3b9b53b4b58e00f65b9afc7576c74",
                            "payout_address": "n1t7Dp6EPrdj7UHZiQsKWic9qWYUYpLcXC"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('upload_image', function() {
                    it('should accept image parameter and callback with success', function(done) {
                        ob.upload_image({
                            "image": testImg
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                    it('should accept image parameter and callback with success', function(done) {
                        ob.upload_image({
                            "image": testImg2
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                    it('should accept avatar parameter and callback with success', function(done) {
                        ob.upload_image({
                            "avatar": testImg
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                    it('should accept header parameter and callback with success', function(done) {
                        ob.upload_image({
                            "header": testImg
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('complete_order', function() {
                    it('should accept id and callback with success', function(done) {
                        ob.complete_order({
                            "id": "f4942393f5d3b9b53b4b58e00f65b9afc7576c74"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('set_settings', function() {
                    it('should accept a settings object and callback with success', function(done) {
                        ob.get_settings(function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isString(body.currency_code);
                            var settings = body;
                            var refundString = "YOLO YOLO YOLO";
                            settings.refund_policy = refundString;
                            settings.blocked = settings.blocked_guids;
                            settings.moderators = "";
                            delete settings.blocked_guids; // @todo I think this is a bug. blocked_guids is inconsistently named.
                            debug(settings);

                            ob.set_settings(settings, function(err, code, body) {
                                assert.isNull(err);
                                assert.equal(code, 200);
                                assert.isObject(body);
                                assert.isTrue(body.success);
                                done();
                            });
                        });
                    });
                    it('should bork if not receiving params', function(done) {
                        ob.set_settings(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                });
                describe('mark_notification_as_read', function() {
                    it('should accept id and callback with success', function(done) {
                        ob.mark_notification_as_read({
                            "id": "d8ee879dd2785dfd7de23cbdcabf579150272fcd"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                    it('should bork if receiving no parameters', function(done) {
                        ob.mark_notification_as_read(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                });
                describe('broadcast', function() {
                    it('should accept message arg and callback with success', function(done) {
                        ob.broadcast({
                            "message": "thankyouverymuch"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            assert.isNumber(body['peers reached']);
                            done();
                        });
                    });
                    it('should bork if receiving no params', function(done) {
                        ob.broadcast(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                });
                describe('mark_chat_message_as_read', function() {
                    it('should bork if receiving no params', function(done) {
                        ob.mark_chat_message_as_read(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
                            done();
                        });
                    });
                    it('should accept message guid and callback with success', function(done) {
                        ob.mark_chat_message_as_read({
                            "guid": "fe35be5ec8c07d07e347d7003021bdfa8630ca2f"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isObject(body);
                            assert.isTrue(body.success);
                            done();
                        });
                    });
                });
                describe('check_for_payment', function() {
                    it('should callback with success', function(done) {
                        ob.check_for_payment({
                            'order_id': '2006247e6d2d49c5d960dcaa1c0305e387577607'
                        }, function(err, code, body) {
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
                        ob.dispute_contract({
                            'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'
                        }, function(err, code, body) {
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
                        ob.close_dispute({
                            'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
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
                        ob.release_funds({
                            'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'
                        }, function(err, code, body) {
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
                        ob.refund({
                            'order_id': '4d2a90ddb7ef5298bd8edfa627c18580914dfc85'
                        }, function(err, code, body) {
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
                        ob.mark_discussion_as_read({
                            'id': 'abcdef'
                        }, function(err, code, body) {
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
                describe('delete_social_accounts', function() {
                    it('should accept account_type param and return success', function(done) {
                        ob.delete_social_accounts({
                            "account_type": "twitter"
                        }, function(err, code, body) {
                            assert.isNull(err);
                            assert.equal(code, 200);
                            assert.isDefined(body);
                            done();
                        });
                    });
                    it('should bork when receiving no params', function(done) {
                        ob.delete_social_accounts(function(err, code, body) {
                            assert.match(err, /params are required/);
                            assert.isNull(code);
                            assert.isNull(body);
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
