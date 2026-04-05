"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { codeMessages } from "@/lib/responseHandler";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validate = () => {
    let newErrors: any = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    // Password validation
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

        const res = await api.post("/auth/login", { email, password });     
        const token = res.data.response?.accessToken;
        localStorage.setItem("accessToken", token);
        toast.success(res.data.message || "Login successful", {
            duration: 5000, //5 seconds
        });
        router.push("/dashboard");
    } catch (err: any) {
        toast.error( codeMessages[err?.response?.data?.code] || "Login failed ",
            { duration: 5000 }
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <div className="relative w-96 p-[2px] rounded-3xl bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-500">

        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">

          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 text-center mt-2 mb-6">
            Login to continue
          </p>

          {/* Inputs */}
          <div className="space-y-3">

            {/* Email */}
            <div>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

          </div>

          {/* API Error */}
          {errors.api && (
            <p className="text-red-500 text-sm text-center mt-3">
              {errors.api}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
            hover:scale-105 hover:shadow-xl active:scale-95 
            transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login "}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-pink-500 font-semibold hover:underline hover:text-indigo-500 transition"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}