import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from '../loginForm';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    );
    
    expect(screen.getByLabelText('auth.login.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.login.password')).toBeInTheDocument();
  });
});
