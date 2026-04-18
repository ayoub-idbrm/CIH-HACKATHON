import { useState } from "react";
import { updateUserProfile, verifyPassword, type User } from "./database";

const CIHLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="6" />
    <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M100 28 L105 45 L122 45 L108 55 L114 72 L100 62 L86 72 L92 55 L78 45 L95 45 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <text x="100" y="125" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="64" fill="currentColor" textAnchor="middle" letterSpacing="-3">CIH</text>
    <text x="100" y="152" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="13" fill="currentColor" textAnchor="middle">CIH BANK</text>
    <text x="100" y="170" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="13" fill="currentColor" textAnchor="middle">DU MAROC</text>
  </svg>
);

const AVATAR_COLORS = [
  { id: "blue", className: "from-[#1c3d72] to-blue-500", label: "Ocean" },
  { id: "emerald", className: "from-emerald-500 to-teal-500", label: "Emerald" },
  { id: "orange", className: "from-orange-400 to-red-500", label: "Sunset" },
  { id: "purple", className: "from-purple-500 to-pink-500", label: "Aurora" },
  { id: "amber", className: "from-amber-400 to-yellow-500", label: "Gold" },
  { id: "rose", className: "from-rose-400 to-pink-600", label: "Rose" },
  { id: "cyan", className: "from-cyan-400 to-blue-500", label: "Sky" },
  { id: "indigo", className: "from-indigo-500 to-purple-600", label: "Royal" },
];

const getAvatarClass = (id?: string) =>
  AVATAR_COLORS.find((c) => c.id === id)?.className || AVATAR_COLORS[0].className;

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  onUpdate: (updated: User) => void;
  isDark: boolean;
  toggleDark: () => void;
}

export default function ProfilePage({ user, onBack, onUpdate, isDark, toggleDark }: ProfilePageProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarColor, setAvatarColor] = useState(user.avatarColor || "blue");

  // Password change
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwdForm, setShowPwdForm] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!fullName.trim()) {
      setProfileMsg({ type: "error", text: "Full name cannot be empty." });
      return;
    }
    setSavingProfile(true);
    setTimeout(() => {
      const result = updateUserProfile(user.username, {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        avatarColor,
      });
      setSavingProfile(false);
      if (result.success && result.user) {
        onUpdate(result.user);
        setProfileMsg({ type: "success", text: "✓ Profile updated successfully!" });
        setTimeout(() => setProfileMsg(null), 3000);
      } else {
        setProfileMsg({ type: "error", text: result.error || "Failed to update profile." });
      }
    }, 600);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdMsg({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (newPwd.length < 4) {
      setPwdMsg({ type: "error", text: "New password must be at least 4 characters." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (!verifyPassword(user.username, currentPwd)) {
      setPwdMsg({ type: "error", text: "Current password is incorrect." });
      return;
    }
    setSavingPwd(true);
    setTimeout(() => {
      const result = updateUserProfile(user.username, { password: newPwd });
      setSavingPwd(false);
      if (result.success && result.user) {
        onUpdate(result.user);
        setPwdMsg({ type: "success", text: "✓ Password changed successfully!" });
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
        setTimeout(() => {
          setPwdMsg(null);
          setShowPwdForm(false);
        }, 2500);
      } else {
        setPwdMsg({ type: "error", text: "Failed to change password." });
      }
    }, 600);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <header className="w-full px-6 sm:px-8 py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Back to Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <a 
            href="https://www.e-cihbank.ma/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`w-14 h-14 sm:w-16 sm:h-16 block transform hover:scale-105 transition-all duration-300 cursor-pointer ${isDark ? "text-blue-300" : "text-[#1c3d72]"}`}
            title="Visit CIH Bank Website"
          >
            <CIHLogo />
          </a>
        </div>

        <button
          onClick={toggleDark}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDark ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>

      <main className="container mx-auto px-6 sm:px-8 pb-24 max-w-5xl">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className={`text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
            Edit Profile
          </h1>
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile Banner */}
        <div className={`rounded-3xl shadow-lg border p-8 mb-8 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center text-white font-extrabold text-4xl bg-gradient-to-tr ${getAvatarClass(avatarColor)} shadow-xl ring-4 ${isDark ? "ring-gray-700" : "ring-gray-100"}`}>
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-gray-800"}`}>{fullName}</h2>
              <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>@{user.username}</p>
              {user.joinedAt && (
                <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  📅 Member since {new Date(user.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSaveProfile} className={`rounded-3xl shadow-lg border p-8 mb-8 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <h3 className={`text-xl font-extrabold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                  isDark ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Username</label>
              <input
                type="text"
                value={user.username}
                disabled
                className={`w-full px-4 py-3 rounded-xl border-2 cursor-not-allowed opacity-60 ${
                  isDark ? "bg-gray-900 border-gray-700 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Username cannot be changed</p>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                  isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 6XX XXX XXX"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                  isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors resize-none ${
                  isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Avatar Color</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setAvatarColor(c.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                      avatarColor === c.id
                        ? isDark ? "border-blue-400 bg-gray-700" : "border-[#1c3d72] bg-blue-50"
                        : isDark ? "border-gray-600 hover:border-gray-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${c.className} shadow-md flex items-center justify-center text-white font-bold`}>
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-[10px] font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {profileMsg && (
            <div className={`mt-5 px-4 py-3 rounded-xl text-sm font-medium ${
              profileMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {profileMsg.text}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-[#1c3d72] hover:bg-[#15305c] disabled:opacity-60 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              {savingProfile && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Security Section */}
        <div className={`rounded-3xl shadow-lg border p-8 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-extrabold flex items-center gap-2 ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </h3>
            {!showPwdForm && (
              <button
                onClick={() => setShowPwdForm(true)}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${
                  isDark ? "bg-gray-700 text-blue-300 hover:bg-gray-600" : "bg-gray-100 text-[#1c3d72] hover:bg-gray-200"
                }`}
              >
                Change Password
              </button>
            )}
          </div>

          {!showPwdForm ? (
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Your password is securely stored. Click "Change Password" above to update it.
            </p>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Current Password</label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                    isDark ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"
                  }`}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>New Password</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                      isDark ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                      isDark ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"
                    }`}
                  />
                </div>
              </div>

              {pwdMsg && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                  pwdMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}>
                  {pwdMsg.text}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPwdForm(false);
                    setCurrentPwd("");
                    setNewPwd("");
                    setConfirmPwd("");
                    setPwdMsg(null);
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                    isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPwd}
                  className="bg-[#1c3d72] hover:bg-[#15305c] disabled:opacity-60 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  {savingPwd && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {savingPwd ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
