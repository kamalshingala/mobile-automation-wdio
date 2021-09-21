#!/bin/bash

set -euo pipefail
ENV=${1:-SIT}
OS=${2:-ANDROID}
DEVICETYPE=${3:-REAL}
CLOUDSERVICE="SAUCE"

ENV_LOWER=$(echo "$ENV" | tr '[:upper:]' '[:lower:]')
OS_LOWER=$(echo "$OS" | tr '[:upper:]' '[:lower:]')
DEVICE_LOWER=$(echo "$DEVICETYPE" | tr '[:upper:]' '[:lower:]')
CLOUDSERVICE_LOWER=$(echo "$CLOUDSERVICE" | tr '[:upper:]' '[:lower:]')

if [[ $DEVICE_LOWER == "real" ]]
then
    DEVICE_LOWER="rdc"
else
    DEVICE_LOWER="virtual"
fi

SCRIPTNAME="${OS_LOWER}.${CLOUDSERVICE_LOWER}.${DEVICE_LOWER}.app"

echo "Running tests in SauceLabs"
SCRIPTNAME=${SCRIPTNAME//$'\n'/}
# Override the `set -e` defined at the top of the file.
# set +e
# docker run --env TESTENV=${ENV} -v $(pwd):/app -v ~/.npmrc/:/root/.npmrc -w /app node:10-alpine /bin/sh -c "npm install && npm run $SCRIPTNAME"
# Capture the exit status   
# TESTS_EXIT_STATUS=$?

# exit $TESTS_EXIT_STATUS