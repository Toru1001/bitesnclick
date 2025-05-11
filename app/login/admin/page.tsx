"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export default function AuthComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const customColor = "#523923";
  const router = useRouter();

  useEffect(() => {
      if(localStorage.getItem("admin_id") != null){
        router.push("/admin/dashboard");
      }
    }, []);

  const handleLogin = async () => {
    setError("");

    const { data, error: fetchError } = await supabase
      .from("admin")
      .select("*")
      .eq("username", username)
      .single();

    if (fetchError || !data) {
      setError("Incorrect username or password.");
      return;
    }

    const isValid = await bcrypt.compare(password, data.password);

    if (!isValid) {
      setError("Incorrect username or password.");
      return;
    }
    const expirationTime = Date.now() + 10 * 60 * 60 * 1000; 
    const sessionData = {
      id: data.id,
      expiresAt: expirationTime,
    };

    localStorage.setItem("admin_id", JSON.stringify(sessionData));

    router.push("/admin/dashboard");
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
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div>
              <label className="block mb-1" style={{ color: customColor }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded border border-gray-400"
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
                  className="w-full p-2 rounded border border-gray-400"
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
            
          </div>
          <div className="space-y-2 mt-5">
            <button
              onClick={handleLogin}
              className="w-full text-white py-2 rounded cursor-pointer"
              style={{ backgroundColor: customColor }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
