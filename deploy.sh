#!/bin/bash

set -euxo pipefail

TARGET="${1:-"pages"}"
SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

nvm use 12

if [ "${TARGET}" = "pages" ]; then
  echo "Deploy pages"
  pushd "${SCRIPT_PATH}/pages"
    source .envrc && yarn && yarn build && yarn deploy
  popd
  pushd "${SCRIPT_PATH}/api"
    yarn && yarn deploy -f serveHtml
  popd

elif [ "${TARGET}" = "api" ]; then
  echo "Deploy api"
  pushd "${SCRIPT_PATH}/api"
    yarn && yarn deploy
  popd

else
  echo "Deploy all"
  pushd "${SCRIPT_PATH}/pages"
    source .envrc && yarn && yarn build && yarn deploy
  popd
  pushd "${SCRIPT_PATH}/api"
    yarn && yarn deploy
  popd

fi

