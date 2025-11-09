'use client';

import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="p-8">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="p-8">
        <p>Not signed in</p>
        <a href="/login" className="text-blue-600 hover:underline">
          Go to login
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile & Token Info</h1>

      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">User Info</h2>
          <p>
            <strong>Name:</strong> {session.user?.name}
          </p>
          <p>
            <strong>Email:</strong> {session.user?.email}
          </p>
        </div>

        {/* ID Token */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">ID Token (for Backend)</h2>
          <div className="bg-gray-100 p-3 rounded text-xs break-all font-mono">
            {session.idToken || 'No ID token available'}
          </div>
        </div>

        {/* Access Token */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Access Token</h2>
          <div className="bg-gray-100 p-3 rounded text-xs break-all font-mono">
            {session.accessToken || 'No access token available'}
          </div>
        </div>

        {/* Full Session Debug */}
        <details className="bg-white p-4 rounded-lg shadow">
          <summary className="font-semibold cursor-pointer">View Full Session Object</summary>
          <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
