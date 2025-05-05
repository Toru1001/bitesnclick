
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthComponent() {
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [adminUsername, setAdminUsername] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const customColor = "#523923";

  const handleLogin = () => {
    if (username === adminUsername && password === adminPassword) {
      alert("Login successful!");
      setError("");
    } else {
      setError("Incorrect username or password");
    }
  };

  const handleConfirmPasswordChange = () => {
    if (newPassword) setAdminPassword(newPassword);
    if (newUsername) {
      setAdminUsername(newUsername);
      setUsername(newUsername);
    }
    setShowDialog(false);
    setView("login");
    setNewPassword("");
    setNewUsername("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Background Image */}
      <div className="w-1/2 h-screen relative">
        <img
          src="/assets/admin-bg.jpg"
          alt="Side Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-1/2 flex items-center justify-center relative bg-white/90 z-10">
        <div className="bg-white/80 p-8 rounded-2xl relative z-10 w-[544px] h-[544px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {/* Logo Image */}
                  <div className="text-center mb-2">
                    <img src="/assets/hbd-logo.png" alt="Logo" className="mx-auto" />
                  </div>
                  <h2
                    className="text-xl font-semibold text-center"
                    style={{ color: customColor }}
                  >
                    Admin Login
                  </h2>
                  <div>
                    <label className="block mb-1" style={{ color: customColor }}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-2 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block mb-1" style={{ color: customColor }}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleLogin}
                    className="w-full text-white py-2 rounded"
                    style={{ backgroundColor: customColor }}
                  >
                    Login
                  </button>
                  <p
                    className="text-sm text-center cursor-pointer"
                    style={{ color: customColor }}
                    onClick={() => setView("reset")}
                  >
                    Forgot password/username?
                  </p>
                </div>
              </motion.div>
            )}

            {view === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {/* Logo Image */}
                  <div className="text-center mb-4">
                    <img src="/assets/hbd-logo.png" alt="Logo" className="mx-auto" />
                  </div>
                  <h2
                    className="text-xl font-semibold text-center"
                    style={{ color: customColor }}
                  >
                    Reset Credentials
                  </h2>
                  <div>
                    <label className="block mb-1" style={{ color: customColor }}>
                      New Username
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full p-2 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block mb-1" style={{ color: customColor }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 rounded border"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-400 text-white px-8 py-2 rounded"
                    onClick={() => setView("login")}
                  >
                    Close
                  </button>
                  <button
                    style={{ backgroundColor: customColor }}
                    className="text-white px-8 py-2 rounded"
                    onClick={() => setShowDialog(true)}
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Alert Dialog with translucent, blurred background */}
        {showDialog && (
          <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[400px] space-y-4 shadow-xl">
              <p className="text-center text-base" style={{ color: customColor }}>
                Are you sure you want to change the admin credentials?
              </p>
              <div className="flex justify-between gap-x-2">
                <button
                  className="bg-gray-200 px-4 py-2 rounded text-sm"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ backgroundColor: customColor }}
                  className="text-white px-4 py-2 rounded text-sm"
                  onClick={handleConfirmPasswordChange}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
