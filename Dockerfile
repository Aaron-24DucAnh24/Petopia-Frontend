# syntax=docker/dockerfile:1

# --- Dependencies ------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
# Cypress is only used for local e2e tests; skip its ~500 MB binary download.
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json package-lock.json ./
RUN npm ci

# --- Build -------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# NEXT_PUBLIC_* values are inlined into the client bundle by `next build`, so
# they must be known at build time, not at container start.
ARG NEXT_PUBLIC_API_ENDPOINT=""
ARG NEXT_PUBLIC_CHAT_API_ENDPOINT=""
ARG NEXT_PUBLIC_CKEDITOR_LICENSE="GPL"
ENV NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT \
    NEXT_PUBLIC_CHAT_API_ENDPOINT=$NEXT_PUBLIC_CHAT_API_ENDPOINT \
    NEXT_PUBLIC_CKEDITOR_LICENSE=$NEXT_PUBLIC_CKEDITOR_LICENSE \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Runtime -----------------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# Standalone output: server.js plus only the node_modules it needs.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
