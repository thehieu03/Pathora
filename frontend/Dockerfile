# Stage 1: Base
FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Stage 2: Dependencies
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with better caching
RUN npm ci --legacy-peer-deps

# Stage 3: Builder
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args → env vars
ARG NEXT_PUBLIC_API_GATEWAY
ENV NEXT_PUBLIC_API_GATEWAY=$NEXT_PUBLIC_API_GATEWAY

ARG NEXT_PUBLIC_REMOTE_IMAGE_HOSTS
ENV NEXT_PUBLIC_REMOTE_IMAGE_HOSTS=$NEXT_PUBLIC_REMOTE_IMAGE_HOSTS

ARG NEXT_PUBLIC_IMAGES_UNOPTIMIZED
ENV NEXT_PUBLIC_IMAGES_UNOPTIMIZED=$NEXT_PUBLIC_IMAGES_UNOPTIMIZED

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 4: Runner - Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_GATEWAY=http://localhost:8080
ENV NEXT_PUBLIC_REMOTE_IMAGE_HOSTS=cdn3.ivivu.com

# Create non-root user
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

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
