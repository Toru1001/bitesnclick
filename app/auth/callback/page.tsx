// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash; 
      if (hash) {
        router.replace(`/reset-password${hash}`);
      } else {
        router.replace('/reset-password?error=missing_token');
      }
    }
  }, []);

  return <p className="text-center mt-20">Redirecting...</p>;
}
