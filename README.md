# insane-openbazaar-api

[![Build Status](https://travis-ci.org/insanity54/insane-openbazaar-api.svg?branch=master)](https://travis-ci.org/insanity54/insane-openbazaar-api)

Openbazaar API client for Nodejs.

## Installation



## Usage

```js
// include the module
var OpenBazaarAPI = require('insane-openbazaar-api');

// create a new instance
var ob = new OpenBazaarAPI({
  "username": "chris_grimmett", // the username to your openbazaar server
  "password": "rosebud",        // the password to your openbazaar server
  "proto": "https",             // optional. defaults to http
  "host" : "localhost",         // optional. defaults to 127.0.0.1
  "port" : "18469"              // optional. defaults to 18469
});

// log into your openbazaar server
ob.login(function(err, code, body) {
  if (err) throw err;

  // get your openbazaar profile description
  ob.get_profile(function(err, code, body) {
    if (err) throw err;
    console.log(body.profile.short_description);

    // get someone else's profile
    ob.get_profile({'guid': 'a06aa22a38f0e62221ab74464c311bd88305f88c'}, function(err, code, body) {
      if (err) throw err;
      console.log(body.profile.website);
    });
  });
});

```



## Implemented API

### GET requests

* [x] /api/v1/get_image
* [x] /api/v1/profile
* [x] /api/v1/get_listings
* [x] /api/v1/get_followers
* [x] /api/v1/get_following
* [x] /api/v1/settings
* [x] /api/v1/get_notifications
* [x] /api/v1/get_chat_messages
* [x] /api/v1/get_chat_conversations
* [x] /api/v1/contracts
* [x] /api/v1/shutdown
* [x] /api/v1/get_sales
* [x] /api/v1/get_purchases
* [x] /api/v1/connected_peers
* [x] /api/v1/routing_table
* [x] /api/v1/get_order
* [x] /api/v1/get_cases
* [x] /api/v1/order_messages
* [x] /api/v1/get_ratings
* [x] /api/v1/btc_price


### POST requests

* [x] /api/v1/login
* [x] /api/v1/follow
* [x] /api/v1/unfollow
* [x] /api/v1/profile
* [x] /api/v1/social_accounts
* [x] /api/v1/contracts
* [x] /api/v1/make_moderator
* [x] /api/v1/unmake_moderator
* [x] /api/v1/purchase_contract
* [x] /api/v1/confirm_order
* [x] /api/v1/upload_image
* [x] /api/v1/complete_order
* [x] /api/v1/settings
* [x] /api/v1/mark_notification_as_read
* [x] /api/v1/broadcast
* [x] /api/v1/mark_chat_message_as_read
* [x] /api/v1/check_for_payment
* [x] /api/v1/dispute_contract
* [ ] /api/v1/close_dispute
* [ ] /api/v1/release_funds
* [ ] /api/v1/refund
* [ ] /api/v1/mark_discussion_as_read


### DELETE requests

* [x] /api/v1/social_accounts
* [ ] /api/v1/contracts
* [ ] /api/v1/chat_conversation


## Roadmap

* [ ] implement full [API](https://github.com/OpenBazaar/OpenBazaar-Server/blob/master/api/restapi.py)


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

When Travic-CI runs the test, `TRAVIS` is set in the environment. Mocha sees this environment variable, and calls Drakov from within the test.


### Troubleshooting

#### Cannot POST

If you get something like "Cannot POST /api/v1/login" in the body of the response from Drakov or OpenBazaar-Server, it means your request isn't matching the OpenBazaar-Server spec (see spec.md). Maybe you aren't sending the username and password as a querystring in the body? Maybe you are sending the wrong username and password? (Drakov requires username:test password:test.) See `blobs/example-curl-trace.txt` for an example of how a good request looks. You can also use the node module, `request-debug` to see what your request is sending.


#### [Error: socket hang up]

If you get the above error when trying to use the API against a live OpenBazaar-Server, check your server configuration. If SSL is enabled on your OpenBazaar-Server, but you have your API set to use HTTP, you will see the above error. In your API environment variables, add `OB_PROTO=https`


#### Error: Hostname/IP doesn't match certificate's altnames: "IP: xxx.xxx.xxx.xxx is not in the cert's list:

If you followed the OpenBazaar team's guide on [setting up SSL](https://slack-files.com/T02FPGBKB-F0XK9ND2Q-fc5e6500a3), that guide doesn't have you pay any attention to seting SSL CA names, localities, etc. Because of that, your CA has no altnames, which node uses to check and see if it is talking to the correct server. To get past this error in a secure fashion, you will need to create a new SSL certificate with a subjectAltName (SAN). See https://wiki.cacert.org/FAQ/subjectAltName
