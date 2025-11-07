// Shared locale-related types moved here from shared/models/locale.model.ts

export interface NestedMessagesMap {
  [key: string]: string | NestedMessagesMap;
}

export type NestedMessages = string | NestedMessagesMap;

export type LocaleConfig = {
  supportedLanguages: readonly string[];
  features: string[];
  modules: Record<string, Record<string, NestedMessages>>;
};
