# Base image resmi Playwright dengan semua browser engine (Chromium, Firefox, WebKit) dan OS dependencies terpasang
FROM mcr.microsoft.com/playwright:v1.63.0-jammy

WORKDIR /app

# Copy dependency definition
COPY package*.json ./

# Install dependencies (production) & ensure browser binary
RUN npm ci --only=production && npx playwright install chromium

# Salin seluruh source code dan session
COPY . .

# Environment variables default
ENV PORT=3500
ENV HEADLESS=true
ENV NODE_ENV=production

# Expose port
EXPOSE 3500

# Jalankan server remote judge daemon
CMD ["node", "src/server.js"]
