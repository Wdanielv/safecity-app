import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ciudad piloto
  const bogota = await prisma.city.upsert({
    where: { name_countryCode: { name: 'Bogotá D.C.', countryCode: 'CO' } },
    update: {},
    create: { name: 'Bogotá D.C.', countryCode: 'CO' },
  });

  // Localidades piloto (Kennedy, Suba, Engativá — mayor incidencia de hurtos 2021-2024)
  const localityNames = ['Kennedy', 'Suba', 'Engativá'];
  for (const name of localityNames) {
    await prisma.locality.upsert({
      where: { cityId_name: { cityId: bogota.id, name } },
      update: {},
      create: { cityId: bogota.id, name },
    });
  }

  // Tipos de incidente con tiempos de vigencia configurables en BD (no en código)
  const incidentTypes = [
    { code: 'ROBO',               label: 'Robo',                   defaultValidityHours: 24 },
    { code: 'HURTO',              label: 'Hurto',                  defaultValidityHours: 24 },
    { code: 'ATRACO',             label: 'Atraco',                 defaultValidityHours: 24 },
    { code: 'PERSONA_SOSPECHOSA', label: 'Persona sospechosa',     defaultValidityHours: 12 },
    { code: 'RINA',               label: 'Riña',                   defaultValidityHours: 6  },
    { code: 'ACCIDENTE_TRANSITO', label: 'Accidente de tránsito',  defaultValidityHours: 4  },
    { code: 'INCENDIO',           label: 'Incendio',               defaultValidityHours: 24 },
    { code: 'EMERGENCIA_MEDICA',  label: 'Emergencia médica',      defaultValidityHours: 2  },
    { code: 'DANO_VIAL',          label: 'Daño vial',              defaultValidityHours: 24 },
    { code: 'OTRO',               label: 'Otro',                   defaultValidityHours: 12 },
  ];

  for (const type of incidentTypes) {
    await prisma.incidentType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }

  console.log('Seed completado: 1 ciudad, 3 localidades piloto, 10 tipos de incidente.');
}

main()
  .catch((e: Error) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
