/**
 * Auth feature public API
 */

export { ModernLoginForm } from './components/modernLoginForm/modernLoginForm';
export { useAuthManager } from './managers/useAuthManager';
export type { LoginError, LoginFormData } from './models/auth.model';
export { AuthProvider, useAuth } from './providers/AuthProvider';
export { loginFormSchema, type LoginFormValues } from './schemas/auth.schemas';
