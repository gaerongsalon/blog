# @blog/imaging

Image processing utilities for uploaded blog images. The package deduplicates uploads, resizes images to configured widths, optimizes JPEG and PNG files, stores outputs in S3, and records optimized image keys.

## Key Paths

- `lib/processImage.ts`: End-to-end upload processing flow.
- `lib/resizeAndOptimize.ts`: Resize plus format-specific optimization.
- `lib/resizeImage.ts`: Sharp-based resizing.
- `lib/jpegoptim.ts` and `lib/pngquant.ts`: External optimizer wrappers.
- `lib/useImageDb.ts`: S3 JSON image index protected by a Redis lock.

## Notes

Runtime image optimization depends on the Sharp Lambda layer and the external optimizer bundle packaged with the API function.

