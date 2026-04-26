# @blog/redis

Redis connection and lock helpers used by backend packages.

## Key Paths

- `lib/getCacheOrConnectNew.ts`: Short-lived Redis connection cache.
- `lib/redisAcquireLock.ts`: Token-based lock acquisition with retry.
- `lib/redisReleaseLock.ts`: Lock release with token validation.
- `lib/withRedisLock.ts`: Runs work while a lock is held.
- `lib/useRedisLock.ts`: Convenience wrapper built from config.
- `lib/withRedisConnection.ts`: Runs work with a cached Redis connection.

## Usage

Use locks around S3-backed mutable documents to avoid concurrent overwrite races.

