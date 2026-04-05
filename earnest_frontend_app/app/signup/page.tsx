"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { codeMessages } from "@/lib/responseHandler";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [password, setPassword] = useState("");
  
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let newErrors: any = {};

    // Full Name validation
    if (!fullName || fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password
    if (password !== cnfPassword) {
      newErrors.cnfPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const res = await api.post("/auth/register", { fullName, email, password, cnfPassword });
        toast.success(res.data.message || "Signup successful", {
          duration: 5000, //5 seconds
        });
        setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {      
      toast.error(codeMessages[err.response?.data?.code] || "Login failed", {
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <div className="relative w-96 p-[2px] rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
        
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
          
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </h1>

          <div className="mt-6 space-y-3">
            
            {/* Full Name */}
            <div>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400"
                placeholder="Full Name"
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setCnfPassword(e.target.value)}
              />
              {errors.cnfPassword && (
                <p className="text-red-500 text-sm">{errors.cnfPassword}</p>
              )}
            </div>

          </div>

          <button
            onClick={handleRegister}
            className="mt-6 w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 
            hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300"
          >
            Register 
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-pink-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}