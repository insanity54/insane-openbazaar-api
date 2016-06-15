//var spawn = require('child_process').spawn;
var url = require('url');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var Request = require('request');
var qs = require('qs');
var debug = require('debug')('insane-openbazaar-api');
// require('request-debug')(Request, function(type, data, r) {
//     // put your request or response handling logic here
//     debug('type=' + type);
//     debug(data)
//     debug(r)
// });


var JSONparse = function JSONparse(maybeJSON) {
  if (typeof maybeJSON === 'string') {
    try {
      maybeJSON = JSON.parse(maybeJSON);
    }
    catch(e) {
      return maybeJSON;
    }
  }
  return maybeJSON;
}


/**
 * constructor
 */
var Api = function Api(options) {
  var self = this;

  //self.userAgent = 'insane-openbazaar-api';

  // self.buildURL = function buildURL(endpoint) {
  //   return url.resolve(
  //     self.opts.proto+'://'+self.opts.host+':'+self.opts.port,
  //     endpoint
  //   );
  // }

  self.cookieString = '';

  self.defaultOpts = {
    "host": "127.0.0.1",
    "port": "18469",
    "proto": "http",
    "version": "v1",
    "verifySSL": "false"
  };
  self.opts = _.extend({}, self.defaultOpts, options);
  debug(self.opts)

  if (self.opts.proto === 'https') {
    //if (typeof self.opts.cert === 'undefined') throw new Error('you specified you wanted to use HTTPS, but you did not specify the certificate (options.cert)');
    //if (typeof self.opts.key === 'undefined') throw new Error('you specified you wanted to use HTTPS, but you did not specify the key (options.key)');
    if (typeof self.opts.ca === 'undefined') throw new Error('you specified you wanted to use HTTPS, but you did not specify the certificate authority (options.ca)');
    self.ssl = {
      //cert: fs.readFileSync(self.opts.cert),
      //key: fs.readFileSync(self.opts.key),
      ca: fs.readFileSync(self.opts.ca)
    };
  }

  if (typeof self.opts.username === 'undefined')
    throw new Error('username must be passed to insane-openbazaar-api constructor. got '+self.opts.username);

  if (typeof self.opts.password === 'undefined')
    throw new Error('password must be passed to insane-openbazaar-api constructor. got '+self.opts.password);

  if (/:\/\//.test(self.opts.proto))
    throw new Error('please remove the colon slash slash (://) from proto');

  if (!_.contains(['https', 'http'], self.opts.proto))
    throw new Error('proto must be either http or https');
}


Api.prototype.request = function request(action, method, params, callback, optional) {
  var self = this;
  if (optional) {
    if (typeof params != 'object') {
        if (typeof params == 'function') {
            var callback = params;
        }
        var params = {};
    }
  }
  else {
    if (typeof params === 'function') return params(new Error('params are required for this command'), null, null);
  }

  if (!callback) {
      var callback = function() {};
  }

  var err = null;
  //var path = self.opts.proto + '://' + self.opts.host + '/api/' + self.opts.version + '/' + action;

  var headers = {
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*'
  };

  var auth = self.cookieString;
  if (typeof auth !== 'undefined') headers['Cookie'] = auth;

  var request_options = {
    uri: {
      protocol: self.opts.proto + ':',
      hostname: self.opts.host,
      pathname: '/api/' + self.opts.version + '/' + action,
      port: self.opts.port
    },
    headers: headers,
    json: false,
    rejectUnauthorized: false
  };

  if (self.opts.verifySSL == true)
    request_options.rejectUnauthorized = true;


  if (self.ssl)
    request_options.ca = self.ssl.ca;


  debug(request_options);

  if (method == 'POST') {
    var body;

    // if this is a login, put the querystring in the body instead
    // of appending to the uri. also use x-www-form-urlencoded instead of json
    debug('action=%s', action);
    if (action === 'login') {
      if (typeof params['username'] === 'undefined' || typeof params['password'] === 'undefined') return callback(new Error('username and password are required to log in', null, null));
      body = qs.stringify({'username': params['username'], 'password': params['password']})
    }
    else {
      body = qs.stringify(params);
    }


    debug(request_options);
    request_options.body = body;
    Request.post(request_options, function (err, res, body) {
      debug('posted. err=%s, res=%s, body=%s', err, res, body)

      if (err || !res) {
        debug('got error or no response err=' + err + ' res=' + res);
        debug(err);
        return callback(err, 500, body);
      }

      if (res.statusCode != 200) {
        debug('got not a 200. statusCode='+res.statusCode + ' error=' + err + ' body=' + body)
      }

      // save the auth cookie, if this was a login
      if (action === 'login') {
        debug(res.headers);
        if (typeof res.headers['set-cookie'][0] === 'undefined') err = new Error('there was no set-cookie header when there should have been');
        self.cookieString = res.headers['set-cookie'][0];
        self.cookieString.substring(0, self.cookieString.indexOf(';'));
      }

      body = JSONparse(body);
      return callback(err, res.statusCode, body);

    });
  } else if (method == 'GET') {
    request_options.qs = params;
    debug(request_options)
    Request.get(request_options, function (err, res, body) {
      debug('err=%s, res=%s, body=%s', err, res, body);
      body = JSONparse(body);
      return callback(err, res.statusCode, body);
    });
  } else if (method == 'DELETE') {
    Request.del(request_options, function (err, res, body) {
      return callback(err, res.statusCode, body);
    });
  } else if (method == 'PUT') {
    var body = JSON.stringify(params);

    request_options.json = true;
    request_options.body = body,
    Request.put(request_options, function (err, res, body) {
      return callback(err, res.statusCode, body);
    });
  }
}


Api.prototype.isValidGUID = function isValidGUID(guid) {
  var self = this;
  if (typeof guid !== 'string') return false;
  return /[a-f0-9]{40}/.test(guid.toLowerCase());
}


// Api.prototype.login = function login(cb) {
//   var self = this;
//   if (this.ssl) {
//
//   }
//
//   var options = {
//       url: self.buildURL('/api/v1/login'),
//   };
//
//
//   var req = request.post(options);
//   req.on('end', function(err, res) {
//     if (err || !res.ok)
//       return cb(new Error(err), null);
//
//     if (typeof res === 'undefined') return cb(new Error('no data received from request'), null);
//
//     //console.log(res.headers['set-cookie'][0])
//     self.cookieString = res.headers['set-cookie'][0];
//     self.cookieString = self.cookieString.substring(0, self.cookieString.indexOf(';'));
//     //console.log(self.cookieString);
//     return cb(null);
//   });
// }


// Api.prototype.profile = function profile(guid, cb) {
//   var self = this;
//
//   if (typeof guid === 'undefined' && typeof cb === 'undefined') throw new Error('no arguments received! minimum is 1');
//   if (typeof cb === 'undefined' && typeof guid === 'function') {
//     cb = guid;
//     guid = '';
//   }
//   if (typeof cb !== 'function') throw new Error('callback function not received! cb='+cb);
//
//
//
//   if (!self.cookieString) return cb(new Error('no cookie exists in memory!'), null);
//
//   var endpoint;
//   if (guid) {
//     // validate
//     if (!self.isValidGUID(guid)) return cb(new Error('invalid GUID'), null);
//     guid = guid.toLowerCase();
//
//     endpoint = '/api/v1/profile?guid='+guid;
//   }
//   else
//     endpoint = '/api/v1/profile';
//
//   //console.log('sending cookie--' + self.cookieString)
//   var options = {
//     url: self.buildURL(endpoint),
//     headers: {
//       'Cookie': self.cookieString
//     }
//   }
//   var req = request.get(options);
//   req.on('end', function(err, res) {
//     self.getHandler.call(self, err, res, function(err, res) {
//       if (err) return cb(err, null);
//       if (typeof res.body.profile === 'undefined') {
//         console.log('res.body.profile was undef');
//         return cb(new Error('no profile received in request'), null);
//       }
//       return cb(null, res.body);
//     });
//   });
// }


/**
 * getHandler
 *
 * a common GET request handler
 * I'm imitating the express/connect middleware concept here.
 * the common GET handler is called
 * followed by unique handlers
 */
// Api.prototype.getHandler = function getHandler(err, res, cb) {
//   if (err || !res.ok) {
//     if (/Authorization Error/.test(err)) {
//       //console.log('res auth error')
//       return cb(new Error('Authorization Error'), null);
//     }
//     if (/Unauthorized/.test(err)) {
//       //console.log('unauthorized error');
//       return cb(new Error('Authorization Error'), null);
//     }
//     return cb(err, null);
//   } else {
//     if (res.statusCode !== 200) {
//       //console.log('status code was not 200');
//       return cb(new Error('Cannot GET'), null);
//     }
//     if (typeof res === 'undefined') {
//       //console.log('res was undefined');
//       return cb(new Error('no data received from request'), null);
//     }
//     if (typeof res.body === 'undefined') {
//       //console.log('res.body was undef');
//       return cb(new Error('no body received in request'), null);
//     }
//     return cb(null, res);
//   }
// }


// Api.prototype.get_sales = function get_sales(cb) {
//   var self = this;
//   endpoint = '/api/v1/get_sales';
//   if (!self.cookieString) return cb(new Error('no cookie exists in memory!'), null);
//   var options = {
//     url: self.buildURL(endpoint),
//     headers: {
//       'Cookie': self.cookieString
//     }
//   };
//   var req = request.get(options);
//   req.on('end', function(err, res) {
//     .set('Cookie', self.cookieString)
//     .end(function(err, res) {
//       // the common GET handler is called
//       // followed by unique handlers
//       self.getHandler.call(self, err, res, function(err, res) {
//         if (err) return cb(err, null);
//         return cb(null, res.body);
//       });
//     });
// }



/*
 * GET Requests
 */

Api.prototype.get_image = function get_image(params, callback) {
  var action = 'get_image';
  var method = 'GET';
  this.request(action, method, params, callback);
};


Api.prototype.profile = function profile(params, callback) {
  throw new Error('Please use get_profile() or set_profile');
}

Api.prototype.get_profile = function get_profile(params, callback) {
  var action = 'profile';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_listings = function get_listings(params, callback) {
  var action = 'get_listings';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_followers = function get_followers(params, callback) {
  var action = 'get_followers';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_following = function get_following(params, callback) {
  var action = 'get_following';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.settings = function settings(params, callback) {
  throw new Error('Please use get_settings or set_settings');
}


Api.prototype.get_settings = function get_settings(params, callback) {
  var action = 'settings';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_notifications = function get_notifications(params, callback) {
  var action = 'get_notifications';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_chat_messages = function get_chat_messages(params, callback) {
  var action = 'get_chat_messages';
  var method = 'GET';
  debug(params)
  debug('action=%s, method=%s, params=%s, callback=%s', action, method, params, callback);
  this.request(action, method, params, callback);
}


Api.prototype.get_chat_conversations = function get_chat_conversations(params, callback) {
  var action = 'get_chat_conversations';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.contracts = function(params, callback) {
  throw new Error('Please use either get_contracts() or set_contracts() or delete_contracts()');
};


Api.prototype.get_contracts = function get_contracts(params, callback) {
  var action = 'contracts';
  var method = 'GET';
  this.request(action, method, params, callback, true);
};


Api.prototype.shutdown = function shutdown(params, callback) {
  var action = 'shutdown';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_sales = function get_sales(params, callback) {
  var action = 'get_sales';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_purchases = function get_purchases(params, callback) {
  var action = 'get_purchases';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.connected_peers = function connected_peers(params, callback) {
  var action = 'connected_peers';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.routing_table = function routing_table(params, callback) {
  var action = 'routing_table';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.get_order = function get_order(params, callback) {
  var action = 'get_order';
  var method = 'GET';
  this.request(action, method, params, callback);
}


Api.prototype.get_cases = function get_cases(params, callback) {
  var action = 'get_cases';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.order_messages = function order_messages(params, callback) {
  var action = 'order_messages';
  var method = 'GET';
  this.request(action, method, params, callback);
}


Api.prototype.get_ratings = function get_ratings(params, callback) {
  var action = 'get_ratings';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}


Api.prototype.btc_price = function btc_price(params, callback) {
  var action = 'btc_price';
  var method = 'GET';
  this.request(action, method, params, callback, true);
}





/*
 * POST requests
 */
Api.prototype.login = function login(params, callback) {
  var action = 'login';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.follow = function follow(params, callback) {
  debug('follow!')
  debug(params);
  var action = 'follow';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.unfollow = function unfollow(params, callback) {
  var action = 'unfollow';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.set_profile = function set_profile(params, callback) {
  var action = 'profile';
  var method = 'POST';
  this.request(action, method, params, callback);
};

Api.prototype.social_accounts = function social_accounts(params, callback) {
  throw new Error('Please use get_profile() or set_social_accounts() or delete_social_accounts()');
};

Api.prototype.set_social_accounts = function set_social_accounts(params, callback) {
  var action = 'social_accounts';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.set_contracts = function set_contracts(params, callback) {
  var action = 'contracts';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.make_moderator = function make_moderator(params, callback) {
  var action = 'make_moderator';
  var method = 'POST';
  this.request(action, method, params, callback, true);
};


Api.prototype.unmake_moderator = function unmake_moderator(params, callback) {
  var action = 'unmake_moderator';
  var method = 'POST';
  this.request(action, method, params, callback, true);
};


Api.prototype.purchase_contract = function purchase_contract(params, callback) {
  var action = 'purchase_contract';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.confirm_order = function confirm_order(params, callback) {
  var action = 'confirm_order';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.upload_image = function upload_image(params, callback) {
  var action = 'upload_image';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.complete_order = function complete_order(params, callback) {
  var action = 'complete_order';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.set_settings = function set_settings(params, callback) {
  var action = 'settings';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.mark_notification_as_read = function mark_notification_as_read(params, callback) {
  var action = 'mark_notification_as_read';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.broadcast = function broadcast(params, callback) {
  var action = 'broadcast';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.mark_chat_message_as_read = function mark_chat_message_as_read(params, callback) {
  var action = 'mark_chat_message_as_read';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.check_for_payment = function check_for_payment(params, callback) {
  var action = 'check_for_payment';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.dispute_contract = function dispute_contract(params, callback) {
  var action = 'dispute_contract';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.close_dispute = function close_dispute(params, callback) {
  var action = 'close_dispute';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.release_funds = function release_funds(params, callback) {
  var action = 'release_funds';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.refund = function refund(params, callback) {
  var action = 'refund';
  var method = 'POST';
  this.request(action, method, params, callback);
};


Api.prototype.mark_discussion_as_read = function mark_discussion_as_read(params, callback) {
  var action = 'mark_discussion_as_read';
  var method = 'POST';
  this.request(action, method, params, callback);
};







/**
 * DELETE requests
 */
Api.prototype.delete_social_accounts = function delete_social_accounts(params, callback) {
  var action = 'social_accounts';
  var method = 'DELETE';
  this.request(action, method, params, callback);
};

Api.prototype.delete_contracts = function delete_contracts(params, callback) {
  var action = 'contracts';
  var method = 'DELETE';
  this.request(action, method, params, callback);
};

Api.prototype.delete_chat_conversation = function delete_chat_conversation(params, callback) {
  var action = 'chat_conversation';
  var method = 'DELETE';
  this.request(action, method, params, callback);
};




// Api.prototype.get = function get(item, arg, cb) {
//   var self = this;
//
//   //if (typeof cb !== 'function') throw new Error('check your code. get() needs third param a callback');
//   if (typeof arg === 'undefined') throw new Error('check your code. get() needs second param an argument or a callback');
//   if (typeof item !== 'string') throw new Error('check your code. get() needs first param a string');
//   if (typeof cb === 'undefined') {
//     cb = arg;
//     arg = '';
//   }
//
//
//   var i = _.indexOf(self.implements.getters, item.toLowerCase())
//   if (i === -1)
//     throw new Error('the method you passed to get() is not one that is implemented. Check your code.');
//
//   var count = 0;
//   // try to do the thing the user wants
//   // if there is an auth error, this is probably because we are not logged in
//   // so attempt a login.
//   // then try the thing the user wants again. do this up to 3 times.
//   function doUserRequest(cb) {
//
//     var onDone = function(err, reply) {
//       if (err) {
//         //console.log(err);
//         if (count > 2) return cb(err, null); // give up if cycling
//         // return error if it's an error we can't handle
//         if (!/no cookie/.test(err) && !/Authorization Error/.test(err)) return cb(err, null);
//
//         // if there is an authentication problem, try logging in
//         self.login(function(err) {
//           if (err) return cb(err, null);
//           return doUserRequest(cb);
//         });
//       }
//       else
//         // there was no error
//         return cb(null, reply);
//     }
//
//     count += 1;
//     var args = [];
//     if (arg) args.push(arg);
//     args.push(onDone);
//     //console.dir(args);
//     self[self.implements.getters[i]].apply(self, args);
//   }
//
//   doUserRequest(function(err, res) {
//     if (err) return cb(err);
//     return cb(null, res);
//   });
//
//
//
// }

module.exports = Api;
