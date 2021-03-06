#!/bin/bash

set -euxo pipefail

SERVE_PAGES_DIR="pages"
SERVE_DIR=".webpack/serveHtml"

PNGQUANT_JPEGOPTIM_FILE=".external/exodus-pngquant-jpegoptim-bundle.tgz"
OPTIMIZE_IMAGE_DIR=".webpack/optimizeImage"

# Step 1. Serve HTML
if [ -d "${SERVE_DIR}" ]; then
  # Static files would be served via CDN.
  rm -rf "${SERVE_PAGES_DIR}/static"
  cp -r "${SERVE_PAGES_DIR}" "${SERVE_DIR}"
  echo "Add ${SERVE_PAGES_DIR} to ${SERVE_DIR}"
else
  echo "Skip because ${SERVE_DIR} doesn't exist."
fi

# Step 2. pdftoppm
if [ -d "${OPTIMIZE_IMAGE_DIR}" ]; then
  cp "${PNGQUANT_JPEGOPTIM_FILE}" "${OPTIMIZE_IMAGE_DIR}"
  echo "Add ${PNGQUANT_JPEGOPTIM_FILE} to ${OPTIMIZE_IMAGE_DIR}"
else
  echo "Skip because ${OPTIMIZE_IMAGE_DIR} doesn't exist."
fi
