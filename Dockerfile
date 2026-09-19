FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN npm install --global pnpm@11.3.0
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/client/package.json apps/client/package.json
COPY apps/server/package.json apps/server/package.json
COPY packages/shared packages/shared
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm --filter @mern/server deploy --prod /runtime

FROM node:24-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app/server
COPY --from=build --chown=node:node /runtime ./
COPY --from=build --chown=node:node /app/apps/client/dist /app/client/dist
USER node
EXPOSE 3001
CMD ["node", "dist/index.js"]
