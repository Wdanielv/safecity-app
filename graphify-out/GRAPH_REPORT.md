# Graph Report - .  (2026-07-16)

## Corpus Check
- Corpus is ~14,062 words - fits in a single context window. You may not need a graph.

## Summary
- 860 nodes · 1241 edges · 71 communities (36 shown, 35 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.87)
- Token cost: 122,640 input · 0 output

## Community Hubs (Navigation)
- Reports Module (CRUD)
- App Bootstrap & Module Wiring
- Users Module (Profile/Admin)
- Auth Module (Login/JWT)
- Backend Scripts & Jest Config
- Backend NestJS Dependencies
- Localities Module
- Neighborhoods Module
- Frontend Bootstrap & Turbo Config
- Frontend TypeScript Config
- Reputation Module
- Root Monorepo Scripts
- Incident Types Controller & Roles
- Backend TypeScript Config
- Project Docs & Infra Config
- Incident Types DTOs & Module
- Shared TSConfig Base
- Frontend Dependencies
- Frontend Dev Dependencies
- Health Check Endpoint
- Create Incident Type DTO
- Shared Config Package Metadata
- Update Incident Type DTO
- Shared Types Package Metadata
- Backend Dev Dependencies (Types)
- PWA Manifest
- Shared Types TSConfig
- Backend Build TSConfig
- Incident Types Service Methods
- UI Package Metadata
- NestJS CLI Config
- Frontend Health Status Page
- Frontend Package Scripts
- Shared Enums (Status/Role)
- Frontend Package Metadata
- Prisma Seed Script
- ESLint Dependency (Backend)
- eslint-config-prettier Dependency
- eslintrc Dependency
- eslint-js Dependency
- eslint-plugin-prettier Dependency
- Jest Dependency
- NestJS CLI Dependency
- NestJS Schematics Dependency
- NestJS Testing Dependency
- Prettier Dependency (Backend)
- Prisma Dependency
- source-map-support Dependency
- Supertest Dependency
- ts-jest Dependency
- ts-loader Dependency
- ts-node Dependency
- tsconfig-paths Dependency
- @types/bcrypt Dependency
- @types/express Dependency
- @types/jest Dependency
- @types/node Dependency (Backend)
- @types/passport-jwt Dependency
- @types/passport-local Dependency
- typescript-eslint Dependency
- Frontend ESLint Config
- react-hook-form Dependency
- react-leaflet Dependency
- @types/node Dependency (Frontend)
- PostCSS Config
- PWA App Icons
- Service Worker (sw.js)
- Dev Environment Startup Script

## God Nodes (most connected - your core abstractions)
1. `PrismaService` - 34 edges
2. `compilerOptions` - 22 edges
3. `scripts` - 19 edges
4. `compilerOptions` - 17 edges
5. `CurrentUser` - 16 edges
6. `CreateIncidentTypeDto` - 16 edges
7. `compilerOptions` - 16 edges
8. `UpdateIncidentTypeDto` - 15 edges
9. `CreateReportDto` - 14 edges
10. `SearchIncidentTypeDto` - 13 edges

## Surprising Connections (you probably didn't know these)
- `docker-compose.dev.yml postgres service` --semantically_similar_to--> `docker-compose.yml postgres service`  [INFERRED] [semantically similar]
  docker/docker-compose.dev.yml → docker-compose.yml
- `docker-compose.dev.yml redis service` --semantically_similar_to--> `docker-compose.yml redis service`  [INFERRED] [semantically similar]
  docker/docker-compose.dev.yml → docker-compose.yml
- `NestJS Starter Boilerplate README` --conceptually_related_to--> `SAFECITY Monorepo`  [INFERRED]
  apps/backend/README.md → README.md
- `Next.js create-next-app Boilerplate README` --conceptually_related_to--> `SAFECITY Monorepo`  [INFERRED]
  apps/frontend/README.md → README.md
- `SAFECITY Monorepo` --references--> `pnpm Workspace Packages Config (apps/*, packages/*)`  [INFERRED]
  README.md → pnpm-workspace.yaml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **SAFECITY Docker Compose Stack** — docker_compose_postgres, docker_compose_redis, docker_compose_backend, docker_compose_frontend [INFERRED 0.85]
