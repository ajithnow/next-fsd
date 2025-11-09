'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Custom Google OAuth removed. This route is reserved for the upcoming NextAuth setup.
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-600">Redirecting…</div>
    </div>
  );
}
