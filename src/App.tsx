import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import { getSession, clearSession, type User } from "./database";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("cih_dark_mode");
    return saved === "true";
  });
  const [isChecking, setIsChecking] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setIsChecking(false);
  }, []);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem("cih_dark_mode", isDark.toString());
  }, [isDark]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  // Loading state
  if (isChecking) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <div className="animate-spin w-10 h-10 border-4 border-[#1c3d72] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show login or dashboard
  if (!user) {
    return <LoginPage onLogin={handleLogin} isDark={isDark} toggleDark={toggleDark} />;
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      isDark={isDark}
      toggleDark={toggleDark}
    />
  );
}
