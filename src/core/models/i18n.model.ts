// Canonical i18n-related types for the core area.
export interface NestedMessagesMap {
  [key: string]: string | NestedMessagesMap;
}

export type NestedMessages = string | NestedMessagesMap;

export type LocaleConfig = {
  supportedLanguages: readonly string[];
  features: string[];
  modules: Record<string, Record<string, NestedMessages>>;
};

export type { NestedMessages as Messages };
