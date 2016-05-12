var spawn = require('child_process').spawn;
var url = require('url');
var fs = require('fs');
var _ = require('underscore');


/**
 * constructor
 */
var Api = function Api(options) {
  var self = this;
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
  console.log(url.resolve(self.opts.proto+'://'+self.opts.host+':'+self.opts.port, '/api/v1/login'));
  var curlLogin = spawn('curl', [
    '--trace', 'trace.txt', //@todo #todo remove
    '--data',
    'username='+self.opts.username+'&'+'password='+self.opts.password,
    '--dump-header',
    'headers.txt',
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
  var endpoint;
  if (guid) {
    // validate
    if (!isValidGUID(guid)) return cb(new Error('invalid GUID'), null);
    guid = guid.toLowerCase();

    endpoint = '/api/v1/profile?guid='+guid;
  }
  else
    endpoint = '/api/v1/profile';


  var curlProfile = spawn('curl', [
    '-L', // follow redirects
    '-b', 'headers.txt', // get cookie from header file
    url.resolve(
        self.opts.proto+'://'+
        self.opts.host+':'+
        self.opts.port,
        endpoint
      )
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
    if (code !== 0) return cb(new Error('curl couldnt login! curl err code '+code))
    return cb(null, JSON.parse(d.toString()));
  });
}


module.exports = Api;
