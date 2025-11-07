'use client';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from '@/lib/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthManager } from '../../managers/useAuthManager';
import { loginFormSchema, LoginFormValues } from '../../schemas/auth.schemas';

export function ModernLoginForm() {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);

  const { login: managerLogin } = useAuthManager();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    } as LoginFormValues,
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await managerLogin(values);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('login.title')}</h2>
            <p className="text-sm text-gray-600">{t('login.subtitle')}</p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('login.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('login.passwordPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </FormControl>
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {t('login.rememberMe')}
                    </Label>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('login.signingIn') : t('login.signIn')}
          </Button>
        </form>
      </Form>
    </div>
  );
}
