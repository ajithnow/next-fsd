'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../queries/auth.queries';
import { loginFormSchema, type LoginFormValues } from '../../schemas/auth.schemas';
import styles from './loginForm.module.scss';

export function LoginForm() {
  const t = useTranslations('auth');
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors: formErrors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    // Clear server-side errors
    setServerErrors([]);

    loginMutation.mutate(values, {
      onError: (error: any) => {
        // If API provides field-specific errors, set them into react-hook-form
        if (error?.field) {
          setError(error.field as any, { type: 'server', message: error.message });
          return;
        }

        setServerErrors([error?.message || t('login.errors.invalidCredentials')]);
      },
    });
  };

  const getFieldError = (field: string) => {
    return (formErrors as any)[field]?.message as string | undefined;
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
              getFieldError('email')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isSubmitting || loginMutation.isPending}
          />
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
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
              getFieldError('password')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isSubmitting || loginMutation.isPending}
          />
          {getFieldError('password') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting || loginMutation.isPending}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm">
            {t('login.rememberMe')}
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || loginMutation.isPending}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting || loginMutation.isPending ? '...' : t('login.submit')}
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
