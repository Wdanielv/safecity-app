#!/usr/bin/env bash
set -euo pipefail

# Arranca la infraestructura de datos (Postgres + Redis) para desarrollo local
# y deja instrucciones para levantar backend/frontend con hot-reload.

cd "$(dirname "$0")/.."

echo "Levantando PostgreSQL y Redis..."
docker compose -f docker/docker-compose.dev.yml up -d

echo ""
echo "Infraestructura lista. Próximos pasos:"
echo "  1. cp apps/backend/.env.example apps/backend/.env   (si no existe aún)"
echo "  2. cp apps/frontend/.env.local.example apps/frontend/.env.local   (si no existe aún)"
echo "  3. pnpm install"
echo "  4. pnpm --filter @safecity/backend prisma:migrate"
echo "  5. pnpm --filter @safecity/backend prisma:seed"
echo "  6. pnpm dev   (levanta backend y frontend con hot-reload vía Turborepo)"
