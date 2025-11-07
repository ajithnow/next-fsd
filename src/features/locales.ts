import { authLocales } from './auth/locales';
import { generateLocaleConfig } from '@/shared/utils/locale.utils';
import type { SupportedLanguages } from './models/locales.model';

const modules = {
  auth: authLocales,
  // dashboard: dashboardLocales,
  // customers: customersLocales,
};

export const supportedLanguages = ['en', 'es'] as const as SupportedLanguages;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const features = Object.keys(modules);

export const messages = generateLocaleConfig({
  modules,
  supportedLanguages,
  features,
});

// Helper to get messages for a specific locale
export const getLocaleMessages = (locale: SupportedLanguage) => {
  return messages[locale] || messages['en'];
};

export default messages;
