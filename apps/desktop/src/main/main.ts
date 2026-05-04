import { app, BrowserWindow, shell } from 'electron';
import type { HandlerDetails } from 'electron';

import {
  DESKTOP_APP_NAME,
  DESKTOP_PRELOAD_PATH,
  DESKTOP_WINDOW_BOUNDS,
  WEB_DEV_SERVER_URL,
} from '../shared/config.js';

const createMainWindow = (): BrowserWindow => {
  const isAllowedAppUrl = (value: string): boolean => {
    try {
      const url = new URL(value);

      return url.origin === WEB_DEV_SERVER_URL;
    } catch {
      return false;
    }
  };

  const isAllowedExternalUrl = (value: string): boolean => {
    try {
      const url = new URL(value);

      return url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleWindowOpen = ({ url }: HandlerDetails): { action: 'deny' } => {
    if (isAllowedExternalUrl(url)) {
      void shell.openExternal(url);
    }

    return { action: 'deny' };
  };

  const window = new BrowserWindow({
    title: DESKTOP_APP_NAME,
    show: false,
    backgroundColor: '#f8fafc',
    width: DESKTOP_WINDOW_BOUNDS.width,
    height: DESKTOP_WINDOW_BOUNDS.height,
    minWidth: DESKTOP_WINDOW_BOUNDS.minWidth,
    minHeight: DESKTOP_WINDOW_BOUNDS.minHeight,
    autoHideMenuBar: true,
    webPreferences: {
      preload: DESKTOP_PRELOAD_PATH,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      devTools: true,
    },
  });

  window.webContents.setWindowOpenHandler(handleWindowOpen);

  window.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedAppUrl(url)) {
      event.preventDefault();
    }
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  void window.loadURL(WEB_DEV_SERVER_URL);

  return window;
};

void app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
