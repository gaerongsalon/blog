# @blog/sqlite

Helpers for using a SQLite database file stored in S3.

## Key Paths

- `lib/useS3Sqlite.ts`: Downloads a database file to local temp storage and uploads it after writes.
- `lib/getSqliteDatabase.ts`: Opens a local `better-sqlite3` database and creates tables when needed.
- `lib/putSqliteDatabase.ts`: Uploads non-empty local database files.
- `lib/withSqliteDatabase.ts`: Runs work with automatic cleanup and optional commit.
- `lib/closeSqliteDatabase.ts`: Closes the database and removes the temp file.
- `lib/SqliteDatabase.ts` and `lib/RunResult.ts`: Shared type aliases.

## Notes

Article data uses this package through the API handlers. Back up the S3 database object before operations that can overwrite it.

