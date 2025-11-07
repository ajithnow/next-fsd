import type { LocaleConfig, NestedMessages } from '../models/locale.model';

export const generateLocaleConfig = ({
  modules,
  supportedLanguages,
}: LocaleConfig) => {
  const messages: Record<string, Record<string, NestedMessages>> = {};

  for (const lang of supportedLanguages) {
    messages[lang] = {};

    for (const [feature, locales] of Object.entries(modules)) {
      messages[lang][feature] = locales[lang] || {};
    }
  }

  return messages;
};
