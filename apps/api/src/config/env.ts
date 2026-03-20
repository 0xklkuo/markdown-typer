import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3210),
  DATABASE_URL: z
    .string()
    .trim()
    .min(1, { error: 'DATABASE_URL is required.' }),
  DEFAULT_USER_NAME: z
    .string()
    .trim()
    .min(1, { error: 'DEFAULT_USER_NAME is required.' })
    .default('Local User'),
  DEFAULT_USER_EMAIL: z
    .email({ error: 'DEFAULT_USER_EMAIL must be a valid email address.' })
    .default('local@example.com'),
  WEB_APP_ORIGIN: z.string().trim().min(1).default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const getEnv = (): Env => {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = envSchema.parse(process.env);

  return cachedEnv;
};
