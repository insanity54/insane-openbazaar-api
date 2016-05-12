FORMAT: 1A

# OpenBazaar

OpenBazaar API allows consumers to interact with an OpenBazaar-Server


# OpenBazaar root [/api/v1/]


## OpenBazaar Login [/api/v1/login]

Log in to the OpenBazaar API server


## Log in [POST]

+ Response 200 (application/json)
    + Headers
          Set-Cookie: TWISTED_SESSION=afeafefa838afae8fae838a938ae83a8; Path=/
    + Body
        {
            "success": true
        }

+ Parameters
    + username: boygeorge (required, string) - username to log into the openbazaar server as
    + password: rosebud (required, number) - password to use to log into the openbazaar server


### Vote on a Choice [POST]

This action allows you to vote on a question's choice.

+ Response 201
    + Headers
            Location: /questions/1


## OpenBazaar Profile [/api/v1/profile]

Retrieve the user's profile or a profile on the network
