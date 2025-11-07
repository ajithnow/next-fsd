import type { NestedMessages } from '@/core/models/i18n.model';
import { defaultLocale, locales, type Locale } from './config';

/**
 * Use the project's canonical NestedMessages type for message values so
 * generated locale objects are structurally compatible across modules.
 */
export type Messages = NestedMessages;

export const resolveLocale = (candidate?: string): Locale => {
  return locales.includes(candidate as Locale) ? (candidate as Locale) : defaultLocale;
};

export type IntlConfig = {
  locale: Locale;
  messages: Record<string, Messages>;
  /**
   * Optional time zone to avoid environment fallback warnings from next-intl.
   */
  timeZone?: string;
};
