'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300">
          {session.user?.email}
          {session.user?.role === 'admin' && (
            <Link 
              href="/admin"
              className="ml-4 text-red-500 hover:text-red-400"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
        <button 
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button 
      onClick={() => signIn()}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
    >
      Sign in
    </button>
  );
} 