export {};

declare global {
  interface Window {
    desktopApp: {
      platform: NodeJS.Platform;
    };
  }
}
