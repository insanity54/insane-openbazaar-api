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

# Check For Payment [/api/v1/check_for_payment]

## Check For Payment [POST]

+ Attributes
    + order_id (string) - string of the order to check

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        order_id=2006247e6d2d49c5d960dcaa1c0305e387577607

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true
        }



# Broadcast [/api/v1/broadcast]

## Send A Broadcast [POST]

+ Attributes
    + message (string) - message to send to followers

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        message=thankyouverymuch

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true,
            "peers reached": 5
        }




# Mark Chat Message As Read [/api/v1/mark_chat_message_as_read]

## Mark a chat as read [POST]

+ Attributes
    + guid (string) - message guid to be marked as read

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        guid=fe35be5ec8c07d07e347d7003021bdfa8630ca2f

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true
        }






# Dispute Contract [/api/v1/dispute_contract]

## Dispute a Contract [POST]

+ Attributes
    + order_id (string) - order id in which to open dispute

+ Request Unauthorized (application/x-www-form-urlencoded)

+ Response 404


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        order_id=4d2a90ddb7ef5298bd8edfa627c18580914dfc85

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
    + Body
        id=f4942393f5d3b9b53b4b58e00f65b9afc7576c74

+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true
        }


# Mark Notification As Read [/api/v1/mark_notification_as_read]

## Mark Notification As Read [POST]

+ Attributes
    + id (string) - the ID of the notification to mark read

+ Request Authorized with auth cookie
    + Headers
        Content-Type: application/x-www-form-urlencoded
        Accept: */*
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        id=d8ee879dd2785dfd7de23cbdcabf579150272fcd

+ Response 200 (application/json)
    + Headers
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
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
    + Headers
        Content-Type: application/x-www-form-urlencoded
        Accept: */*
+ Response 401 (text/html)
    + Headers
        Date: Fri, 13 May 2016 23:59:58 GMT
        Content-Type: text/html
        Server: TwistedWeb/16.1.0
        Set-Cookie: TWISTED_SESSION=bffa6254e7a747b57b6309af77e1c4bf; Path=/
    + Body
        <html><body><div><span style="color:red">Authorization Error</span></div><h2>Permission Denied</h2></body></html>





## Set Owner's Profile [POST]

+ Attributes
    + profile (object) - profile object to set as new profile

