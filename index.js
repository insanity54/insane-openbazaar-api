//var spawn = require('child_process').spawn;
var url = require('url');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var request = require('superagent');








/**
 * constructor
 */
var Api = function Api(options) {
  var self = this;
  self.implements = {
    "getters": [
      'profile',
      'get_sales'
    ],
    "setters": [
      'login'
    ]
  };

  self.buildURL = function buildURL(endpoint) {
    return url.resolve(
      self.opts.proto+'://'+self.opts.host+':'+self.opts.port,
      endpoint
    );
  }

  self.cookieString = '';

  self.defaultOpts = {
    "host": "127.0.0.1",
    "port": "18469",
    "proto": "http"
  };
  self.opts = _.extend({}, self.defaultOpts, options);

  if (typeof self.opts.username === 'undefined')
    throw new Error('username must be passed to insane-openbazaar-api constructor. got '+self.opts.username);

  if (typeof self.opts.password === 'undefined')
    throw new Error('password must be passed to insane-openbazaar-api constructor. got '+self.opts.password);

  if (/:\/\//.test(self.opts.proto))
    throw new Error('please remove the colon slash slash (://) from proto');

  if (!_.contains(['http', 'https'], self.opts.proto))
    throw new Error('proto must be either http or https');
}


Api.prototype.isValidGUID = function isValidGUID(guid) {
  var self = this;
  if (typeof guid !== 'string') return false;
  return /[a-f0-9]{40}/.test(guid.toLowerCase());
}


Api.prototype.login = function login(cb) {
  var self = this;

  var req = request
    .post(self.buildURL('/api/v1/login'))
    .send({ username: self.opts.username, password: self.opts.password })
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (err || !res.ok)
        return cb(new Error(err));

      if (typeof res === 'undefined') return cb(new Error('no data received from request'), null);

      //console.log(res.headers['set-cookie'][0])
      self.cookieString = res.headers['set-cookie'][0];
      self.cookieString = self.cookieString.substring(0, self.cookieString.indexOf(';'));
      //console.log(self.cookieString);
      return cb(null);


    });
}


Api.prototype.profile = function profile(guid, cb) {
  var self = this;

  if (typeof guid === 'undefined' && typeof cb === 'undefined') throw new Error('no arguments received! minimum is 1');
  if (typeof cb === 'undefined' && typeof guid === 'function') {
    cb = guid;
    guid = '';
  }
  if (typeof cb !== 'function') throw new Error('callback function not received! cb='+cb);



  if (!self.cookieString) return cb(new Error('no cookie exists in memory!'), null);

  var endpoint;
  if (guid) {
    // validate
    if (!self.isValidGUID(guid)) return cb(new Error('invalid GUID'), null);
    guid = guid.toLowerCase();

    endpoint = '/api/v1/profile?guid='+guid;
  }
  else
    endpoint = '/api/v1/profile';

  //console.log('sending cookie--' + self.cookieString)
  var req = request
    .get(self.buildURL(endpoint))
    .set('Cookie', self.cookieString)
    .end(function(err, res) {
      self.getHandler.call(self, err, res, function(err, res) {
        if (err) return cb(err, null);
        if (typeof res.body.profile === 'undefined') {
          console.log('res.body.profile was undef');
          return cb(new Error('no profile received in request'), null);
        }
        return cb(null, res.body);
      });
    });
}


/**
 * getHandler
 *
 * a common GET request handler
 * I'm imitating the express/connect middleware concept here.
 * the common GET handler is called
 * followed by unique handlers
 */
Api.prototype.getHandler = function getHandler(err, res, cb) {
  if (err || !res.ok) {
    if (/Authorization Error/.test(err)) {
      //console.log('res auth error')
      return cb(new Error('Authorization Error'), null);
    }
    if (/Unauthorized/.test(err)) {
      //console.log('unauthorized error');
      return cb(new Error('Authorization Error'), null);
    }
    return cb(err, null);
  } else {
    if (res.statusCode !== 200) {
      //console.log('status code was not 200');
      return cb(new Error('Cannot GET'), null);
    }
    if (typeof res === 'undefined') {
      //console.log('res was undefined');
      return cb(new Error('no data received from request'), null);
    }
    if (typeof res.body === 'undefined') {
      //console.log('res.body was undef');
      return cb(new Error('no body received in request'), null);
    }
    return cb(null, res);
  }
}


Api.prototype.get_sales = function get_sales(cb) {
  var self = this;
  endpoint = '/api/v1/get_sales';
  if (!self.cookieString) return cb(new Error('no cookie exists in memory!'), null);
  var req = request
    .get(self.buildURL(endpoint))
    .set('Cookie', self.cookieString)
    .end(function(err, res) {
      // the common GET handler is called
      // followed by unique handlers
      self.getHandler.call(self, err, res, function(err, res) {
        if (err) return cb(err, null);
        return cb(null, res.body);
      });
    });
}






Api.prototype.get = function get(item, arg, cb) {
  var self = this;

  //if (typeof cb !== 'function') throw new Error('check your code. get() needs third param a callback');
  if (typeof arg === 'undefined') throw new Error('check your code. get() needs second param an argument or a callback');
  if (typeof item !== 'string') throw new Error('check your code. get() needs first param a string');
  if (typeof cb === 'undefined') {
    cb = arg;
    arg = '';
  }


  var i = _.indexOf(self.implements.getters, item.toLowerCase())
  if (i === -1)
    throw new Error('the method you passed to get() is not one that is implemented. Check your code.');

  var count = 0;
  // try to do the thing the user wants
  // if there is an auth error, this is probably because we are not logged in
  // so attempt a login.
  // then try the thing the user wants again. do this up to 3 times.
  function doUserRequest(cb) {

    var onDone = function(err, reply) {
      if (err) {
        //console.log(err);
        if (count > 2) return cb(err, null); // give up if cycling
        // return error if it's an error we can't handle
        if (!/no cookie/.test(err) && !/Authorization Error/.test(err)) return cb(err, null);

        // if there is an authentication problem, try logging in
        self.login(function(err) {
          if (err) return cb(err, null);
          return doUserRequest(cb);
        });
      }
      else
        // there was no error
        return cb(null, reply);
    }

    count += 1;
    var args = [];
    if (arg) args.push(arg);
    args.push(onDone);
    //console.dir(args);
    self[self.implements.getters[i]].apply(self, args);
  }

  doUserRequest(function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  });



}

module.exports = Api;
