FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV CHROME_PATH=/usr/bin/chromium-browser
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV DISPLAY=:99
ENV CHROME_HEADLESS=true

COPY package*.json ./
RUN npm ci --only=production

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]