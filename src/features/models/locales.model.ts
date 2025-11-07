import type { NestedMessages } from '@/shared/models/locale.model';

export type SupportedLanguages = readonly string[];
export type FeatureModules = Record<string, Record<string, NestedMessages>>;
