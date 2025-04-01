'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30" onClick={handleOverlayClick}>
        
      <div className="relative flex flex-row bg-white rounded-lg shadow-lg w-fit p-10" onClick={(e) => e.stopPropagation()}>
      <button className='absolute flex cursor-pointer items-center justify-center top-5 right-5 w-10 h-10' onClick={onClose}>
        <X className='text-[#240C03] font-bold' />
      </button>
        <div className="flex items-center">
          <Image
            className="object-fit h-80 w-80"
            src="/assets/login.png"
            alt="Login"
            width={450}
            height={450}
          />
        </div>
        <div className="flex flex-col px-6 w-96">
          <h2 className="font-bold text-3xl text-[#240C03]">Welcome Back!</h2>
          <p className="font-light py-2 text-sm text-[#240C03] border-b-2 border-[#E19517]">
            We are thrilled to have you back. Login into your account by inputting your email and password.
          </p>
          <form action="#" method="POST" className="space-y-4 mt-10">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#240C03]">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517]"
              />
            </div>
            <div className="mb-10">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#240C03]">
                  Password
                </label>
                <a href="#" className="text-[#E19517] hover:underline text-sm">
                  Forgot Password?
                </a>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517]"
              />
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2 accent-[#E19517] scale-120"
                />
                <label htmlFor="showPassword" className="text-sm text-[#240C03]">Show Password</label>
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
              <a href="#" className="text-[#E19517] hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
