FROM node:20-bullseye-slim

# Install latest Chrome system dependencies & FFmpeg for Google Gemini Automation & Reels
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    ffmpeg \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install back and dash dependencies
COPY package*.json ./
COPY back/package*.json ./back/
COPY dash/package*.json ./dash/

RUN npm install --prefix back
RUN npm install --prefix dash

COPY . .

# Build frontend dashboard
RUN npm run build --prefix dash || true

EXPOSE 5000 3000

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

CMD ["npm", "run", "start", "--prefix", "back"]
