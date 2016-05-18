FORMAT: 1A

# OpenBazaar

OpenBazaar API allows consumers to interact with an OpenBazaar-Server



# Login [/api/v1/login]

Log in to the OpenBazaar API server


## Login [POST]

+ Attributes
    + username (string) - username to log into the openbazaar server as
    + password (string) - password to use to log into the openbazaar server

+ Request (application/x-www-form-urlencoded)
    + Body
        username=test&password=test

+ Response 200 (application/json)
    + Headers
          Set-Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8; Path=/
    + Body
        {
            "success": true
        }


# Owner's Profile [/api/v1/profile]

Retrieve the user's profile


## Retrieve Owner's Profile [GET]

+ Request Authorized with auth cookie
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 200 (application/json)
    + Headers
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
      }

+ Request Unauthorized without auth cookie

+ Response 401 (text/html)
    + Headers
        Date: Fri, 13 May 2016 23:59:58 GMT
        Content-Type: text/html
        Server: TwistedWeb/16.1.0
        Set-Cookie: TWISTED_SESSION=bffa6254e7a747b57b6309af77e1c4bf; Path=/
    + Body
        <html><body><div><span style="color:red">Authorization Error</span></div><h2>Permission Denied</h2></body></html>


## Network Profile [/api/v1/profile{?guid}]

+ Parameters
    + guid (string) - ID of the openbazaar profile to look up

## Retrieve Network Profile [GET]

+ Request
    + Parameters
        guid=a06aa22a38f0e62221ab74464c311bd88305f88c
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 200 (application/json)
    + Headers
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
    + Body
        {
          "profile": {
            "website": "https://openbazaar.org/",
            "public_key": "42741d5d3a87140c4b850078ec2b625504ee3a711657e42531f5978e4fcf53fd",
            "about": "<h2>Trade free.</h2><p>OpenBazaar is a decentralized network for trade with no fees and no restrictions.</p><p>Trade happens directly between peers.<i> No middleman</i>.</p><p>If you want to show support for the core developers who built OpenBazaar, check out our products for sale in the store tab.</p>",
            "guid": "a06aa22a38f0e62221ab74464c311bd88305f88c",
            "vendor": true,
            "name": "OpenBazaar",
            "social_accounts": {
              "twitter": [
                null
              ],
              "facebook": [
                null
              ]
            },
            "header_hash": "5f858909c8304c03d00dd27fe525321cff03c52a",
            "secondary_color": 3362410,
            "moderation_fee": 0,
            "moderator": false,
            "text_color": 16777215,
            "pgp_key": "",
            "nsfw": false,
            "location": "UNITED_STATES",
            "avatar_hash": "55456e9efbafb5139977d1f86313eaac3293a88b",
            "short_description": "Trade free.",
            "handle": "@openbazaar",
            "primary_color": 4285834,
            "background_color": 1846074,
            "email": "project@openbazaar.org"
          }
        }

+ Request Unauthorized without auth cookie

+ Response 401 (text/html)
    + Headers
        Date: Fri, 13 May 2016 23:59:58 GMT
        Content-Type: text/html
        Server: TwistedWeb/16.1.0
        Set-Cookie: TWISTED_SESSION=bffa6254e7a747b57b6309af77e1c4bf; Path=/
    + Body
        <html><body><div><span style="color:red">Authorization Error</span></div><h2>Permission Denied</h2></body></html>
