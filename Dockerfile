ARG NODE_IMAGE=node:24.18.1-bookworm-slim@sha256:235600a8101ab264e117b1768e925532262668dc9b581ef1dd7d96ced463b8e7

FROM ${NODE_IMAGE} AS dependencies
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global pnpm@11.24.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
ARG NEXT_PUBLIC_BASE_PATH=/daily-trending
ARG NEXT_PUBLIC_APP_URL=https://test.wanniangqianxian.com/daily-trending
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH} \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_BAIDU_ID="" \
    NEXT_PUBLIC_GOOGLE_ID="" \
    NEXT_PUBLIC_CLARITY_ID="" \
    NEXT_PUBLIC_ICP="" \
    NEXT_PUBLIC_GONGAN="" \
    NEXT_PUBLIC_ENABLE_SITE_VERIFICATION=false \
    NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=false
COPY . .
RUN pnpm build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ARG NEXT_PUBLIC_BASE_PATH=/daily-trending
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH} \
    NEXT_PUBLIC_BAIDU_ID="" \
    NEXT_PUBLIC_GOOGLE_ID="" \
    NEXT_PUBLIC_CLARITY_ID="" \
    NEXT_PUBLIC_ICP="" \
    NEXT_PUBLIC_GONGAN="" \
    NEXT_PUBLIC_ENABLE_SITE_VERIFICATION=false \
    NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=false \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=8s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000' + process.env.NEXT_PUBLIC_BASE_PATH + '/manifest.json', {signal: AbortSignal.timeout(5000)}).then(async r => process.exit(r.ok && (await r.json()).name ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "server.js"]
