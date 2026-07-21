# SAFECITY

Red Inteligente y Colaborativa de Seguridad Ciudadana — MVP.

Monorepo gestionado con **pnpm** + **Turborepo**. Backend en **NestJS** (monolito modular),
frontend en **Next.js** (App Router, PWA).

> La especificación oficial del proyecto vive en `docs/` (Bloques A, B y C: análisis,
> casos de uso y arquitectura). Todo el código debe respetar esa especificación; cualquier
> desviación se documenta como ADR en `docs/decisions/`.

## Estructura

```
SAFECITY/
├── apps/
│   ├── backend/        # NestJS — monolito modular (Auth, Users, Reports, Maps,
│   │                   # Favorites, Notifications, Confirmations, Reputation, Admin,
│   │                   # Analytics, Shared)
│   └── frontend/       # Next.js App Router — PWA pública + Dashboard Admin
│
├── packages/
│   ├── shared-types/   # Enums/tipos TypeScript compartidos (UserRole, ReportStatus)
│   ├── shared-config/  # Prettier + TSConfig base compartidos (ver ADR-001 sobre ESLint)
│   └── ui/             # Componentes reutilizables (vacío en el MVP)
│
├── docs/                 # Especificación oficial + decisiones técnicas (ADRs)
├── docker/                # Dockerfiles y compose de desarrollo
├── scripts/               # Scripts de conveniencia
├── docker-compose.yml     # Stack completo (Postgres + Redis + backend + frontend)
└── turbo.json
```

## Requisitos previos

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm` si no lo tienes)
- Docker y Docker Compose

## Arranque rápido (stack completo en contenedores)

```bash
git clone <url-del-repositorio>
cd SAFECITY
docker compose up -d --build
```

Esto levanta:
- PostgreSQL en `localhost:5432`
- Redis en `localhost:6379`
- Backend NestJS en `http://localhost:3001/api/v1`
- Frontend Next.js en `http://localhost:3000`

Verifica que todo esté funcionando:
- `http://localhost:3001/api/v1/health` → `{"status":"ok", ...}`
- `http://localhost:3001/api/docs` → Swagger UI
- `http://localhost:3000` → debe mostrar "API conectada — safecity-backend (ok)"

**Nota sobre la base de datos en este modo:** el contenedor `backend` no ejecuta
migraciones automáticamente. La primera vez, aplica el esquema manualmente:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

## Arranque para desarrollo (hot-reload)

Para iterar módulo por módulo con recarga en caliente, en lugar de reconstruir
imágenes Docker en cada cambio:

```bash
./scripts/dev-up.sh          # levanta solo Postgres + Redis
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.local.example apps/frontend/.env.local
pnpm install
pnpm --filter @safecity/backend prisma:migrate
pnpm --filter @safecity/backend prisma:seed
pnpm dev                     # backend en :3001, frontend en :3000, vía Turborepo
```

## Scripts comunes (raíz del monorepo)

| Comando | Descripción |
|---|---|
| `pnpm dev` | Backend + frontend en modo desarrollo (Turborepo) |
| `pnpm build` | Build de producción de ambas apps |
| `pnpm lint` | Lint de ambas apps (cada una con su config oficial — ver ADR-001) |
| `pnpm test` | Tests unitarios de ambas apps |
| `pnpm db:migrate` | Aplica migraciones de Prisma (backend) |
| `pnpm db:seed` | Pobla datos de configuración base (ciudad, localidades piloto, tipos de incidente) |
| `pnpm db:studio` | Abre Prisma Studio |

## Variables de entorno

Ver `apps/backend/.env.example` y `apps/frontend/.env.local.example`. Nunca se
versionan los archivos `.env`/`.env.local` reales (ver `.gitignore`).

## Documentación

- `docs/decisions/` — Architecture Decision Records (ADRs) que documentan desviaciones
  o aclaraciones puntuales sobre la especificación oficial (Bloques A/B/C).
