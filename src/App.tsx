import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import ProfilePage from "./ProfilePage";
import ExchangeRatesPage from "./ExchangeRatesPage";
import FamilyPage from "./FamilyPage";
import WorkersPage from "./WorkersPage";
import { getSession, clearSession, setSession, type User, getUserData, saveUserData } from "./database";

type View = "dashboard" | "profile" | "exchange" | "family" | "workers";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>("dashboard");
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
    setView("dashboard");
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setView("dashboard");
  };

  const handleUserUpdate = (updated: User) => {
    setUser(updated);
    setSession(updated);
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

  // Handle navigation to different pages
  const handleNavigate = (page: "profile" | "exchange" | "family" | "workers") => {
    setView(page);
  };

  const handleGeneralMoneyChange = (amount: number) => {
    // Update general money in database
    const data = getUserData(user.username);
    const currentGeneral = data.generalMoney || 10000;
    const newGeneral = Math.max(0, currentGeneral + amount);
    saveUserData(user.username, { generalMoney: newGeneral });
  };

  // Render page based on view
  if (view === "exchange") {
    const data = getUserData(user.username);
    const general = data.generalMoney ?? 10000;
    const cards = data.cards || [];
    const cardsTotal = cards.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
    const total = general + cardsTotal;
    return (
      <ExchangeRatesPage
        isDark={isDark}
        onBack={() => setView("dashboard")}
        generalMoney={general}
        totalMoney={total}
      />
    );
  }
  if (view === "family") {
    return (
      <FamilyPage
        user={user}
        isDark={isDark}
        onBack={() => setView("dashboard")}
        onGeneralMoneyChange={handleGeneralMoneyChange}
      />
    );
  }
  if (view === "workers") {
    return (
      <WorkersPage
        user={user}
        isDark={isDark}
        onBack={() => setView("dashboard")}
        onGeneralMoneyChange={handleGeneralMoneyChange}
      />
    );
  }
  if (view === "profile") {
    return (
      <ProfilePage
        user={user}
        onBack={() => setView("dashboard")}
        onUpdate={handleUserUpdate}
        isDark={isDark}
        toggleDark={toggleDark}
      />
    );
  }

  // Default: dashboard
  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      isDark={isDark}
      toggleDark={toggleDark}

      onNavigate={handleNavigate}
    />
  );
}
