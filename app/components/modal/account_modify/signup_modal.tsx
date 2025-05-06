"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import VerificationModal from "./verification";

interface SignUpModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  onClose,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setReShowPassword] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
  
    const fields = [
      "firstName",
      "lastName",
      "email",
      "mobileNumber",
      "streetAddress",
      "city",
      "barangay",
      "zipCode",
      "password",
      "confirmPassword",
    ];
  
    const emptyFields = fields.filter((field) => {
      const value = form[field]?.value.trim();
      return !value;
    });
  
    setInvalidFields(emptyFields);
    setError(null);
  
    if (emptyFields.length > 0) {
     setError("Please fill in empty fields.");
      return;
    }
  
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const display_name = `${firstName} ${lastName}`;
    const email = form.email.value.trim();
    const mobileNumber = form.mobileNumber.value.trim();
    const streetAddress = form.streetAddress.value.trim();
    const city = form.city.value.trim();
    const barangay = form.barangay.value.trim();
    const zipCode = form.zipCode.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setInvalidFields(["password", "confirmPassword"]);
      return;
    }
  
    const mobileRegex = /^(?:\+639|639|09|9)\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setError("Invalid mobile number.");
      setInvalidFields(["mobileNumber"]);
      return;
    }
  
    const { data: existingUser, error: emailCheckError } = await supabase
      .from("customers")
      .select("email")
      .eq("email", email)
      .single();
  
    if (emailCheckError && emailCheckError.code !== "PGRST116") {
      setError(emailCheckError.message);
      return;
    }
  
    if (existingUser) {
      setError("Email is already in use.");
      setInvalidFields(["email"]);
      return;
    }
  
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name },
      },
    });
  
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
  
    const userId = signUpData.user?.id;
  
    const { error: insertError } = await supabase.from("customers").insert([
      {
        customerid: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        mobile_num: mobileNumber,
        street_address: streetAddress,
        city,
        barangay,
        zipcode: zipCode,
      },
    ]);
  
    if (insertError) {
      setError(insertError.message);
      return;
    }
  
    setVerificationModalOpen(true);
    setEmail(email);
    setPassword(password);
  };
  

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-30"
      onClick={handleOverlayClick}
    >
      <div
        className="relative flex flex-row bg-white rounded-lg shadow-lg w-full md:w-fit h-full md:h-fit p-10 overflow-auto max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute flex cursor-pointer items-center justify-center top-5 right-5 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="flex flex-col items-center md:items-start px-6 w-150">
          <h2 className="font-bold text-3xl text-[#240C03]">Getting Started</h2>
          <p className="font-light py-2 text-sm text-[#240C03] border-b-2 border-[#E19517]">
            We are thrilled to have you onboard. Create an account by inputting
            the required fields.
          </p>
          <form onSubmit={handleSignUp} className="space-y-4 mt-5 w-full">
            {error && <p className="text-red-500 ">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="w-full">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("firstName")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}              />
              </div>
              <div className="w-full">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("lastName")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}               />
              </div>
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("email")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}               />
              </div>
              <div className="w-full">
                <label
                  htmlFor="mobile-number"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile-number"
                  name="mobileNumber"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("mobileNumber")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}             />
              </div>
              <div className="w-full">
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="street-address"
                  name="streetAddress"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("streetAddress")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}              />
              </div>
              <div className="w-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("city")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}               />
              </div>
              <div className="w-full">
                <label
                  htmlFor="barangay"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Barangay
                </label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("barangay")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="zip-code"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zip-code"
                  name="zipCode"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("zipCode")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}              />
              </div>
              <div className="w-full relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("password")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}               />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
                >
                  {showPassword ? (
                    <EyeOff size={20}></EyeOff>
                  ) : (
                    <Eye size={20}></Eye>
                  )}
                </span>
              </div>

              <div className="w-full relative">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-[#240C03]"
                >
                  Confirm Password
                </label>
                <input
                  type={showRePassword ? "text" : "password"}
                  id="confirm-password"
                  name="confirmPassword"
                  
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    invalidFields.includes("confirmPassword")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-[#E19517]"
                  }`}               />
                <span
                  onClick={() => setReShowPassword(!showRePassword)}
                  className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
                >
                  {showRePassword ? (
                    <EyeOff size={20}></EyeOff>
                  ) : (
                    <Eye size={20}></Eye>
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-[#E19517] rounded-md hover:bg-[#E19517]/90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Sign Up
            </button>
            <p className="text-sm text-center text-gray-600 mb-10 md:mb-0">
              Already have an account?{" "}
              <a
                onClick={onSwitchToLogin}
                className="text-[#E19517] hover:underline cursor-pointer"
              >
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
      {verificationModalOpen && (
        <VerificationModal
          email={email}
          password={password}
          onClose={() => setVerificationModalOpen(false)}
          onSuccess={onClose}
        />
      )}
    </div>
  );
};

export default SignUpModal;
