'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { LoginFormData, LoginError } from '../../models/auth.model';
import { validateEmail, validateRequired } from '../../managers/auth.validators';
import { useLoginMutation } from '../../queries/auth.queries';
import styles from './loginForm.module.scss';

export function LoginForm() {
  const t = useTranslations('auth');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginError[]>([]);
  
  const loginMutation = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: LoginError[] = [];
    
    if (!validateRequired(formData.email)) {
      newErrors.push({ field: 'email', message: t('login.errors.required') });
    } else if (!validateEmail(formData.email)) {
      newErrors.push({ field: 'email', message: t('login.errors.invalidEmail') });
    }
    
    if (!validateRequired(formData.password)) {
      newErrors.push({ field: 'password', message: t('login.errors.required') });
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    setErrors([]);
    loginMutation.mutate(formData, {
      onError: (error) => {
        setErrors([{ message: error.message || t('login.errors.invalidCredentials') }]);
      }
    });
  };

  const getFieldError = (field: string) => {
    return errors.find(err => err.field === field)?.message;
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 ${styles.loginForm}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t('login.title')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General errors */}
        {errors.filter(err => !err.field).map((err, idx) => (
          <div key={`general-error-${idx}-${err.message}`} className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {err.message}
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              getFieldError('email')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={loginMutation.isPending}
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              getFieldError('password')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={loginMutation.isPending}
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
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={loginMutation.isPending}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm">
            {t('login.rememberMe')}
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loginMutation.isPending ? '...' : t('login.submit')}
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
