"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use AuthContext login to set user in context (and handle credentials)
      await login(email, password);
      // Refresh user state if needed, then navigate to dashboard
      await refreshUser();
      router.push("/sitemap");
    } catch (err) {
      console.error("[Login] Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden md:flex w-1/2 items-center justify-center p-12"
        style={{
          background: 'linear-gradient(180deg, #02298A 0%, #02298A 85%, #02298A 100%)',
        }}
      >
        <div className="text-center">
          <img src="/logo.png" alt="Simtestlab" className="mx-auto w-25 h-25 object-contain mb-6" />
          <h1 className="text-white text-4xl font-extrabold tracking-tight">Simtestlab</h1>
          <p className="text-blue-100 mt-2">Energy Management System</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">LOGIN</h2>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email Address"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 text-white font-medium rounded-full transition-colors duration-150"
              style={{
                background: isLoading
                  ? '#02298A'
                  : 'linear-gradient(90deg, #09339d 0%, #09339d 100%)',
              }}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">© 2026 SimTestLab. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
