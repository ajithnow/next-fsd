import type { NestedMessages } from '@/core/models/i18n.model';

export type SupportedLanguages = readonly string[];
export type FeatureModules = Record<string, Record<string, NestedMessages>>;
