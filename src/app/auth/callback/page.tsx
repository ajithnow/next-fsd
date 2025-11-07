'use client';

import { useAuthTokens } from '@/features/auth/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const { tokens, isLoading } = useAuthTokens();
  const router = useRouter();

  useEffect(() => {
    // If no tokens after loading, redirect to login
    if (!isLoading && !tokens.accessToken && !tokens.idToken) {
      router.push('/login');
    }
  }, [tokens, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tokens...</p>
        </div>
      </div>
    );
  }

  if (!tokens.accessToken && !tokens.idToken) {
    return null;
  }

  // Decode JWT payload (unsafe decode for display only) - not a hook to avoid order changes
  let idTokenClaims: Record<string, unknown> | null = null;
  if (tokens.idToken) {
    try {
      const parts = tokens.idToken.split('.');
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr =
          typeof window === 'undefined'
            ? Buffer.from(base64, 'base64').toString('utf-8')
            : decodeURIComponent(
                Array.prototype.map
                  .call(
                    atob(base64),
                    (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
                  )
                  .join(''),
              );
        idTokenClaims = JSON.parse(jsonStr);
      }
    } catch {
      idTokenClaims = null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Authentication Successful! ✓</h1>

        <div className="space-y-6">
          {/* Access Token */}
          {tokens.accessToken && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">Access Token</h2>
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm break-all">{tokens.accessToken}</code>
              </div>
            </div>
          )}

          {/* ID Token */}
          {tokens.idToken && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">ID Token</h2>
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm break-all">{tokens.idToken}</code>
              </div>
              {idTokenClaims && (
                <div className="mt-3">
                  <h3 className="text-lg font-medium mb-2">ID Token Claims</h3>
                  <div className="bg-gray-50 p-3 rounded border overflow-x-auto">
                    <pre className="text-xs">{JSON.stringify(idTokenClaims, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Refresh Token */}
          {tokens.refreshToken && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">Refresh Token</h2>
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm break-all">{tokens.refreshToken}</code>
              </div>
            </div>
          )}

          {/* Full Token Data */}
          <div>
            <h2 className="text-xl font-semibold mb-3">All Tokens</h2>
            <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">{JSON.stringify(tokens, null, 2)}</pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
