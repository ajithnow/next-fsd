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
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
// New Google OAuth flow: redirect via start route
import { loginFormSchema, LoginFormValues } from '../../schemas/auth.schemas';
import { authService } from '../../services/auth.service';

export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

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
    setServerErrors([]);

    try {
      // Use the original authService for email/password login
      await authService.login({
        email: values.email,
        password: values.password,
      });

      // Success - redirect to dashboard or home
      router.push('/');
      router.refresh();
    } catch (error: any) {
      setServerErrors([error?.message || t('login.errors.invalidCredentials')]);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder: NextAuth social providers will be added here later.

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('login.title')}</h2>
            <p className="text-sm text-gray-600">{t('login.subtitle')}</p>
          </div>

          {/* Server errors */}
          {serverErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {serverErrors.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </div>
          )}

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

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social sign-in with Google via NextAuth */}
          <button
            type="button"
            className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            onClick={() => signIn('google')}
            disabled={isLoading}
          >
            Continue with Google
          </button>
        </form>
      </Form>
    </div>
  );
}
