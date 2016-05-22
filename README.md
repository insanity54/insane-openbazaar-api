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

### GET requests

* [ ] /api/v1/get_image
* [x] /api/v1/profile
* [ ] /api/v1/get_listings
* [ ] /api/v1/get_followers
* [ ] /api/v1/get_following
* [ ] /api/v1/settings
* [ ] /api/v1/get_notifications
* [ ] /api/v1/get_chat_messages
* [ ] /api/v1/get_chat_conversations
* [ ] /api/v1/contracts
* [ ] /api/v1/shutdown
* [x] /api/v1/get_sales
* [ ] /api/v1/get_purchases
* [ ] /api/v1/connected_peers
* [ ] /api/v1/routing_table
* [ ] /api/v1/get_order
* [ ] /api/v1/get_cases
* [ ] /api/v1/order_messages
* [ ] /api/v1/get_ratings
* [ ] /api/v1/btc_price


### POST requests

* [x] /api/v1/login
* [ ] /api/v1/follow
* [ ] /api/v1/unfollow
* [ ] /api/v1/profile
* [ ] /api/v1/social_accounts
* [ ] /api/v1/contracts
* [ ] /api/v1/make_moderator
* [ ] /api/v1/unmake_moderator
* [ ] /api/v1/purchase_contract
* [ ] /api/v1/confirm_order
* [ ] /api/v1/upload_image
* [ ] /api/v1/complete_order
* [ ] /api/v1/settings
* [ ] /api/v1/mark_notification_as_read
* [ ] /api/v1/broadcast
* [ ] /api/v1/mark_chat_message_as_read
* [ ] /api/v1/check_for_payment
* [ ] /api/v1/dispute_contract
* [ ] /api/v1/close_dispute
* [ ] /api/v1/release_funds
* [ ] /api/v1/refund
* [ ] /api/v1/mark_discussion_as_read


### DELETE requests

* [ ] /api/v1/social_accounts
* [ ] /api/v1/contracts
* [ ] /api/v1/chat_conversation


## Roadmap

* [ ] implement full [API](https://github.com/OpenBazaar/OpenBazaar-Server/blob/master/api/restapi.py)
  * Note: this is kind of a pipe dream. I, [insanity54](https://github.com/insanity54), do not plan on creating a full implementation. I only plan on implementing specific endpoints that I need for my own projects. If you want to see a specific endpoint implemented, feel free to open an issue for it. If it's an endpoint I plan on implementing, I just might write it in. Otherwise, feel free to contribute if you want to see something I'm not planning on doing myself.


## Development Notes

(Because I forget!)

I'm using node [foreman](https://www.npm.js/package/foreman) to set environment variables. I keep a `.env` file with environment variables; it is ignored by git and not in this repository.

I'm using [Drakov](https://www.npmjs.com/package/drakov) in testing to mock OpenBazaar-Server API responses. API mocks are defined in `spec.md` and use the [API Blueprint](https://apiblueprint.org/) format.

I wrote the tests to be flexible with server mocking. I test two different ways. One is running Drakov in the foreground.

Drakov runs in the foreground in a second terminal--

    drakov -f ./spec.md -p 3000 --watch

And in my main terminal, I run `nf mocha`

I do this while I develop locally so I can see that Drakov is responding to the API queries as expected during the mocha tests.

I can also test against a live openbazaar server, by these environment variables in `.env`

    OB_USERNAME=chris_grimmett
    OB_PASSWORD=rosebud
    OB_HOST=192.168.1.24
    OB_PORT=18469
    #OB_LIVE_TEST=1

The OB_LIVE_TEST is what tells the mocha test to run against a live OpenBazaar server. I just comment or uncomment that line depending on what type of test I want to run.
