import { createWriteStream, existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createInterface, type Interface } from 'node:readline/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream as NodeWebReadableStream } from 'node:stream/web';

// ============================================================================
// Descarga automática de datos geográficos oficiales de Bogotá D.C.
// (Localidades y Barrios) en formato GeoJSON.
//
// Fuentes: servicios REST (ArcGIS) referenciados desde datosabiertos.bogota.gov.co
//   - Localidades: Secretaría Distrital de Planeación
//     https://datosabiertos.bogota.gov.co/dataset/localidad-bogota-d-c
//   - Barrios (Sector Catastral): Unidad Administrativa Especial de Catastro
//     Distrital (UAECD) — https://datosabiertos.bogota.gov.co/dataset/sector-catastral
//
// Uso:
//   pnpm download:bogota            (pregunta antes de reemplazar archivos existentes)
//   pnpm download:bogota -- --yes   (reemplaza sin preguntar, útil en CI/scripts)
// ============================================================================

interface BogotaDataset {
  label: string;
  fileName: string;
  sourceDescription: string;
  url: string;
}

const OUTPUT_DIR = resolve(__dirname, '../data/raw');

const DATASETS: BogotaDataset[] = [
  {
    label: 'Localidades de Bogotá',
    fileName: 'localidades.geojson',
    sourceDescription:
      'Secretaría Distrital de Planeación — ' +
      'https://datosabiertos.bogota.gov.co/dataset/localidad-bogota-d-c',
    url:
      'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/' +
      'ordenamientoterritorial/localidad/MapServer/0/query' +
      '?where=1%3D1&outFields=*&outSR=4326&f=geojson',
  },
  {
    label: 'Barrios de Bogotá (Sector Catastral)',
    fileName: 'barrios.geojson',
    // El Sector Catastral incluye sectores Urbano (barrios), Rural (veredas)
    // y Mixto — el campo "SCATIPO" permite filtrarlos. Esta descarga trae el
    // dataset completo tal cual lo publica catastro; el filtrado queda para
    // el script de seed.
    sourceDescription:
      'Unidad Administrativa Especial de Catastro Distrital (UAECD) — ' +
      'https://datosabiertos.bogota.gov.co/dataset/sector-catastral',
    url:
      'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/' +
      'catastro/sectorcatastral/MapServer/0/query' +
      '?where=1%3D1&outFields=*&outSR=4326&f=geojson',
  },
];

// ----------------------------------------------------------------------------
// Utilidades
// ----------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function printProgress(
  label: string,
  downloadedBytes: number,
  totalBytes: number,
): void {
  const progress =
    totalBytes > 0
      ? `${formatBytes(downloadedBytes)} / ${formatBytes(totalBytes)} ` +
        `(${((downloadedBytes / totalBytes) * 100).toFixed(1)}%)`
      : `${formatBytes(downloadedBytes)} descargados...`;

  process.stdout.write(`\r  ${label}: ${progress}   `);
}

function wantsForceOverwrite(): boolean {
  return process.argv.includes('--yes') || process.argv.includes('-y');
}

function isInteractiveSession(): boolean {
  return Boolean(process.stdin.isTTY) && Boolean(process.stdout.isTTY);
}

async function confirmOverwrite(
  rl: Interface | null,
  fileName: string,
): Promise<boolean> {
  if (!rl) {
    console.log(
      `  El archivo "${fileName}" ya existe y no hay una terminal interactiva disponible; ` +
        'se conserva. Ejecuta con --yes para reemplazarlo automáticamente.',
    );
    return false;
  }

  const answer = await rl.question(
    `  El archivo "${fileName}" ya existe. ¿Deseas reemplazarlo? (s/N): `,
  );
  return /^s(i|í)?$/i.test(answer.trim());
}

interface GeoJsonValidationResult {
  valid: boolean;
  featureCount: number;
  error?: string;
}

