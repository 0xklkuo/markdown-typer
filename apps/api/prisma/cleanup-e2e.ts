import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const E2E_NOTE_PREFIX = '[E2E]';
const noteIds = process.env.E2E_NOTE_IDS
  ? process.env.E2E_NOTE_IDS.split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  : [];

const main = async (): Promise<void> => {
  await prisma.note.deleteMany({
    where: {
      OR: [
        ...(noteIds.length > 0
          ? [
              {
                id: {
                  in: noteIds,
                },
              },
            ]
          : []),
        {
          title: {
            startsWith: E2E_NOTE_PREFIX,
          },
        },
        {
          content: {
            startsWith: `# ${E2E_NOTE_PREFIX}`,
          },
        },
        {
          content: {
            startsWith: E2E_NOTE_PREFIX,
          },
        },
      ],
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
