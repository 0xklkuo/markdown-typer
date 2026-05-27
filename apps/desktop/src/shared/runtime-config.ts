import 'dotenv/config';

const requireUrlEnv = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required. Check apps/desktop/.env.`);
  }

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }
};

export const DESKTOP_WEB_APP_URL = requireUrlEnv('DESKTOP_WEB_APP_URL');
export const DESKTOP_WEB_APP_ORIGIN = new URL(DESKTOP_WEB_APP_URL).origin;
