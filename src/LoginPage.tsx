import React, { useState } from "react";
import { authenticateUser, registerUser, setSession, type User } from "./database";

const CIHLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="94" fill="none" stroke="#1c3d72" strokeWidth="6" />
    <circle cx="100" cy="100" r="84" fill="none" stroke="#1c3d72" strokeWidth="2" />
    <path
      d="M100 28 L105 45 L122 45 L108 55 L114 72 L100 62 L86 72 L92 55 L78 45 L95 45 Z"
      fill="none"
      stroke="#1c3d72"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <text x="100" y="125" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="64" fill="#1c3d72" textAnchor="middle" letterSpacing="-3">CIH</text>
    <text x="100" y="152" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="13" fill="#1c3d72" textAnchor="middle">CIH BANK</text>
    <text x="100" y="170" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="13" fill="#1c3d72" textAnchor="middle">DU MAROC</text>
  </svg>
);

interface LoginPageProps {
  onLogin: (user: User) => void;
  isDark: boolean;
  toggleDark: () => void;
}

export default function LoginPage({ onLogin, isDark, toggleDark }: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const result = authenticateUser(username, password);
    if (result.success && result.user) {
      setSession(result.user);
      onLogin(result.user);
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      setLoading(false);
      return;
    }
    if (fullName.trim().length < 2) {
      setError("Please enter your full name");
      setLoading(false);
      return;
    }

    const result = registerUser(username, password, fullName);
    if (result.success) {
      setSuccess("Account created! You can now log in.");
      setIsRegistering(false);
      setFullName("");
      setPassword("");
    } else {
      setError(result.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 relative ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 to-blue-50"}`}>
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleDark}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${
          isDark
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-black/30"
            : "bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200/50"
        }`}
        aria-label="Toggle Dark Mode"
      >
        {isDark ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className={`w-full max-w-md mx-4 rounded-3xl shadow-2xl p-10 transition-colors duration-500 ${isDark ? "bg-gray-800 shadow-black/30" : "bg-white"}`}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28">
            <CIHLogo />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-extrabold text-center mb-1 ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h1>
        <p className={`text-center mb-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {isRegistering ? "Register to get started" : "Sign in to your account"}
        </p>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
          {isRegistering && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(""); }}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 transition-colors ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 transition-colors ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 transition-colors pr-12 ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c3d72] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#15305c] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isRegistering ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              isRegistering ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                setSuccess("");
              }}
              className="ml-1 text-[#1c3d72] font-bold hover:underline"
            >
              {isRegistering ? "Sign In" : "Register"}
            </button>
          </p>
        </div>

        {/* Demo credentials hint */}
        {!isRegistering && (
          <div className={`mt-6 p-4 rounded-xl text-xs ${isDark ? "bg-gray-700/50 text-gray-400" : "bg-blue-50 text-gray-500"}`}>
            <p className="font-semibold mb-1">Demo Accounts:</p>
            <p>admin / admin123 &nbsp;•&nbsp; user / user123 &nbsp;•&nbsp; mohamed / 1234</p>
          </div>
        )}
      </div>
    </div>
  );
}
