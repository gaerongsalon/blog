# @blog/aws

Shared S3 access utilities for the blog services.

## Key Paths

- `lib/S3.ts`: Common S3 storage interface.
- `lib/useS3.ts`: AWS SDK based implementation, including JSON helpers and presigned upload URLs.
- `lib/useS3cb.ts`: S3 cache bridge implementation for faster object access when configured.

## Usage

Import the implementation needed by the caller and pass bucket or cache bridge configuration from `@blog/config`.

