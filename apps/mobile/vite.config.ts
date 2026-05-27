import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { typescriptConfig } from '@nativescript/vite';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readRequiredUrlEnv = (
  env: Record<string, string>,
  name: string,
): string => {
  const value = env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required. Check apps/mobile/.env.`);
  }

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }
};

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, __dirname, '');
  const apiBaseUrl = readRequiredUrlEnv(env, 'NATIVE_SCRIPT_API_BASE_URL');

  return mergeConfig(typescriptConfig({ mode }), {
    define: {
      __NATIVE_SCRIPT_API_BASE_URL__: JSON.stringify(apiBaseUrl),
    },
  });
});