+ Request without authentication cookie (application/x-www-form-urlencoded)
    + Headers
        Content-Type: application/x-www-form-urlencoded
        Accept: */*
    + Body
        name=Sunshine%20Martian&location=UNITED_STATES

+ Response 401 (text/html)
    + Headers
        Date: Fri, 13 May 2016 23:59:58 GMT
        Content-Type: text/html
        Server: TwistedWeb/16.1.0
        Set-Cookie: TWISTED_SESSION=bffa6254e7a747b57b6309af77e1c4bf; Path=/
    + Body
        <html><body><div><span style="color:red">Authorization Error</span></div><h2>Permission Denied</h2></body></html>


+ Request Authorized (application/x-www-form-urlencoded)
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Body
        name=Sunshine%20Martian&location=UNITED_STATES


+ Response 200 (application/json)
    + Headers
        Set-Cookie:
    + Body
        {
            "success": true
        }




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




# Get Notifications [/api/v1/get_notifications]

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






# Get Chat Messages [/api/v1/get_chat_messages]

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




# Get list of followers [/api/v1/get_followers]

+ Parameters
    + guid (string) - ID of the openbazaar profile to find followers of
    + start (number) - follower number at which to start showing followers lsit

## Get followers list [GET]

+ Request Authorized with no params
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
                "count": 2,
                "followers": [
                    {
                        "handle": "",
                        "name": "Jewelry",
                        "nsfw": false,
                        "short_description": "A Bazaar Is Open. ",
                        "avatar_hash": "a28d2f979b2325640fa88ae4acf3967c2aca1599",
                        "guid": "d97cffbba4dfb38bfcdb6192e6ed0db6d33d242a"
                    },
                    {
                        "handle": "",
                        "name": "Bike Store",
                        "nsfw": true,
                        "short_description": "Do you like bikes? Do you like to purchase cool bike related apparel and equipment? ",
                        "avatar_hash": "0f52078d6a9eaa9f040d10a5eabc4038268a01e6",
                        "guid": "d6c982d6dd72d5a65614d424a9fb497406e7197c"
                    }
                ]
            }


+ Request Authorized and with guid
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8
    + Parameters
        guid=a06aa22a38f0e62221ab74464c311bd88305f88c

+ Response 200 (application/json)
    + Headers
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
    + Body
        {
            "count": 20,
            "followers": [
                {
                    "handle": "",
                    "name": "Jewelry",
                    "nsfw": false,
                    "short_description": "A Bazaar Is Open. ",
                    "avatar_hash": "a28d2f979b2325640fa88ae4acf3967c2aca1599",
                    "guid": "d97cffbba4dfb38bfcdb6192e6ed0db6d33d242a"
                },
                {
                    "handle": "",
                    "name": "Bike Store",
                    "nsfw": true,
                    "short_description": "Do you like bikes? Do you like to purchase cool bike related apparel and equipment? ",
                    "avatar_hash": "0f52078d6a9eaa9f040d10a5eabc4038268a01e6",
                    "guid": "d6c982d6dd72d5a65614d424a9fb497406e7197c"
                },
                {
                    "handle": "",
                    "name": "HFX-Deals",
                    "nsfw": false,
                    "short_description": "Clearance sunglasses",
                    "avatar_hash": "7ab98dfe3de789fed5efadfdeb28ee6a54fb5a34",
                    "guid": "d3a43e67c8418dffdbf8fb623727baa9d55ac676"
                },
                {
                    "handle": "",
                    "name": "GiftCards4BTC",
                    "nsfw": false,
                    "short_description": "We strive to provide every customer with the experience  that meets all their needs.",
                    "avatar_hash": "8dab19a30eb4d695118cdc61ec15352d3e2d4c54",
                    "guid": "e22ec68c9428ee525667a848c40c16d1d205a7cc"
                },
                {
                    "handle": "@rhythmandsounds",
                    "name": "obhgfob6rqz66i4v6mqvs6mvx6r",
                    "nsfw": false,
                    "short_description": "Rhythm And Sounds finds unique pieces of history and makes them available to the world.",
                    "avatar_hash": "a2f24ce02c0db00ffe06072b18760eeda08c694d",
                    "guid": "e4c4e217f73f104712bc9c81b08262639d98a943"
                },
                {
                    "handle": "",
                    "name": "{Bargains for Bitcoin}",
                    "nsfw": false,
                    "short_description": "Searching for something specific, we may be able to find it, just ask. We purchase e-gift codes in bulk and pass the savings onto you.",
                    "avatar_hash": "c70a1dcdaa23c9db3971abbbee7d99772898fb94",
                    "guid": "796094be19f0bcf4d1fbc401021a2390b330c155"
                },
                {
                    "handle": "",
                    "name": "Electric Bikes store",
                    "nsfw": false,
                    "short_description": "Folding Electric Bikes. Hybrid technologies",
                    "avatar_hash": "71938cb7a8c9a29f9041f5576f17a67de936a6bf",
                    "guid": "d39052c3c4887d4d2dc6a630dc7a28b977c171af"
                },
                {
                    "handle": "",
                    "name": "ob9bd3fushid358zedo73gi7ldi",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "",
                    "guid": "d8d968badcd7906fd875648c4bcdcdcec3fbf8d8"
                },
                {
                    "handle": "",
                    "name": "Trader Joe's",
                    "nsfw": false,
                    "short_description": "selling a lenovo w530",
                    "avatar_hash": "",
                    "guid": "c06bec8ee15cb3a8d1fb5bd3ec6f6607c6ebbfde"
                },
                {
                    "handle": "",
                    "name": "BazaarCity.io",
                    "nsfw": false,
                    "short_description": "BazaarCity.io offers easy, fast and reliable OpenBazaar Hosting and a free Moderation Service.",
                    "avatar_hash": "5920b60f25011dd4b3329df48e4340508bdcb0b2",
                    "guid": "948923d1e92c3e956cecfb7536fe5969f37cfcfb"
                },
                {
                    "handle": "",
                    "name": "Satoshi_Island",
                    "nsfw": true,
                    "short_description": "Eliquid - CBD - Vaporizers ",
                    "avatar_hash": "b9ad98e667b17572c808234072d04d6120f947ed",
                    "guid": "bf11c24d42fdd513625a48d8d08e6bfca1c43604"
                },
                {
                    "handle": "",
                    "name": "Berkey Water Filters",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "7cdf1ed866b1eb8ff5fc235216f7735e5e51fb48",
                    "guid": "81be65a677f024f9037c5cfbe5cf1d695dac4a59"
                },
                {
                    "handle": "",
                    "name": "Bitcoin Stickers &amp; Such",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "11071853f734fe20dda57084d10ea9daf3758434",
                    "guid": "cd10361fc205a9bf538d1936a5b66eb376bde1b5"
                },
                {
                    "handle": "@bitcoinbazar",
                    "name": "Bitcoin Bazar",
                    "nsfw": false,
                    "short_description": "High Quality &amp; Low Cost \"Self Help / How To\" Guides",
                    "avatar_hash": "ce2705b58e0ee2fc6842537e10a5dc4eb91e49dd",
                    "guid": "293eb9d6542d81e6e6e7fe4386a390e7eb767f8b"
                },
                {
                    "handle": "",
                    "name": "obj1ku00v8ifwler0sgk00sh5mi",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "",
                    "guid": "2afd8f6ac0d46d622c2b4102b5cd3f2dd1be4653"
                },
                {
                    "handle": "",
                    "name": "TPi",
                    "nsfw": false,
                    "short_description": "wertewandeln &amp; handeln",
                    "avatar_hash": "54d216b68356f120771a4a6d5e9922a7dadef1fe",
                    "guid": "a3ef1b88293c321eddf179421cfc3255a6476755"
                },
                {
                    "handle": "@cmosthestore",
                    "name": "Cmos the Store",
                    "nsfw": false,
                    "short_description": "Simply the best!",
                    "avatar_hash": "8d1281c49fe1fedfd37beef3454bde30b1aab414",
                    "guid": "074265875f569b33b68dbee6834d1c4fd2438fa0"
                },
                {
                    "handle": "",
                    "name": "OstrichEgg",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "b6b7767d5623b44a6d24469e84965e1c5a34d2dc",
                    "guid": "88996ff882957925162b9776092c6f2260950c01"
                },
                {
                    "handle": "",
                    "name": "Brunswick Biltong",
                    "nsfw": true,
                    "short_description": "Traditional South African Biltong made in Nelson New Zealand. Check out brunswickbiltong.com ",
                    "avatar_hash": "30215972a7dcabf2e0638d0ed785e7939dd14bf0",
                    "guid": "5c666d7603e587b1cfddd2f80b18b8cf7771cb10"
                },
                {
                    "handle": "@buyerprotection",
                    "name": "Buyer Protection",
                    "nsfw": false,
                    "short_description": "FREE 24/7 MOD, LIMITED TIME. Offer buyers peace of mind with our Buyer Protection program.",
                    "avatar_hash": "a130f5363bf797bd388a0e215010f1132ae6ac78",
                    "guid": "dcbfcec25dab4360e033caa8b27c3233a286e663"
                }
            ]
        }



+ Request Authorized with guid and start params
    + Parameters
        guid=a06aa22a38f0e62221ab74464c311bd88305f88c&start=5
    + Headers
        Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8

+ Response 200 (application/json)
    + Headers
        Date: Thu, 12 May 2016 07:11:41 GMT
        Content-Type: application/json
        Server: TwistedWeb/16.1.0
    + Body
        {
            "count": 20,
            "followers": [
                {
                    "handle": "",
                    "name": "Jewelry",
                    "nsfw": false,
                    "short_description": "A Bazaar Is Open. ",
                    "avatar_hash": "a28d2f979b2325640fa88ae4acf3967c2aca1599",
                    "guid": "d97cffbba4dfb38bfcdb6192e6ed0db6d33d242a"
                },
                {
                    "handle": "",
                    "name": "Bike Store",
                    "nsfw": true,
                    "short_description": "Do you like bikes? Do you like to purchase cool bike related apparel and equipment? ",
                    "avatar_hash": "0f52078d6a9eaa9f040d10a5eabc4038268a01e6",
                    "guid": "d6c982d6dd72d5a65614d424a9fb497406e7197c"
                },
                {
                    "handle": "",
                    "name": "HFX-Deals",
                    "nsfw": false,
                    "short_description": "Clearance sunglasses",
                    "avatar_hash": "7ab98dfe3de789fed5efadfdeb28ee6a54fb5a34",
                    "guid": "d3a43e67c8418dffdbf8fb623727baa9d55ac676"
                },
                {
                    "handle": "",
                    "name": "GiftCards4BTC",
                    "nsfw": false,
                    "short_description": "We strive to provide every customer with the experience  that meets all their needs.",
                    "avatar_hash": "8dab19a30eb4d695118cdc61ec15352d3e2d4c54",
                    "guid": "e22ec68c9428ee525667a848c40c16d1d205a7cc"
                },
                {
                    "handle": "@rhythmandsounds",
                    "name": "obhgfob6rqz66i4v6mqvs6mvx6r",
                    "nsfw": false,
                    "short_description": "Rhythm And Sounds finds unique pieces of history and makes them available to the world.",
                    "avatar_hash": "a2f24ce02c0db00ffe06072b18760eeda08c694d",
                    "guid": "e4c4e217f73f104712bc9c81b08262639d98a943"
                },
                {
                    "handle": "",
                    "name": "{Bargains for Bitcoin}",
                    "nsfw": false,
                    "short_description": "Searching for something specific, we may be able to find it, just ask. We purchase e-gift codes in bulk and pass the savings onto you.",
                    "avatar_hash": "c70a1dcdaa23c9db3971abbbee7d99772898fb94",
                    "guid": "796094be19f0bcf4d1fbc401021a2390b330c155"
                },
                {
                    "handle": "",
                    "name": "Electric Bikes store",
                    "nsfw": false,
                    "short_description": "Folding Electric Bikes. Hybrid technologies",
                    "avatar_hash": "71938cb7a8c9a29f9041f5576f17a67de936a6bf",
                    "guid": "d39052c3c4887d4d2dc6a630dc7a28b977c171af"
                },
                {
                    "handle": "",
                    "name": "ob9bd3fushid358zedo73gi7ldi",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "",
                    "guid": "d8d968badcd7906fd875648c4bcdcdcec3fbf8d8"
                },
                {
                    "handle": "",
                    "name": "Trader Joe's",
                    "nsfw": false,
                    "short_description": "selling a lenovo w530",
                    "avatar_hash": "",
                    "guid": "c06bec8ee15cb3a8d1fb5bd3ec6f6607c6ebbfde"
                },
                {
                    "handle": "",
                    "name": "BazaarCity.io",
                    "nsfw": false,
                    "short_description": "BazaarCity.io offers easy, fast and reliable OpenBazaar Hosting and a free Moderation Service.",
                    "avatar_hash": "5920b60f25011dd4b3329df48e4340508bdcb0b2",
                    "guid": "948923d1e92c3e956cecfb7536fe5969f37cfcfb"
                },
                {
                    "handle": "",
                    "name": "Satoshi_Island",
                    "nsfw": true,
                    "short_description": "Eliquid - CBD - Vaporizers ",
                    "avatar_hash": "b9ad98e667b17572c808234072d04d6120f947ed",
                    "guid": "bf11c24d42fdd513625a48d8d08e6bfca1c43604"
                },
                {
                    "handle": "",
                    "name": "Berkey Water Filters",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "7cdf1ed866b1eb8ff5fc235216f7735e5e51fb48",
                    "guid": "81be65a677f024f9037c5cfbe5cf1d695dac4a59"
                },
                {
                    "handle": "",
                    "name": "Bitcoin Stickers &amp; Such",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "11071853f734fe20dda57084d10ea9daf3758434",
                    "guid": "cd10361fc205a9bf538d1936a5b66eb376bde1b5"
                },
                {
                    "handle": "@bitcoinbazar",
                    "name": "Bitcoin Bazar",
                    "nsfw": false,
                    "short_description": "High Quality &amp; Low Cost \"Self Help / How To\" Guides",
                    "avatar_hash": "ce2705b58e0ee2fc6842537e10a5dc4eb91e49dd",
                    "guid": "293eb9d6542d81e6e6e7fe4386a390e7eb767f8b"
                },
                {
                    "handle": "",
                    "name": "obj1ku00v8ifwler0sgk00sh5mi",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "",
                    "guid": "2afd8f6ac0d46d622c2b4102b5cd3f2dd1be4653"
                },
                {
                    "handle": "",
                    "name": "TPi",
                    "nsfw": false,
                    "short_description": "wertewandeln &amp; handeln",
                    "avatar_hash": "54d216b68356f120771a4a6d5e9922a7dadef1fe",
                    "guid": "a3ef1b88293c321eddf179421cfc3255a6476755"
                },
                {
                    "handle": "@cmosthestore",
                    "name": "Cmos the Store",
                    "nsfw": false,
                    "short_description": "Simply the best!",
                    "avatar_hash": "8d1281c49fe1fedfd37beef3454bde30b1aab414",
                    "guid": "074265875f569b33b68dbee6834d1c4fd2438fa0"
                },
                {
                    "handle": "",
                    "name": "OstrichEgg",
                    "nsfw": false,
                    "short_description": "",
                    "avatar_hash": "b6b7767d5623b44a6d24469e84965e1c5a34d2dc",
                    "guid": "88996ff882957925162b9776092c6f2260950c01"
                },
                {
                    "handle": "",
                    "name": "Brunswick Biltong",
                    "nsfw": true,
                    "short_description": "Traditional South African Biltong made in Nelson New Zealand. Check out brunswickbiltong.com ",
                    "avatar_hash": "30215972a7dcabf2e0638d0ed785e7939dd14bf0",
                    "guid": "5c666d7603e587b1cfddd2f80b18b8cf7771cb10"
                },
                {
                    "handle": "@buyerprotection",
                    "name": "Buyer Protection",
                    "nsfw": false,
                    "short_description": "FREE 24/7 MOD, LIMITED TIME. Offer buyers peace of mind with our Buyer Protection program.",
                    "avatar_hash": "a130f5363bf797bd388a0e215010f1132ae6ac78",
                    "guid": "dcbfcec25dab4360e033caa8b27c3233a286e663"
                }
            ]
        }

+ Request Unauthorized without cookie
    + Headers
        Content-Type: application/x-www-form-urlencoded
        Accept: */*

