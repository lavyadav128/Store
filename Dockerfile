FROM node:20-bullseye-slim

# FFmpeg uses this font to render the daily motivational quote onto each Reel.
RUN apt-get update && apt-get install -y --no-install-recommends fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

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

CMD ["npm", "run", "start", "--prefix", "back"]
