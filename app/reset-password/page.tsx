'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
  const checkSessionOrURLToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      setAccessToken(session.access_token);
      return;
    }

    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1); 
      const params = new URLSearchParams(hash.replace(/#/g, '&')); 
      const token = params.get('access_token');
      if (token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: params.get('refresh_token') || '',
        });

        setAccessToken(token);
      } else {
        setError('Missing or invalid password reset token.');
      }
    }
  };

  checkSessionOrURLToken();
}, []);


  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!accessToken) {
      setError('Missing password reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message || 'Failed to update password.');
    } else {
      setMessage('Password updated successfully. Redirecting to homepage...');
      setTimeout(() => router.push('/'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#240C03] mb-4">Reset Password</h2>
        <p className="text-sm text-center text-[#555] mb-6">Enter your new password below.</p>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {message && <p className="text-[#E19517] text-sm text-center mb-4">{message}</p>}
        {!message && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-[#240C03]">New Password</label>
              <input
                type="password"
                id="newPassword"
                required
                className="w-full px-4 py-2 mt-1 border rounded-md border-gray-400 focus:ring-2 focus:ring-[#E19517] focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#240C03]">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                required
                className="w-full px-4 py-2 mt-1 border rounded-md border-gray-400 focus:ring-2 focus:ring-[#E19517] focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#E19517] text-white rounded-md hover:bg-[#E19517]/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