+ Response 401 (text/html)
    + Headers
        Date: Fri, 13 May 2016 23:59:58 GMT
        Content-Type: text/html
        Server: TwistedWeb/16.1.0
        Set-Cookie: TWISTED_SESSION=bffa6254e7a747b57b6309af77e1c4bf; Path=/
    + Body
        <html><body><div><span style="color:red">Authorization Error</span></div><h2>Permission Denied</h2></body></html>


## Delete Social Accounts [/api/v1/social_accounts]

## Delete user's social account given a type [DELETE]

+ Request Authorized with cookie
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
        {"success": true}


+ Request Unauthorized without cookie
    + Headers
        Content-Type: application/x-www-form-urlencoded
        Accept: */*


+ Response 401 (text/html)
    + Headers
        Date: Fri, 13 May 2016 23:59:58 GMT
        Content-Type: text/html
        Server: TwistedWeb/16.1.0
        Set-Cookie: TWISTED_SESSION=bffa6254e7a747b57b6309af77e1c4bf; Path=/
    + Body
        <html><body><div><span style="color:red">Authorization Error</span></div><h2>Permission Denied</h2></body></html>



# NoSuchResource

+ Model (text/html)

    <html>
      <head><title>404 - No Such Resource</title></head>
      <body>
        <h1>No Such Resource</h1>
        <p>Sorry. No luck finding that resource.</p>
      </body>
    </html>
