#!/usr/bin/env bash
# Build script for Render / Railway / Linux cloud servers
set -o errexit

echo "📦 Installing project dependencies..."
npm install --prefix back
npm install --prefix dash

# If running on Ubuntu/Debian with apt available, try installing Chrome system libraries
if command -v apt-get &> /dev/null; then
  echo "🐧 Linux detected with apt-get, installing Chrome graphical dependencies..."
  apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 || true
fi

echo "✅ Build completed successfully."
