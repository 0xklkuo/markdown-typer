import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { baseConfig } from '../../packages/config-eslint/base.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts', 'nativescript.config.ts'],
    ignores: ['references.d.ts', 'vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
];
