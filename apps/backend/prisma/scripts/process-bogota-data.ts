import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// ============================================================================
// Procesa los GeoJSON oficiales descargados por download-bogota-data.ts y
// genera archivos JSON limpios, listos para que un futuro script de seed
// los use con Prisma.
//
// Entrada:  apps/backend/prisma/data/raw/{localidades,barrios}.geojson
// Salida:   apps/backend/prisma/data/processed/{localities,neighborhoods}.json
//
// Uso: pnpm process:bogota
// ============================================================================

const RAW_DIR = resolve(__dirname, '../data/raw');
const PROCESSED_DIR = resolve(__dirname, '../data/processed');

const LOCALIDADES_FILE = join(RAW_DIR, 'localidades.geojson');
const BARRIOS_FILE = join(RAW_DIR, 'barrios.geojson');

const LOCALITIES_OUTPUT = join(PROCESSED_DIR, 'localities.json');
const NEIGHBORHOODS_OUTPUT = join(PROCESSED_DIR, 'neighborhoods.json');

// El Sector Catastral clasifica cada registro con SCATIPO: 0 = Urbano,
// 1 = Rural (veredas), 2 = Mixto (confirmado contra la definición de
// subtipos del servicio ArcGIS). SAFECITY solo necesita barrios urbanos.
const SCATIPO_URBANO = 0;

// ----------------------------------------------------------------------------
// Tipos: GeoJSON de entrada
// ----------------------------------------------------------------------------

type Position = [number, number];
type LinearRing = Position[];

// GeoJSON define muchos tipos de geometría; solo Polygon/MultiPolygon son
// relevantes aquí. Se modela como forma plana (en vez de unión discriminada)
// porque el campo "type" de los demás tipos no se puede excluir a nivel de
// tipos de `string`, así que se valida y castea en tiempo de ejecución.
interface Geometry {
  type: string;
  coordinates: unknown;
}

interface GeoJsonFeature<TProperties> {
  type: 'Feature';
  properties: TProperties;
  geometry: Geometry;
}

interface GeoJsonFeatureCollection<TProperties> {
  type: 'FeatureCollection';
  features: GeoJsonFeature<TProperties>[];
}

interface LocalidadProperties {
  LOCCODIGO: string;
  LOCNOMBRE: string;
}

interface SectorCatastralProperties {
  SCACODIGO: string;
  SCANOMBRE: string;
  SCATIPO: number;
}

// ----------------------------------------------------------------------------
// Tipos: salida procesada
// ----------------------------------------------------------------------------

interface ProcessedLocality {
  id: string;
  nombre: string;
}

interface ProcessedNeighborhood {
  id: string;
  nombre: string;
  /** Código de la localidad contenedora (coincide con ProcessedLocality.id). */
  localidad: string;
}

interface ProcessingStats {
  localidades: number;
  barrios: number;
  duplicadosEliminados: number;
  barriosSinLocalidad: number;
  tiempoMs: number;
}

// ----------------------------------------------------------------------------
// Normalización de texto
// ----------------------------------------------------------------------------

function normalizeName(raw: string): string {
  const collapsed = raw.trim().replace(/\s+/g, ' ');
  return collapsed
    .toLowerCase()
    .split(' ')
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word,
    )
    .join(' ');
}

/**
 * Elimina duplicados exactos por id (el código oficial es la clave natural:
 * dos registros con el mismo código son, por definición, el mismo elemento).
 */
function dedupeById<T extends { id: string }>(
  items: T[],
): { unique: T[]; removed: number } {
  const seen = new Map<string, T>();
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.set(item.id, item);
    }
  }
  return { unique: [...seen.values()], removed: items.length - seen.size };
}

// ----------------------------------------------------------------------------
// Geometría: centroide de polígono y point-in-polygon (planos, en grados —
// suficiente para geometría administrativa a escala de ciudad).
// ----------------------------------------------------------------------------

interface RingCentroid {
  area: number;
  centroid: Position;
}

function ringCentroid(ring: LinearRing): RingCentroid {
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < ring.length - 1; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  area /= 2;

  if (area === 0) {
    // Anillo degenerado (puntos colineales o repetidos): se usa el promedio
    // simple de vértices como aproximación razonable.
    const points = ring.slice(0, -1);
    const [sumX, sumY] = points.reduce<Position>(
      ([accX, accY], [x, y]) => [accX + x, accY + y],
      [0, 0],
    );
    return { area: 0, centroid: [sumX / points.length, sumY / points.length] };
  }

  return { area, centroid: [cx / (6 * area), cy / (6 * area)] };
}

/** Centroide del anillo exterior más grande de la geometría (Polygon o MultiPolygon). */
function representativePoint(geometry: Geometry): Position | null {
  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates as LinearRing[];
    return ringCentroid(rings[0]).centroid;
  }

  if (geometry.type === 'MultiPolygon') {
    const polygons = geometry.coordinates as LinearRing[][];
    let largest: RingCentroid | null = null;
    for (const polygon of polygons) {
      const result = ringCentroid(polygon[0]);
      if (!largest || Math.abs(result.area) > Math.abs(largest.area)) {
        largest = result;
      }
    }
    return largest?.centroid ?? null;
  }

  return null;
}

