# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4173
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

# The Node entry point currently runs TypeScript through `tsx`, so the runtime
# keeps the reproducible dependency tree and server source from the build stage.
# Once the server is compiled to JavaScript, copy only that artifact, `dist`,
# and production dependencies here.
COPY --from=build --chown=node:node /app ./

USER node
EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" >/dev/null || exit 1

CMD ["npm", "run", "start"]
