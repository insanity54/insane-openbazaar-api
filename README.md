# insane-openbazaar-api

[![Build Status](https://travis-ci.org/insanity54/insane-openbazaar-api.svg?branch=master)](https://travis-ci.org/insanity54/insane-openbazaar-api)

Openbazaar API client for Nodejs. WARNING: Incomplete implementation!!

## Installation

  

## Usage

```js
// include the module
var OpenBazaarAPI = require('insane-openbazaar-api');

// create a new instance
var ob = new OpenBazaarAPI({
  "username": "chris_grimmett", // the username to your openbazaar server
  "password": "rosebud"         // the password to your openbazaar server
});

// log into your openbazaar server
ob.login(function(err) {
  if (err) throw err;

  // get your openbazaar profile description
  ob.profile(function(err, reply) {
    if (err) throw err;
    console.log(reply.profile.short_description);

    // get someone else's profile
    ob.profile(function('a06aa22a38f0e62221ab74464c311bd88305f88c', err, reply) {
      if (err) throw err;
      console.log(reply.profile.website);
    });
  });
});

```


### Convenience methods

`ob.login` and `ob.profile` are simple wrappers to the OpenBazaar-Server API endpoints. You have to make sure that your app is logged into the OpenBazaar-Server before you can call `ob.profile`. If the OpenBazaar-Server restarts while your API client is running, your past authentication cookies are invalidated and you have to log in again. This means you have to write extra code to check the state of your login, which can be annoying. To make your job easier, I've made a convenience method for getting information from the API. Just call it and expect a response. Calling .get() will ensure that you have a valid authentication cookie and you're able to receive information from the API.

```js
ob.get('profile', 'a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, reply) {
  if (err) throw err;
  console.log(reply.profile.handle);
});
```



## Implemented API

* [x] /api/v1/login
* [x] /api/v1/profile





## Roadmap

* [ ] instead of having curl write the headers file to `headers.txt`, use child_process to send said headers to memory.
      save the headers in `ob.headers` so multiple instances of insane-openbazaar-api class can be running and connected
      to separate OpenBazaar-Servers.
* [ ] use [request.js](https://npmjs.org/package/request) instead of calling curl through child_process
