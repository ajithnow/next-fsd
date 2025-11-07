'use client';

import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

export default function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Record<string, any>;
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