function isPointInRing(point: Position, ring: LinearRing): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }

  return inside;
}

function isPointInPolygon(point: Position, rings: LinearRing[]): boolean {
  const [exterior, ...holes] = rings;
  if (!isPointInRing(point, exterior)) return false;
  return !holes.some((hole) => isPointInRing(point, hole));
}

// ----------------------------------------------------------------------------
// Carga y extracción
// ----------------------------------------------------------------------------

async function readFeatureCollection<TProperties>(
  filePath: string,
): Promise<GeoJsonFeatureCollection<TProperties>> {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as GeoJsonFeatureCollection<TProperties>;
}

interface LocalityWithGeometry extends ProcessedLocality {
  geometry: Geometry;
}

function extractLocalities(
  collection: GeoJsonFeatureCollection<LocalidadProperties>,
): LocalityWithGeometry[] {
  return collection.features.map((feature) => ({
    id: feature.properties.LOCCODIGO,
    nombre: normalizeName(feature.properties.LOCNOMBRE),
    geometry: feature.geometry,
  }));
}

interface NeighborhoodExtraction {
  matched: ProcessedNeighborhood[];
  unmatched: number;
}

function extractNeighborhoods(
  collection: GeoJsonFeatureCollection<SectorCatastralProperties>,
  localities: LocalityWithGeometry[],
): NeighborhoodExtraction {
  const urbanFeatures = collection.features.filter(
    (feature) => feature.properties.SCATIPO === SCATIPO_URBANO,
  );

  const matched: ProcessedNeighborhood[] = [];
  let unmatched = 0;

  for (const feature of urbanFeatures) {
    const point = representativePoint(feature.geometry);

    const locality = point
      ? localities.find(
          (candidate) =>
            candidate.geometry.type === 'Polygon' &&
            isPointInPolygon(
              point,
              candidate.geometry.coordinates as LinearRing[],
            ),
        )
      : undefined;

    if (!locality) {
      unmatched += 1;
      continue;
    }

    matched.push({
      id: feature.properties.SCACODIGO,
      nombre: normalizeName(feature.properties.SCANOMBRE),
      localidad: locality.id,
    });
  }

  return { matched, unmatched };
}

// ----------------------------------------------------------------------------
// Orquestación
// ----------------------------------------------------------------------------

function printStats(stats: ProcessingStats): void {
  console.log('\nEstadísticas:');
  console.log(`  ✔ Localidades: ${stats.localidades}`);
  console.log(`  ✔ Barrios: ${stats.barrios}`);
  console.log(`  ✔ Duplicados eliminados: ${stats.duplicadosEliminados}`);
  console.log(`  ✔ Barrios sin localidad: ${stats.barriosSinLocalidad}`);
  console.log(`  ✔ Tiempo de procesamiento: ${stats.tiempoMs.toFixed(1)} ms`);
}

async function main(): Promise<void> {
  const start = performance.now();

  console.log('SAFECITY — Procesamiento de datos de Bogotá\n');

  console.log('Leyendo GeoJSON...');
  const [localidadesRaw, barriosRaw] = await Promise.all([
    readFeatureCollection<LocalidadProperties>(LOCALIDADES_FILE),
    readFeatureCollection<SectorCatastralProperties>(BARRIOS_FILE),
  ]);

  console.log('Extrayendo y normalizando localidades...');
  const localitiesWithGeometry = extractLocalities(localidadesRaw);
  const { unique: uniqueLocalities, removed: localityDuplicates } = dedupeById(
    localitiesWithGeometry,
  );
  uniqueLocalities.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  console.log(
    'Extrayendo barrios y ubicándolos por localidad (point-in-polygon)...',
  );
  const { matched: neighborhoods, unmatched: barriosSinLocalidad } =
    extractNeighborhoods(barriosRaw, localitiesWithGeometry);
  const { unique: uniqueNeighborhoods, removed: neighborhoodDuplicates } =
    dedupeById(neighborhoods);
  uniqueNeighborhoods.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const localitiesOutput: ProcessedLocality[] = uniqueLocalities.map(
    ({ id, nombre }) => ({
      id,
      nombre,
    }),
  );

  await mkdir(PROCESSED_DIR, { recursive: true });
  await writeFile(
    LOCALITIES_OUTPUT,
    JSON.stringify(localitiesOutput, null, 2) + '\n',
    'utf-8',
  );
  await writeFile(
    NEIGHBORHOODS_OUTPUT,
    JSON.stringify(uniqueNeighborhoods, null, 2) + '\n',
    'utf-8',
  );

  console.log(`\nGuardado: ${LOCALITIES_OUTPUT}`);
  console.log(`Guardado: ${NEIGHBORHOODS_OUTPUT}`);

  const tiempoMs = performance.now() - start;

  printStats({
    localidades: localitiesOutput.length,
    barrios: uniqueNeighborhoods.length,
    duplicadosEliminados: localityDuplicates + neighborhoodDuplicates,
    barriosSinLocalidad,
    tiempoMs,
  });
}

main().catch((error: unknown) => {
  console.error('\nError al procesar los datos de Bogotá:');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
