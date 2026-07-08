# syntax=docker/dockerfile:1

# ---------- Etapa 1: dependencias y build ----------
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/shared-config/package.json ./packages/shared-config/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/ui/package.json ./packages/ui/package.json

RUN pnpm install --frozen-lockfile --filter @safecity/frontend...

COPY packages/shared-config ./packages/shared-config
COPY packages/shared-types ./packages/shared-types
COPY apps/frontend ./apps/frontend

ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /workspace/apps/frontend
RUN npm run build

# ---------- Etapa 2: runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY --from=builder /workspace/apps/frontend/public ./public
COPY --from=builder /workspace/apps/frontend/.next ./.next
COPY --from=builder /workspace/apps/frontend/node_modules ./node_modules
COPY --from=builder /workspace/apps/frontend/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
