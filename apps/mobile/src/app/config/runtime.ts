declare const __NATIVE_SCRIPT_API_BASE_URL__: string;

const requireDefinedString = (
  value: string | undefined,
  name: string,
): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`${name} is required. Check apps/mobile/.env.`);
  }

  return trimmedValue;
};

const requireAbsoluteUrl = (value: string, name: string): string => {
  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }
};

const apiBaseUrl = requireAbsoluteUrl(
  requireDefinedString(
    __NATIVE_SCRIPT_API_BASE_URL__,
    'NATIVE_SCRIPT_API_BASE_URL',
  ),
  'NATIVE_SCRIPT_API_BASE_URL',
);

export const runtimeConfig = {
  apiBaseUrl,
} as const;
