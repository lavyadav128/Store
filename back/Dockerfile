FROM node:20

RUN apt-get update && apt-get install -y \
    python3 python3-pip ffmpeg \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && apt-get clean

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN pip3 install faster-whisper --break-system-packages
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]