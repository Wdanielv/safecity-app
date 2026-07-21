import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface LocalityRecord {
  id: string;
  nombre: string;
}

interface NeighborhoodRecord {
  id: string;
  nombre: string;
  localidad: string;
}

function readProcessedData<T>(fileName: string): T {
  const filePath = path.join(__dirname, 'data', 'processed', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

async function main() {
  // Usuario administrador por defecto (idempotente: no duplica si ya existe)
  const adminEmail = 'admin@safecity.com';
  const adminPasswordHash = await bcrypt.hash('Admin123*', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: 'Administrador',
      role: 'ADMINISTRADOR',
      status: 'ACTIVO',
    },
  });
  // Ciudad piloto
  const bogota = await prisma.city.upsert({
    where: { name_countryCode: { name: 'Bogotá D.C.', countryCode: 'CO' } },
    update: {},
    create: { name: 'Bogotá D.C.', countryCode: 'CO' },
  });

  // Alinea localidades piloto previas con el nombre oficial del DANE antes de
  // sembrar, para no perder los reportes que ya las referencian (rename, no
  // duplica ni borra).
  const legacyLocalityRenames: Record<string, string> = {
    Engativá: 'Engativa',
  };
  for (const [oldName, officialName] of Object.entries(legacyLocalityRenames)) {
    await prisma.locality.updateMany({
      where: { cityId: bogota.id, name: oldName },
      data: { name: officialName },
    });
  }

  // Localidades y barrios oficiales de Bogotá (datos DANE procesados).
  const localityRecords =
    readProcessedData<LocalityRecord[]>('localities.json');
  const neighborhoodRecords =
    readProcessedData<NeighborhoodRecord[]>('neighborhoods.json');

  const localityIdByCode = new Map<string, string>();
  for (const record of localityRecords) {
    const locality = await prisma.locality.upsert({
      where: { cityId_name: { cityId: bogota.id, name: record.nombre } },
      update: {},
      create: { cityId: bogota.id, name: record.nombre },
    });
    localityIdByCode.set(record.id, locality.id);
  }

  let neighborhoodsSeeded = 0;
  for (const record of neighborhoodRecords) {
    const localityId = localityIdByCode.get(record.localidad);
    if (!localityId) continue;

    await prisma.neighborhood.upsert({
      where: { localityId_name: { localityId, name: record.nombre } },
      update: {},
      create: { localityId, name: record.nombre },
    });
    neighborhoodsSeeded++;
  }

  // Tipos de incidente con tiempos de vigencia configurables en BD (no en código)
  const incidentTypes = [
    { code: 'ROBO', label: 'Robo', defaultValidityHours: 24 },
    { code: 'HURTO', label: 'Hurto', defaultValidityHours: 24 },
    { code: 'ATRACO', label: 'Atraco', defaultValidityHours: 24 },
    {
      code: 'PERSONA_SOSPECHOSA',
      label: 'Persona sospechosa',
      defaultValidityHours: 12,
    },
    { code: 'RINA', label: 'Riña', defaultValidityHours: 6 },
    {
      code: 'ACCIDENTE_TRANSITO',
      label: 'Accidente de tránsito',
      defaultValidityHours: 4,
    },
    { code: 'INCENDIO', label: 'Incendio', defaultValidityHours: 24 },
    {
      code: 'EMERGENCIA_MEDICA',
      label: 'Emergencia médica',
      defaultValidityHours: 2,
    },
    { code: 'DANO_VIAL', label: 'Daño vial', defaultValidityHours: 24 },
    { code: 'OTRO', label: 'Otro', defaultValidityHours: 12 },
  ];

  for (const type of incidentTypes) {
    await prisma.incidentType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }

  console.log(
    `Seed completado: 1 ciudad, ${localityRecords.length} localidades, ` +
      `${neighborhoodsSeeded} barrios, 10 tipos de incidente, usuario administrador.`,
  );
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
