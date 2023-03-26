#!/bin/bash

set -euxo pipefail

if [ ! -f "package.json" ]; then
  npm init -y
  npm i --save sharp
else
  npm i
fi

rm -rf nodejs && mkdir -p nodejs
mv node_modules nodejs
zip -r layer.zip nodejs

aws lambda publish-layer-version --layer-name sharp --zip-file fileb://./layer.zip --compatible-runtimes nodejs18.x
