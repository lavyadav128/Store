#!/usr/bin/env bash
# Build script for Render / Railway / Linux cloud servers
set -o errexit

echo "📦 Installing project dependencies..."
npm install --prefix back
npm install --prefix dash

# Store cache in Render persistent storage and install Chrome
export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
echo "🌐 Installing Chrome for Puppeteer..."
npx --prefix back puppeteer browsers install chrome || true

# If running on Debian/Ubuntu with apt available, install Chrome system libraries
if command -v apt-get &> /dev/null; then
  echo "🐧 Installing system Chrome libraries..."
  apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 ffmpeg || true
fi

echo "✅ Build completed successfully."
