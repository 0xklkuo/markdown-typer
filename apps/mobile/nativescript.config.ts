import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'dev.markdown-typer.mobile',
  appResourcesPath: 'App_Resources',
  appPath: 'src',
  bundler: 'vite',
  bundlerConfigPath: 'vite.config.ts',
  cli: {
    packageManager: 'pnpm',
  },
  ios: {},
} satisfies NativeScriptConfig;
