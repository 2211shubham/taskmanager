# backend/Dockerfile

# ── Stage 1: Install dependencies ──────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# ✅ ci = reproducible installs (uses package-lock.json exactly)
RUN npm ci --only=production

# ── Stage 2: Run tests ─────────────────────────
FROM node:20-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src/ ./src/
RUN npm test

# ── Stage 3: Production image ──────────────────
FROM node:20-alpine AS production
WORKDIR /app

# ✅ Non-root user (critical for security)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production deps from stage 1
COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/
COPY package.json ./

# ✅ Switch to non-root before running
USER appuser

EXPOSE 3000

# ✅ Use exec form (process gets PID 1, handles signals properly)
CMD ["node", "src/index.js"]