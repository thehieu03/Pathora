# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Build ----
FROM base AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build args → env vars available at build time
ARG NEXT_PUBLIC_API_GATEWAY
ENV NEXT_PUBLIC_API_GATEWAY=$NEXT_PUBLIC_API_GATEWAY

ARG NEXT_PUBLIC_REMOTE_IMAGE_HOSTS
ENV NEXT_PUBLIC_REMOTE_IMAGE_HOSTS=$NEXT_PUBLIC_REMOTE_IMAGE_HOSTS

ARG NEXT_PUBLIC_IMAGES_UNOPTIMIZED
ENV NEXT_PUBLIC_IMAGES_UNOPTIMIZED=$NEXT_PUBLIC_IMAGES_UNOPTIMIZED

# Produce standalone output for smaller image
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Production ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
