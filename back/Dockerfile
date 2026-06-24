FROM node:20

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && apt-get clean

# Install yt-dlp as a system binary (more reliable than npm package)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN pip3 install faster-whisper --break-system-packages
RUN python3 -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]

