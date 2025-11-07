# Features Layer

User interactions and features. Each feature should have its own folder.

## Structure

```text
features/
  auth/
    components/   - Feature-specific UI
    constants/    - Feature constants and URLs
    locales/      - i18n dictionaries
    managers/     - Business logic orchestrators
    models/       - TypeScript models
    queries/      - TanStack Query hooks
    schema/       - Validation schemas
    services/     - API calls
    stores/       - State management hooks
    index.ts      - Public API
  ...
```

## Rules

- Features can import from `shared` and `entities`
- Features cannot import from `widgets` or other `features`
- Each feature should export only what's needed through index.ts
