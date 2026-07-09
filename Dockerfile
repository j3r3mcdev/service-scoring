# -----------------------------
# 1. BUILD STAGE
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Copier le code source
COPY . .

# Build TypeScript
RUN npm run build


# -----------------------------
# 2. RUNNER STAGE
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copier uniquement le build
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Installer uniquement les deps de prod
RUN npm ci --omit=dev

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Exposer le port
EXPOSE 3000

# Entrypoint
CMD ["node", "dist/index.js"]