- **Per-Framework ESLint Strategy (ADR-001)** — docs_decisions_adr_001_eslint_independiente_por_app_decision, docs_decisions_adr_001_eslint_independiente_por_app_nestjs_cli_11, docs_decisions_adr_001_eslint_independiente_por_app_nextjs_16, docs_decisions_adr_001_eslint_independiente_por_app_shared_config_pkg [EXTRACTED 1.00]
- **CI Lint-Build-Test Pipeline** — github_workflows_ci_lint_build_test, pnpm_workspace_config, readme_postgis, readme_safecity [INFERRED 0.75]

## Communities (71 total, 35 thin omitted)

### Community 0 - "Reports Module (CRUD)"
Cohesion: 0.05
Nodes (52): CreateReportDto, ApiProperty, ApiPropertyOptional, IsOptional, IsString, IsUUID, Max, MaxLength (+44 more)

### Community 1 - "App Bootstrap & Module Wiring"
Cohesion: 0.05
Nodes (39): AppModule, Module, AuthenticatedUser, ConfirmationsController, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse (+31 more)

### Community 2 - "Users Module (Profile/Admin)"
Cohesion: 0.07
Nodes (36): ApiQuery, CurrentUser, AdminUpdateUserDto, ApiPropertyOptional, IsEnum, IsOptional, ChangePasswordDto, ApiProperty (+28 more)

### Community 3 - "Auth Module (Login/JWT)"
Cohesion: 0.06
Nodes (32): AuthController, ApiBearerAuth, ApiOperation, ApiTags, Body, Controller, Delete, Post (+24 more)

### Community 4 - "Backend Scripts & Jest Config"
Cohesion: 0.05
Nodes (40): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+32 more)

### Community 5 - "Backend NestJS Dependencies"
Cohesion: 0.05
Nodes (39): dependencies, bcrypt, class-transformer, class-validator, helmet, jsonwebtoken, @nestjs/common, @nestjs/config (+31 more)

### Community 6 - "Localities Module"
Cohesion: 0.08
Nodes (25): JwtAuthGuard, Injectable, LocalityResponseDto, ApiProperty, SearchLocalityDto, ApiPropertyOptional, IsInt, IsOptional (+17 more)

### Community 7 - "Neighborhoods Module"
Cohesion: 0.09
Nodes (26): NeighborhoodLocalityDto, NeighborhoodResponseDto, ApiProperty, SearchNeighborhoodDto, ApiPropertyOptional, IsInt, IsOptional, IsUUID (+18 more)

