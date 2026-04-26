#!/bin/bash

set -euo pipefail

TARGET="${1:-"pages"}"
SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

source "${HOME}/.nvm/nvm.sh"
nvm install 24.15.0
nvm use 24.15.0
corepack enable
pnpm i

if [ "${TARGET}" = "pages" ]; then
  echo "Deploy pages"
  pushd "${SCRIPT_PATH}/apps/pages"
    source .envrc && pnpm run build && pnpm run deploy
  popd
  pushd "${SCRIPT_PATH}/apps/api"
    pnpm i && pnpm exec serverless deploy function --function serveHtml
  popd

elif [ "${TARGET}" = "api" ]; then
  echo "Deploy api"
  pushd "${SCRIPT_PATH}/apps/api"
    pnpm run deploy
  popd

else
  echo "Deploy all"
  pushd "${SCRIPT_PATH}/apps/pages"
    source .envrc && pnpm run build && pnpm run deploy
  popd
  pushd "${SCRIPT_PATH}/apps/api"
    pnpm run deploy
  popd

fi
