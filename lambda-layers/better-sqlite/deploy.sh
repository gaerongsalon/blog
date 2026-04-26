#!/bin/bash

set -euo pipefail

source "${HOME}/.nvm/nvm.sh"
nvm install 24.15.0
nvm use 24.15.0

LAMBDA_LAYER_IMAGE="${LAMBDA_LAYER_IMAGE:-public.ecr.aws/lambda/nodejs:24}"
AWS_REGION="${AWS_REGION:-ap-northeast-2}"

rm -rf nodejs node_modules layer.zip && mkdir -p nodejs
docker run --rm --platform linux/amd64 --entrypoint /bin/bash \
  -v "${PWD}:/var/task" \
  -w /var/task \
  "${LAMBDA_LAYER_IMAGE}" \
  -lc "npm ci --omit=dev"
docker run --rm --platform linux/amd64 --entrypoint /bin/bash \
  -v "${PWD}:/var/task" \
  -w /var/task \
  "${LAMBDA_LAYER_IMAGE}" \
  -lc "chown -R $(id -u):$(id -g) node_modules"
mv node_modules nodejs
zip -qr layer.zip nodejs

aws lambda publish-layer-version \
  --region "${AWS_REGION}" \
  --layer-name better-sqlite3 \
  --zip-file fileb://./layer.zip \
  --compatible-runtimes nodejs24.x \
  --compatible-architectures x86_64 \
  "$@"
