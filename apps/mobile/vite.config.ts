import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import { typescriptConfig } from '@nativescript/vite';

export default defineConfig(({ mode }): UserConfig => {
  return mergeConfig(typescriptConfig({ mode }), {});
});
