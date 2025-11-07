// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NestedMessages = Record<string, any>;

export type LocaleConfig = {
  supportedLanguages: readonly string[];
  features: string[];
  modules: Record<string, Record<string, NestedMessages>>;
};
