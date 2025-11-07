import { getRequestConfig } from 'next-intl/server';
import type { Locale } from './config';
import { resolveLocale, type IntlConfig, type Messages } from './index';

export type GetLocaleMessages = (locale: Locale) => Record<string, Messages>;

export default function createRequest(getMessages: GetLocaleMessages) {
  return getRequestConfig(async ({ locale }) => {
    const resolved = resolveLocale(locale);

    const messages = getMessages(resolved);

    return {
      locale: resolved,
      messages,
      timeZone: 'UTC',
    } as IntlConfig;
  });
}
