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
    --dump-header ./blobs/test.headers.login \
    --trace ./blobs/test.trace.login \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/login



heading "(GET) get_image"
curl \
    -L \
    -b ./blobs/test.headers.login \
    --dump-header ./blobs/test.headers.get_image \
    --trace ./blobs/test.trace.get_image \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/get_image



heading "(POST) follow"
curl \
    -L \
    -b ./blobs/test.headers.login \
    -X POST \
    --data "guid=a06aa22a38f0e62221ab74464c311bd88305f88c" \
    --dump-header ./blobs/test.headers.follow \
    --trace ./blobs/test.trace.follow \
    $OB_PROTO://$OB_HOST:$OB_PORT/api/v1/follow
