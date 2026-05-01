"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./actions";

export default function AuthComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [lockUntil, setLockUntil] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const router = useRouter();
  const customColor = "#523923";

  useEffect(() => {
    if (!lockUntil) return;

    const interval = setInterval(() => {
      const diff = Math.ceil((lockUntil.getTime() - Date.now()) / 1000);

      if (diff <= 0) {
        setLockUntil(null);
        setSecondsLeft(0);
        clearInterval(interval);
      } else {
        setSecondsLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  const handleLogin = async () => {
    setError("");

    const result = await loginAdmin(username, password);

    if (result?.error) {
      setError(result.error);

      if (result.lockSeconds) {
        const lockTime = new Date(Date.now() + result.lockSeconds * 1000);
        setLockUntil(lockTime);
        setSecondsLeft(result.lockSeconds);
      }

      return;
    }

  };

  const isLocked = !!lockUntil && lockUntil.getTime() > Date.now();

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 h-screen relative">
        <img
          src="/assets/admin-bg.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white/90">
        <div className="bg-white/80 p-8 rounded-2xl w-[544px] h-[544px] flex flex-col justify-center">
          <div className="text-center mb-2">
            <img src="/assets/hbd-logo.png" className="mx-auto" />
          </div>

          <h2
            className="text-xl font-semibold text-center"
            style={{ color: customColor }}
          >
            Admin Login
          </h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="mt-4">
            <label className="block mb-1">Username</label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-3">
            <label className="block mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full p-2 border rounded"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLocked}
            className={`w-full mt-5 py-2 rounded text-white ${
              isLocked ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ backgroundColor: customColor }}
          >
            {isLocked ? `Locked (${secondsLeft}s)` : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
