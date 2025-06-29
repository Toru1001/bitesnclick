'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const animationBase =
  'transition-all duration-500 ease-in-out transform';
const animationHidden = 'opacity-0 translate-x-10 pointer-events-none absolute top-0 left-0 w-full';
const animationVisible = 'opacity-100 translate-x-0 relative';

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<string>("login");
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    setError(null); 

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Invalid credentials. Please try again.');
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      setError('Failed to retrieve session data.');
      return;
    }

    const { session } = sessionData;
    const accessToken = session?.access_token;

    if (!accessToken) {
      setError('No access token found.');
      return;
    }

    localStorage.setItem('user_id', signInData.user.id);
    localStorage.setItem('access_token', accessToken);
    onClose(); 
  };

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotMessage(null);
    setError(null);

    const { error: forgotError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
    redirectTo: 'http://localhost:3000/auth/callback#reset-password'
});

    if (forgotError) {
      setError('Failed to send reset email. Please try again.');
    } else {
      setForgotMessage('Password reset email sent! Please check your inbox.');
    }
  };


  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-30"
      onClick={handleOverlayClick}
    >
      <div
        className="relative flex flex-row bg-white rounded-lg shadow-lg w-full md:w-fit h-full md:h-fit p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute flex cursor-pointer items-center justify-center top-5 right-5 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="hidden md:flex items-center">
          <Image
            className="object-fit h-80 w-80"
            src="/assets/login.png"
            alt="Login"
            width={450}
            height={450}
          />
        </div>
        <div className="flex flex-col items-center md:items-start px-6 w-96 relative min-h-[420px]">
          {/* Animated Login Form */}
          <div
            className={`${animationBase} ${
              state === "login" ? animationVisible : animationHidden
            }`}
            aria-hidden={state !== "login"}
          >
            <h2 className="font-bold text-3xl text-[#240C03]">
              Welcome Back!
            </h2>
            <p className="font-light py-2 text-sm text-[#240C03] border-b-2 border-[#E19517]">
              We are thrilled to have you back. Login into your account by inputting your email and password.
            </p>
            <form onSubmit={handleLogin} className="space-y-4 mt-10 w-full">
              {error && <p className="text-red-500">{error}</p>}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#240C03]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517] border-gray-400"
                />
              </div>
              <div className="mb-10">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-[#240C03]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[#E19517] hover:underline text-sm bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => setState("forgot")}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517] border-gray-400"
                />
                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2 accent-[#E19517] scale-120"
                  />
                  <label htmlFor="showPassword" className="text-sm text-[#240C03]">
                    Show Password
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-[#E19517] rounded-md hover:bg-[#E19517]/90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <a
                  onClick={onSwitchToSignUp}
                  className="text-[#E19517] hover:underline cursor-pointer"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
          {/* Animated Forgot Password Form */}
          <div
            className={`${animationBase} ${
              state === "forgot" ? animationVisible : animationHidden
            }`}
            aria-hidden={state !== "forgot"}
          >
            <h2 className="font-bold text-3xl text-[#240C03]">
              Forgot Password
            </h2>
            <p className="font-light py-2 text-sm text-[#240C03] border-b-2 border-[#E19517]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4 w-full">
              {forgotMessage || error ? (
                <p className={`${forgotMessage
                  ? 'text-[#E19517]'
                  : 'text-red-500'
                } h-5 mt-3 mb-5 text-sm`}>{forgotMessage ? forgotMessage : error}</p>
              ) : (
                <div className="text-white h-10">.</div>
              )}
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-[#240C03]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  name="forgotEmail"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517] border-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-[#E19517] rounded-md hover:bg-[#E19517]/90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 text-[#240C03] bg-transparent border border-[#E19517] rounded-md hover:bg-[#E19517]/10 cursor-pointer focus:outline-none"
                onClick={() => setState("login")}
              >
                Back to Login
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
