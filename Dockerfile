# -----------------------------
# 1. BUILD STAGE
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Inject token for private GitHub Packages
ARG NPM_TOKEN
RUN echo "@j3r3mcdev:registry=https://npm.pkg.github.com" >> .npmrc \
    && echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc

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

# Inject token again (needed for npm ci --omit=dev)
ARG NPM_TOKEN
RUN echo "@j3r3mcdev:registry=https://npm.pkg.github.com" >> .npmrc \
    && echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc

# Copier uniquement le build
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./

# Installer uniquement les deps de prod
RUN npm ci --omit=dev

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:7777/health || exit 1

# Exposer le port interne
EXPOSE 7777

# Entrypoint
CMD ["node", "dist/index.js"]
