import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/core/i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't use locale prefix in URLs (no /en, /es, etc.)
  localePrefix: 'never'
});
