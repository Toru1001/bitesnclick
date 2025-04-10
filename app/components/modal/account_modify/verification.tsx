'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

interface VerificationModalProps {
  email: string;
  password: string;
  onClose: () => void;
  onSuccess: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ email, password, onClose, onSuccess }) => {
  const [message, setMessage] = useState('Waiting for email verification...');
  const [checking, setChecking] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const checkEmailVerified = async () => {
    setChecking(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage('Still waiting for verification...');
      return;
    }

    if (data.session) {
      clearInterval(intervalId!);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("access_token", data.session.access_token);
      onSuccess(); 
    }

    setChecking(false);
  };

  useEffect(() => {
    const id = setInterval(checkEmailVerified, 3000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40" onClick={handleOverlayClick}>
      <div className="relative flex flex-col items-center bg-white rounded-lg shadow-lg w-full md:w-96 h-fit p-8" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold text-[#240C03] mb-2">Verify Your Email</h2>
        <p className="text-sm text-gray-600 text-center">
          Please check your email and click the verification link. We’ll log you in automatically once it's confirmed.
        </p>
        <p className="text-sm mt-4 text-[#E19517]">{message}</p>
      </div>
    </div>
  );
};

export default VerificationModal;
