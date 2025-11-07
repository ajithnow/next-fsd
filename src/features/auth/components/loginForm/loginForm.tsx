'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
// Using new Google OAuth start route
import { loginFormSchema, type LoginFormValues } from '../../schemas/auth.schemas';
import { authService } from '../../services/auth.service';
import styles from './loginForm.module.scss';

export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors: formErrors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const handleGoogleSignIn = () => {
    window.location.href = '/api/oauth/google/start';
  };

  const onSubmit = async (values: LoginFormValues) => {
    // Clear server-side errors
    setServerErrors([]);

    try {
      // Use authService for email/password login
      await authService.login({
        email: values.email,
        password: values.password,
      });

      // Success - redirect to dashboard or home
      router.push('/');
      router.refresh();
    } catch (error: any) {
      setServerErrors([error?.message || t('login.errors.invalidCredentials')]);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 ${styles.loginForm}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('login.title')}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* General errors */}
        {serverErrors.map((msg, idx) => (
          <div
            key={`general-error-${idx}-${msg}`}
            className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
          >
            {msg}
          </div>
        ))}

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t('login.email')}
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors?.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isSubmitting}
          />
          {formErrors?.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email.message}</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {t('login.password')}
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors?.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isSubmitting}
          />
          {formErrors?.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm">
            {t('login.rememberMe')}
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '...' : t('login.submit')}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        {/* Forgot password link */}
        <div className="text-center">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
            {t('login.forgotPassword')}
          </a>
        </div>

        {/* Sign up link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">{t('login.noAccount')} </span>
          <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            {t('login.signUp')}
          </a>
        </div>
      </form>
    </div>
  );
}