### Community 8 - "Frontend Bootstrap & Turbo Config"
Cohesion: 0.07
Nodes (25): metadata, viewport, ServiceWorkerRegistration(), nextConfig, ^build, .next/**, !.next/cache/**, dependsOn (+17 more)

### Community 9 - "Frontend TypeScript Config"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 10 - "Reputation Module"
Cohesion: 0.12
Nodes (16): ReputationResponseDto, ApiProperty, AuthenticatedUser, ReputationController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags (+8 more)

### Community 11 - "Root Monorepo Scripts"
Cohesion: 0.08
Nodes (24): description, devDependencies, prettier, turbo, engines, node, pnpm, prettier (+16 more)

### Community 12 - "Incident Types Controller & Roles"
Cohesion: 0.16
Nodes (16): Roles(), IncidentTypesController, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, Body (+8 more)

### Community 13 - "Backend TypeScript Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 14 - "Project Docs & Infra Config"
Cohesion: 0.11
Nodes (21): NestJS Starter Boilerplate README, Next.js create-next-app Boilerplate README, docker-compose.yml backend service, docker-compose.yml frontend service, docker-compose.yml postgres service, docker-compose.yml redis service, docker-compose.dev.yml postgres service, docker-compose.dev.yml redis service (+13 more)

### Community 15 - "Incident Types DTOs & Module"
Cohesion: 0.15
Nodes (13): ChangeIncidentTypeStatusDto, ApiProperty, IsBoolean, SearchIncidentTypeDto, ApiPropertyOptional, IsBoolean, IsInt, IsOptional (+5 more)

### Community 16 - "Shared TSConfig Base"
Cohesion: 0.10
Nodes (19): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, incremental, lib, module, moduleResolution (+11 more)

### Community 17 - "Frontend Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, @hookform/resolvers, leaflet, next, react, react-dom, @tanstack/react-query (+9 more)

### Community 18 - "Frontend Dev Dependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/leaflet, @types/react, @types/react-dom (+9 more)

### Community 19 - "Health Check Endpoint"
Cohesion: 0.23
Nodes (7): AppController, ApiOperation, ApiTags, Controller, Get, AppService, Injectable

### Community 20 - "Create Incident Type DTO"
Cohesion: 0.17
Nodes (12): CreateIncidentTypeDto, ApiProperty, ApiPropertyOptional, IsHexColor, IsInt, IsNotEmpty, IsOptional, IsString (+4 more)

### Community 21 - "Shared Config Package Metadata"
Cohesion: 0.17
Nodes (11): description, exports, ./prettier, ./tsconfig.base, files, main, name, private (+3 more)

### Community 22 - "Update Incident Type DTO"
Cohesion: 0.18
Nodes (11): ApiProperty, ApiPropertyOptional, IsHexColor, IsInt, IsNotEmpty, IsOptional, IsString, Max (+3 more)

### Community 23 - "Shared Types Package Metadata"
Cohesion: 0.18
Nodes (10): devDependencies, typescript, typescript, main, name, private, scripts, clean (+2 more)

### Community 24 - "Backend Dev Dependencies (Types)"
Cohesion: 0.22
Nodes (9): devDependencies, globals, @types/jsonwebtoken, @types/supertest, typescript, typescript, globals, @types/jsonwebtoken (+1 more)

### Community 25 - "PWA Manifest"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 26 - "Shared Types TSConfig"
Cohesion: 0.22
Nodes (8): compilerOptions, declaration, outDir, rootDir, extends, include, @safecity/shared-config/tsconfig.base, src

### Community 27 - "Backend Build TSConfig"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 29 - "UI Package Metadata"
Cohesion: 0.29
Nodes (6): description, main, name, private, types, version

### Community 30 - "NestJS CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 31 - "Frontend Health Status Page"
Cohesion: 0.40
Nodes (3): HealthResponse, HealthState, HealthStatus()

### Community 32 - "Frontend Package Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, clean, dev, lint, start

### Community 34 - "Frontend Package Metadata"
Cohesion: 0.50
Nodes (3): name, private, version

## Ambiguous Edges - Review These
- `PostgreSQL + PostGIS` → `docker-compose.yml postgres service`  [AMBIGUOUS]
  docker-compose.yml · relation: references
- `PostgreSQL + PostGIS` → `docker-compose.dev.yml postgres service`  [AMBIGUOUS]
  docker/docker-compose.dev.yml · relation: references

## Knowledge Gaps
- **274 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+269 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `PostgreSQL + PostGIS` and `docker-compose.yml postgres service`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `PostgreSQL + PostGIS` and `docker-compose.dev.yml postgres service`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `PrismaService` connect `App Bootstrap & Module Wiring` to `Reports Module (CRUD)`, `Users Module (Profile/Admin)`, `Auth Module (Login/JWT)`, `Localities Module`, `Neighborhoods Module`, `Reputation Module`, `Incident Types DTOs & Module`, `Incident Types Service Methods`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `Users Module (Profile/Admin)` to `Reports Module (CRUD)`, `App Bootstrap & Module Wiring`, `Reputation Module`, `Auth Module (Login/JWT)`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `JwtAuthGuard` connect `Localities Module` to `Reports Module (CRUD)`, `App Bootstrap & Module Wiring`, `Users Module (Profile/Admin)`, `Auth Module (Login/JWT)`, `Neighborhoods Module`, `Reputation Module`, `Incident Types DTOs & Module`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _274 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Reports Module (CRUD)` be split into smaller, more focused modules?**
  _Cohesion score 0.05136986301369863 - nodes in this community are weakly interconnected._