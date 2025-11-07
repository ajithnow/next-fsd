import type { Locale } from '@/core/i18n/config';
import { generateLocaleConfig } from '@/shared/utils/locale.utils';
import { authLocales } from './auth/locales';
import type { SupportedLanguages } from './models/locales.model';

const modules = {
  auth: authLocales,
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
export const getLocaleMessages = (locale: Locale) => {
  return messages[locale] || messages['en'];
};

export default messages;
