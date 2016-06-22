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


# Confirm Order [/api/v1/confirm_order]

## Confirm Order [POST]

+ Attributes
    + id (string) - string of the order to confirm
    + payout_address (string) - bitcoin address the seller wants to rec funds at

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        id=f4942393f5d3b9b53b4b58e00f65b9afc7576c74&payout_address=n1t7Dp6EPrdj7UHZiQsKWic9qWYUYpLcXC

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true
        }



# Complete Order [/api/v1/complete_order]

## Complete Order [POST]

+ Attributes
    + id (string) - string of the order to complete

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        id=f4942393f5d3b9b53b4b58e00f65b9afc7576c74

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true
        }


# Set Settings [/api/v1/settings]

## Set Settings [POST]

+ Attributes
    + refund_address (string) - BTC refund address of the user
    + currency_code (string) - Local currency of the user
    + country (string) - Local country of the user
    + language (string) - Local language of the user
    + time_zone (number) - Local timezone of the user. UTC offset
    + notifications (boolean) - whether or not to send desktop notifications
    + shipping_addresses (array)
    + blocked (array) - blocked GUIDs
    + terms_conditions (string) - default terms and conditions for listings
    + refund_policy (string) - default refund policy for listings
    + moderators (array) - list of moderators for user's store
    + smtp_notifications (boolean) - whether or not to send email alerts
    + smtp_server (string) - smtp server address
    + smtp_recipient (string) - email address to send notifications to
    + smtp_username (string) - username for smtp alerts
    + smtp_password (string) - password for smtp alerts

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
8
    + Body
        id=f4942393f5d3b9b53b4b58e00f65b9afc7576c74

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true
        }


# Images [/api/v1/get_image]

## Retrieve image [GET]

+ Request Unauthorized no auth cookie
+ Response 404


+ Request Authorized with auth cookie, but no parameters sent
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 404 (text/html)
    + Headers
        HTTP/1.1 404 Not Found
        Transfer-Encoding: chunked
        Date: Thu, 09 Jun 2016 13:16:18 GMT
        Content-Type: text/html; charset=utf-8
        Server: TwistedWeb/16.1.0
    + Body
        <html>
          <head><title>404 - No Such Resource</title></head>
          <body>
            <h1>No Such Resource</h1>
            <p>Sorry. No luck finding that resource.</p>
          </body>
        </html>



# Owner's Profile [/api/v1/profile]

Retrieve the user's profile


## Retrieve Owner's Profile [GET]

+ Request Authorized with auth cookie
    + Headers
        Content-Type: application/x-www-form-urlencoded
        Accept: */*
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

+ Request without authentication cookie
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



## Sales List [/api/v1/get_sales]

## Retrieve List of Sales [GET]

+ Request
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 200 (application/json)
    + Headers
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
    + Body
        [
          {
              "status": 3,
              "description": "blah blah blah",
              "title": "(10 Piece) WS2812 +WIZARD+SQUARES+ RGB LED BLACK PCB Module Light 5V",
              "order_id": "5e6846513e4e3fbfc7b7760990d4104edbdc4f7d",
              "timestamp": 1461164874.994542,
              "contract_type": "physical good",
              "btc_total": 0.01897378,
              "buyer": "@bluray",
              "thumbnail_hash": "f605e3c11ec57ab590bb25070065ed1706b36efb"
          },
          {
              "status": 2,
              "description": "blah^3",
              "title": "SanDisk 8GB 8 GB Cruzer Blade USB 2.0Micro Pen Flash Drive SDCZ50-008G",
              "order_id": "002f0baf55de5f1c580e0d11b058798c655dea74",
              "timestamp": 1462591842.708922,
              "contract_type": "physical good",
              "btc_total": 0.0129361,
              "buyer": "839a83989a389a9389a93993a9398a398a8939a9",
              "thumbnail_hash": "464f799ef5cce8a7a4073a608ba3b9a8e11eee5e"
          }
        ]




# Get Settings [/api/v1/settings]

## Get Settings [GET]

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "seed": "78dff934280575994a0724ac33c7b3c4bc55fba9d3685e16f6181408aa5ef802",
            "smtp_sender": "",
            "smtp_server": "",
            "libbitcoin_server": null,
            "transaction_fee": 15000,
            "blocked_guids": [
                ""
            ],
            "smtp_password": "",
            "smtp_notifications": false,
            "refund_address": "2N8QBVWJjNbKPKHFXDYMmLQiwBbqaQZHJ97",
            "refund_policy": "No refund policy",
            "shipping_addresses": [
                ""
            ],
            "resolver": "https://resolver.onename.com/",
            "terms_conditions": "No terms or conditions",
            "smtp_recipient": "",
            "language": "en-US",
            "notifications": true,
            "country": "UNITED_STATES",
            "network_connection": "Restricted",
            "time_zone": "-8",
            "moderators": [],
            "smtp_username": "",
            "currency_code": "BTC"
        }




## Get Notifications [/api/v1/get_notifications]

## Get current user's notifications [GET]

+ Request
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 200 (application/json)
    + Headers
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
    + Body
        { notifications:
       [ { image_hash: '18796a43305ac227f6d605dbb78b99420406e19b',
           title: 'lil fecker 2016',
           read: false,
           timestamp: 1466450069,
           order_id: 'f4942393f5d3b9b53b4b58e00f65b9afc7576c74',
           handle: '',
           guid: '63306363323763376635613439316263396166336636316463336661396330393261303635613665',
           type: 'order confirmation',
           id: 'd8ee879dd2785dfd7de23cbdcabf579150272fcd' },
         { image_hash: '18796a43305ac227f6d605dbb78b99420406e19b',
           title: 'lil fecker 2016',
           read: true,
           timestamp: 1466123355,
           order_id: 'f4942393f5d3b9b53b4b58e00f65b9afc7576c74',
           handle: '',
           guid: 'c0cc27c7f5a491bc9af3f61dc3fa9c092a065a6e',
           type: 'payment received',
           id: '527bb9d3942df143935c7bebf2a07f0c5514aebc' } ],
      unread: 1 }




## Get Chat Messages [/api/v1/get_chat_messages]

## Retrieve Chat messages given a GUID [GET]

+ Request
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 200 (application/json)
    + Headers
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
    + Body
        [
          "yeah",
          "cool"
        ]






# NoSuchResource

+ Model (text/html)

    <html>
      <head><title>404 - No Such Resource</title></head>
      <body>
        <h1>No Such Resource</h1>
        <p>Sorry. No luck finding that resource.</p>
      </body>
    </html>
