import type { Locale } from '@/core/i18n/config';
import QueryProviderClient from '@/core/providers/queryProvider';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { getLocaleMessages } from '@/features/locales';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'CRLT Web',
  description: 'Feature-Sliced Design with i18n',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = getLocaleMessages(locale as Locale);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          <QueryProviderClient>
            <AuthProvider>{children}</AuthProvider>
          </QueryProviderClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
