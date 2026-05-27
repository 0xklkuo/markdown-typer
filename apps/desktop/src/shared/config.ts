import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DESKTOP_APP_NAME = 'Markdown Typer';
export const DESKTOP_WINDOW_BOUNDS = {
  width: 1440,
  height: 900,
  minWidth: 1024,
  minHeight: 720,
} as const;

export const DESKTOP_DIST_DIR = path.resolve(__dirname, '../../dist');
export const DESKTOP_PRELOAD_PATH = path.resolve(
  DESKTOP_DIST_DIR,
  'preload/preload.js',
);
