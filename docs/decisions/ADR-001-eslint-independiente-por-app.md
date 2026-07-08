# ADR-001 — ESLint independiente por aplicación

## Estado
Aceptado (Fase 1).

## Contexto
El Bloque C (especificación oficial) propone `packages/shared-config` con ESLint, Prettier
y TSConfig compartidos. Al generar `apps/backend` con el Nest CLI 11 y `apps/frontend` con
`create-next-app` (Next.js 16), ambos frameworks producen configuraciones de ESLint en
**flat-config** (`eslint.config.mjs`), pero con bases mutuamente incompatibles:

- NestJS 11 usa `typescript-eslint` + `eslint-plugin-prettier/recommended` sobre `tseslint.config(...)`.
- Next.js 16 usa `eslint-config-next` (basado en sus propias reglas de Core Web Vitals, React, a11y).

Forzar un preset legacy único (`.eslintrc` con `extends`) habría degradado las reglas
oficiales de ambos frameworks y generado fricción en cada actualización futura de Nest o Next.

## Decisión
- `apps/backend/eslint.config.mjs` y `apps/frontend/eslint.config.mjs` se mantienen
  exactamente como los genera el CLI oficial de cada framework, sin capa de abstracción.
- `packages/shared-config` comparte únicamente:
  - `prettier.config.js` (formato de código, idéntico en ambas apps).
  - `tsconfig.base.json` (reglas de tipado estricto comunes — usado como referencia de
    estilo; cada app mantiene su propio `tsconfig.json` real, ya que Nest y Next imponen
    `module`/`moduleResolution` específicos que no deben forzarse).

## Consecuencias
- Actualizar Nest o Next a una versión mayor no requiere migrar también un preset
  compartido de ESLint.
- Las reglas de lint pueden divergir levemente entre backend y frontend; se acepta como
  costo razonable frente al beneficio de no pelear contra las herramientas oficiales.
- Si en el futuro ambos ecosistemas convergen en una base de ESLint compatible, se
  reevaluará unificarlos bajo `shared-config`.
