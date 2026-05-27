import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import nextPlugin from '@next/eslint-plugin-next';

import { baseConfig } from '../../packages/config-eslint/base.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...baseConfig,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    settings: {
      next: {
        rootDir: __dirname,
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];
