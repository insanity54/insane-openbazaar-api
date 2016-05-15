var spawn = require('child_process').spawn;
var url = require('url');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');


/**
 * constructor
 */
var Api = function Api(options) {
  var self = this;
  self.implements = {
    "getters": [
      'profile'
    ],
    "setters": [
      'login'
    ]
  };

  // @todo this should really be in-memory
  //       so a user can create multiple instances of insane-openbazaar-api
  //       and have each instance connect to a different OpenBazaar-Server
  //       and carry out authentication in isolation
  self.cookieFile = path.join(__dirname, 'headers.txt');

  self.defaultOpts = {
    "host": "127.0.0.1",
    "port": "18469",
    "proto": "http"
  };
  self.opts = _.extend({}, self.defaultOpts, options);

  if (typeof self.opts.username === 'undefined') throw new Error('username must be defined in options');
  if (typeof self.opts.password === 'undefined') throw new Error('password must be defined in options');

}


Api.prototype.isValidGUID = function isValidGUID(guid) {
  var self = this;
  if (typeof guid !== 'string') return false;
  return /[a-f0-9]{40}/.test(guid.toLowerCase());
}


Api.prototype.login = function login(cb) {
  var self = this;
  //console.log(url.resolve(self.opts.proto+'://'+self.opts.host+':'+self.opts.port, '/api/v1/login'));
  var curlLogin = spawn('curl', [
    '--trace', 'trace.txt', //@todo #todo remove
    '--data',
    'username='+self.opts.username+'&'+'password='+self.opts.password,
    '--dump-header', 'headers.txt',
    url.resolve(self.opts.proto+'://'+self.opts.host+':'+self.opts.port, '/api/v1/login')
  ], {
    'cwd': __dirname
  });

  curlLogin.on('close', function(code) {
    //console.log('curl login exit with '+code);
    if (code == 6) return cb(new Error('curl couldnt resolve host. is your URL correct?'));
    if (code == 7) return cb(new Error('curl couldnt connect to host. is your openbazaar server running?'))
    if (code !== 0) return cb(new Error('curl couldnt login! curl err code '+code))
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

  // make sure we have auth cookie required to receive data from OpenBazaar-Server
  try { fs.accessSync(self.cookieFile) }
  catch(e) { return cb(new Error('no cookie exists! (there is no headers.txt)'), null) }

  var endpoint;
  if (guid) {
    // validate
    if (!self.isValidGUID(guid)) return cb(new Error('invalid GUID'), null);
    guid = guid.toLowerCase();

    endpoint = '/api/v1/profile?guid='+guid;
  }
  else
    endpoint = '/api/v1/profile';

  var u = url.resolve(self.opts.proto+'://'+self.opts.host+':'+self.opts.port,
      endpoint);
  //console.log(u);

  var curlProfile = spawn('curl', [
    '-L', // follow redirects
    '-b', 'headers.txt', // get cookie from header file
    '--trace', 'trace.txt', //@todo #todo remove
    u
  ], {
    'cwd': __dirname
  });

  var d;
  curlProfile.stdout.on('data', function(data) {
    //console.log('stdout '+data);
    d = data;
  });

  curlProfile.on('close', function(code) {
    //console.log('curl login exit with '+code);
    if (typeof d === 'undefined') return cb(new Error('no data received from curl'), null);
    if (code !== 0) return cb(new Error('curl couldnt login! curl err code '+code), null);
    //console.log(d.toString());
    var stringifiedData = d.toString();
    if (/Cannot GET/.test(stringifiedData)) return cb(new Error(stringifiedData));
    if (/Authorization Error/.test(stringifiedData)) return cb(new Error('Authorization Error'));

    try { var p = JSON.parse(stringifiedData) }
    catch(e) {
      return cb(new Error('problem parsing JSON. err='+e))
    }
    return cb(null, p);
  });
}

// ob.get('profile', 'aadsjfiasjfoaij3983', function(err, prof) {
//
// });


Api.prototype.get = function get(item, arg, cb) {
  var self = this;

  if (typeof cb !== 'function') throw new Error('check your code. get() needs third param a callback');
  if (typeof arg === 'undefined') throw new Error('check your code. get() needs second param an argument');
  if (typeof item !== 'string') throw new Error('check your code. get() needs first param a string');


  var i = _.indexOf(self.implements.getters, item.toLowerCase())
  if (i === -1)
    throw new Error('the method passed to get() is not one that is implemented. Check your code.');

  var count = 0;
  // try to do the thing the user wants
  // if there is an auth error, this is probably because we are not logged in
  // so attempt a login.
  // then try the thing the user wants again. do this up to 3 times.
  function doUserRequest(cb) {
    count += 1;
    self[self.implements.getters[i]](arg, function(err, reply) {
      if (err) {
        if (count > 2) return cb(err, null); // give up if cycling
        if (!/Authorization Error/.test(err) && !/no cookie/.test(err)) return cb(err);

        // if there is an authentication problem, try logging in
        self.login(function(err) {
          if (err) return cb(err, null);
          return doUserRequest(cb);
        });
      }
      else
        // there was no error
        return cb(null, reply);
    });
  }

  doUserRequest(function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  });



}

module.exports = Api;
