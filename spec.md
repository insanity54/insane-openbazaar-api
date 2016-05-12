FORMAT: 1A

# OpenBazaar

OpenBazaar API allows consumers to interact with an OpenBazaar-Server


# OpenBazaar Root [/api/v1/]

## Group API

## OpenBazaar Login [/api/v1/login]

Log in to the OpenBazaar API server


### Log in [POST]

+ Response 200 (application/json)
    + Headers
          Date: Thu, 12 May 2016 07:06:46 GMT
          Content-Length: 17
          Content-Type: application/json
          Server: TwistedWeb/16.1.0
          Set-Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8; Path=/
    + Body
        {
            "success": true
        }

+ Parameters
    + username: boygeorge (required, string) - username to log into the openbazaar server as
    + password: rosebud (required, number) - password to use to log into the openbazaar server


## OpenBazaar Profile [/api/v1/profile]

Retrieve the user's profile or a profile on the network

### Retrieve Profile [GET]

+ Response 200 (application/json)
    + Headers
        Transfer-Encoding: chunked
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
    + Body
        {
        "profile": {
            "website": "http://grimtech.net",
            "public_key": "5f8894ebeaa3d1f7cc6d4dbfabd8a637977e74bda6f9c3460e36a4d40b177430",
            "about": "<p>A store for small consumer and hobbyist electronics.</p><p>I've been an eBay seller for over a decade. Seeing overwhelming positive feedback from my customers makes me happy, and it's good for business. I guarantee satisfaction, and if you have any issues with an item you purchases from me, please let me know and I will make it right.</p>",
            "guid": "d47eea06209d3da8dc10937399a9cf1c3dd4dca4",
            "vendor": true,
            "name": "Save-A-Bit",
            "social_accounts": {
                "twitter": {
                    "username": "@saveabit",
                    "proof_url": ""
                }
            },
            "header_hash": "fb96afacf1d126133bda03fd8511caa9e0b3e6a9",
            "secondary_color": 1776411,
            "moderation_fee": 0.0,
            "moderator": false,
            "text_color": 16777215,
            "pgp_key": "",
            "nsfw": false,
            "location": "UNITED_STATES",
            "avatar_hash": "b3f879f8b8c1e898f6bbc418be6a83026e7e3f73",
            "short_description": "A store for small consumer and hobbyist electronics",
            "handle": "@saveabit",
            "primary_color": 4341011,
            "background_color": 16166683,
            "email": "saveabit@grimtech.net"
        }