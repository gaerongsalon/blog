# @blog/jsondb

Small JSON document store built on the shared S3 interface.

## Key Paths

- `lib/useS3JsonDb.ts`: Reads, writes, and edits JSON documents under S3 keys derived from logical database IDs.

## Usage

Use this package for small coordination documents such as image indexes. It is not a replacement for the article SQLite database.