function validateGeoJson(raw: string): GeoJsonValidationResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      valid: false,
      featureCount: 0,
      error: 'El archivo no es JSON válido',
    };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return {
      valid: false,
      featureCount: 0,
      error: 'El contenido no es un objeto GeoJSON',
    };
  }

  const document = parsed as Record<string, unknown>;

  if (document.type !== 'FeatureCollection') {
    return {
      valid: false,
      featureCount: 0,
      error: `Se esperaba "type": "FeatureCollection", se encontró "${String(document.type)}"`,
    };
  }

  if (!Array.isArray(document.features)) {
    return {
      valid: false,
      featureCount: 0,
      error: 'No se encontró un arreglo "features"',
    };
  }

  const { features } = document;
  const allFeaturesAreValid = features.every(
    (feature) =>
      typeof feature === 'object' &&
      feature !== null &&
      (feature as Record<string, unknown>).type === 'Feature' &&
      'geometry' in (feature as Record<string, unknown>),
  );

  if (!allFeaturesAreValid) {
    return {
      valid: false,
      featureCount: features.length,
      error:
        'Al menos un elemento de "features" no tiene la forma de un Feature GeoJSON válido',
    };
  }

  return { valid: true, featureCount: features.length };
}

async function downloadFile(
  url: string,
  destPath: string,
  label: string,
): Promise<void> {
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} al descargar ${label}`,
    );
  }

  const totalBytes = Number(response.headers.get('content-length') ?? 0);
  let downloadedBytes = 0;

  const source = Readable.fromWeb(
    response.body as NodeWebReadableStream<Uint8Array>,
  );

  source.on('data', (chunk: Buffer) => {
    downloadedBytes += chunk.length;
    printProgress(label, downloadedBytes, totalBytes);
  });

  await pipeline(source, createWriteStream(destPath));
  process.stdout.write('\n');
}

// ----------------------------------------------------------------------------
// Orquestación
// ----------------------------------------------------------------------------

interface DatasetResult {
  label: string;
  featureCount: number;
}

async function processDataset(
  rl: Interface | null,
  force: boolean,
  dataset: BogotaDataset,
): Promise<DatasetResult> {
  const destPath = join(OUTPUT_DIR, dataset.fileName);

  if (existsSync(destPath) && !force) {
    const shouldReplace = await confirmOverwrite(rl, dataset.fileName);

    if (!shouldReplace) {
      console.log(`  Se conserva el archivo existente: ${dataset.fileName}`);
      const raw = await readFile(destPath, 'utf-8');
      const result = validateGeoJson(raw);
      return { label: dataset.label, featureCount: result.featureCount };
    }
  }

  console.log(`\nDescargando ${dataset.label}`);
  console.log(`  Fuente: ${dataset.sourceDescription}`);

  await downloadFile(dataset.url, destPath, dataset.label);

  const raw = await readFile(destPath, 'utf-8');
  const result = validateGeoJson(raw);

  if (!result.valid) {
    throw new Error(
      `El archivo descargado para "${dataset.label}" no es un GeoJSON válido: ${result.error}`,
    );
  }

  console.log(`  Guardado en: ${destPath}`);
  console.log(`  GeoJSON válido — ${result.featureCount} features`);

  return { label: dataset.label, featureCount: result.featureCount };
}

async function main(): Promise<void> {
  console.log('SAFECITY — Descarga de datos oficiales de Bogotá\n');

  await mkdir(OUTPUT_DIR, { recursive: true });

  const force = wantsForceOverwrite();
  const rl = isInteractiveSession()
    ? createInterface({ input: process.stdin, output: process.stdout })
    : null;
  const results: DatasetResult[] = [];

  try {
    for (const dataset of DATASETS) {
      results.push(await processDataset(rl, force, dataset));
    }
  } finally {
    rl?.close();
  }

  console.log('\nResumen:');
  for (const result of results) {
    console.log(`  - ${result.label}: ${result.featureCount}`);
  }

  console.log(
    '\nListo. Los archivos quedaron en apps/backend/prisma/data/raw/',
  );
}

main().catch((error: unknown) => {
  console.error('\nError al descargar los datos de Bogotá:');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
