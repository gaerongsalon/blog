# sharp-lambda-layer

Builds and publishes the `sharp` native dependency as an AWS Lambda layer for Node.js 24 on x86_64.

## Key Paths

- `package.json`: Layer dependency manifest.
- `deploy.sh`: Docker-based build and `aws lambda publish-layer-version` command.
- `nodejs/` and `layer.zip`: Generated layer artifacts.

## Commands

```sh
npm run deploy
```

Set `AWS_REGION` or `LAMBDA_LAYER_IMAGE` to override the defaults. Publish with the deployment AWS profile already selected in the environment.

