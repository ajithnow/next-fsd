import type { Metadata } from "next";
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/core/i18n/config';
import QueryProviderClient from '@/core/providers/queryProvider';
import { getLocaleMessages, type SupportedLanguage } from '@/features/locales';
import "@/styles/globals.css";
import I18nProvider from "./i18n-provider.client";

export const metadata: Metadata = {
  title: "CRLT Web",
  description: "Feature-Sliced Design with i18n",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = getLocaleMessages(locale as SupportedLanguage);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <I18nProvider locale={locale} messages={messages}>
          <QueryProviderClient>
            {children}
          </QueryProviderClient>
        </I18nProvider>
      </body>
    </html>
  );
}
