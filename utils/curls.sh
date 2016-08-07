#!/bin/bash

# This is an example of the request format that OpenBazaar-Server accepts



: "${OB_USERNAME:?OB_USERNAME required in env}"
: "${OB_PASSWORD:?OB_PASSWORD required in env}"
: "${OB_PROTO:?OB_PROTO required in env}"
: "${OB_PORT:?OB_PORT required in env}"
: "${OB_HOST:?OB_HOST required in env}"

sep='##'
function heading() {
    echo -e "\n\n\n$sep\n$sep $1\n$sep"
}



heading "(POST) login"
curl \
    --data "username=$OB_USERNAME&password=$OB_PASSWORD" \
    --dump-header ../blobs/test.headers.login \
    --trace ../blobs/test.trace.login \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/login


heading "(GET) get_notifications"
curl \
    -L \
    -b ../blobs/test.headers.login \
    --dump-header ../blobs/test.headers.get_notifications \
    --trace ../blobs/test.trace.get_notifications \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/get_notifications


heading "(GET) get_image"
curl \
    -L \
    -b ../blobs/test.headers.login \
    --dump-header ../blobs/test.headers.get_image \
    --trace ../blobs/test.trace.get_image \
    -o ../blobs/test.image.png \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/get_image?hash=6a37f9f18b1d064debc5908f84153124fc220e0c


heading "(POST) follow"
curl \
    -L \
    -b ../blobs/test.headers.login \
    -X POST \
    --data "guid=a06aa22a38f0e62221ab74464c311bd88305f88c" \
    --dump-header ../blobs/test.headers.follow \
    --trace ../blobs/test.trace.follow \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/follow


heading "(DELETE) social_accounts"
curl \
    -L \
    -b ../blobs/test.headers.login \
    -X DELETE \
    --data "account_type=twitter" \
    --dump-header ../blobs/test.headers.social_accounts \
    --trace ../blobs/test.trace.social_accounts \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/social_accounts
