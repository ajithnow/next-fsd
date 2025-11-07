/**
 * Application environment helpers
 */
const fallbackApiUrl = 'http://localhost:3000/api';

const getEnvVar = (key: string, fallback?: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env[key]) {
    return process.env[key];
  }

  if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
    // Next.js exposes runtime env vars via process.env but we keep this for safety
    return (
      (globalThis.window as unknown as { __ENV__?: Record<string, string> })?.__ENV__?.[key] ??
      fallback
    );
  }

  return fallback;
};

export const env = {
  get apiUrl() {
    return getEnvVar('NEXT_PUBLIC_API_URL', fallbackApiUrl) ?? fallbackApiUrl;
  },
  get nodeEnv() {
    return getEnvVar('NODE_ENV', 'development') ?? 'development';
  },
  get isDev() {
    return this.nodeEnv === 'development';
  },
  get isProd() {
    return this.nodeEnv === 'production';
  },
  get isTest() {
    return this.nodeEnv === 'test';
  },
};
