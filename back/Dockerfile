# Use Node image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "index.js"]