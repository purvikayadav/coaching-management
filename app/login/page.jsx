"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import NProgress from "nprogress";
import { ROUTES_PATH } from "../../lib/constants/routePaths";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 🚫 Redirect to dashboard if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push(ROUTES_PATH.DASHBOARD);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 🔐 Handle login
  const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  try {
    NProgress.start();
    await signInWithEmailAndPassword(auth, email, password);
    NProgress.done();
    router.push(ROUTES_PATH.DASHBOARD);
  } catch (err) {
    NProgress.done();
    setError("Invalid email or password");
  }
};

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-black">
          Login to Coaching Management
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg p-2 pr-10 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </button>

          <p onClick={() => router.push("/signup")} className="text-sm text-gray-600 text-center mt-4 hover:underline cursor-pointer">Don't have an account?SignUp</p>
        </form>
      </div>
    </main>
  );
}
