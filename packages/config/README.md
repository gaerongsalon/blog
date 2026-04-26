# @blog/config

Typed access to local blog metadata and secret configuration.

## Key Paths

- `lib/metadata.ts`: Exports typed public metadata from `metadata.json`.
- `lib/secrets.ts`: Exports typed private runtime settings from `secrets.json`.
- `metadata.example.json`: Template for public blog metadata.
- `secrets.example.json`: Template for private deployment settings.

## Notes

Real `metadata.json`, `secrets.json`, and local binary assets are operator-owned deployment inputs. Do not commit real secrets.

