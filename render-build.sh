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

# If running on Debian/Ubuntu with apt available, install or extract Chrome system libraries
if command -v apt-get &> /dev/null; then
  echo "🐧 Installing system Chrome libraries..."
  apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 chromium ffmpeg || true
fi

# Download and extract Debian packages locally into back/vendor/libs (requires NO sudo/root)
mkdir -p back/vendor/libs
cd back/vendor/libs
if command -v apt-get &> /dev/null; then
  echo "📥 Extracting shared libraries to local vendor directory..."
  apt-get download libnspr4 libnss3 libatk1.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 2>/dev/null || true
  for deb in *.deb; do
    if [ -f "$deb" ]; then
      dpkg -x "$deb" . 2>/dev/null || true
      rm -f "$deb"
    fi
  done
fi
cd ../../..

echo "✅ Build completed successfully."
