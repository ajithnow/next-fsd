import { defaultLocale, locales, type Locale } from './config';

export type MessageValue = string | Record<string, string | Record<string, string>>;
export type Messages = Record<string, MessageValue>;

export const resolveLocale = (candidate?: string): Locale => {
  return locales.includes(candidate as Locale) ? (candidate as Locale) : defaultLocale;
};

export type IntlConfig = {
  locale: Locale;
  messages: Record<string, Messages>;
};
