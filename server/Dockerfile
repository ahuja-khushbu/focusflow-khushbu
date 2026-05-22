FROM node:20-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends libcurl4 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY vitest.config.js ./
RUN npm ci --omit=dev

COPY src/ ./src/

EXPOSE 5000
CMD ["node", "src/server.js"]
