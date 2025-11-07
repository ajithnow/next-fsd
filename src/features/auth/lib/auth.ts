// Legacy Better Auth config removed. File kept temporarily to avoid import resolution
// errors during refactor. Safe to delete once no imports reference `auth`.

// Exporting a stub to prevent runtime crashes if any stray import remains.
// Stub constant retained; will be deleted after confirming no imports.
export const auth: undefined = undefined;

// Removing obsolete Session type to avoid type errors.
// If any code still references Session, update it to new token-based approach.
