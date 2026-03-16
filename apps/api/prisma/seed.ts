import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const seedEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  DEFAULT_USER_NAME: z
    .string()
    .trim()
    .min(1, { error: 'DEFAULT_USER_NAME is required.' })
    .default('Local User'),
  DEFAULT_USER_EMAIL: z
    .email({ error: 'DEFAULT_USER_EMAIL must be a valid email address.' })
    .default('local@example.com'),
});

seedEnvSchema.parse(process.env);

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.upsert({
    where: {
      email: process.env.DEFAULT_USER_EMAIL!,
    },
    update: {
      name: process.env.DEFAULT_USER_NAME!,
    },
    create: {
      email: process.env.DEFAULT_USER_EMAIL!,
      name: process.env.DEFAULT_USER_NAME!,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
