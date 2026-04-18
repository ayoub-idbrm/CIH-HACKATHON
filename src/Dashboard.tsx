import React, { useState } from "react";
import { clearSession, type User } from "./database";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

import CardDetail, { type Transaction, type CardData } from "./CardDetail";

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

const iconOptions = [
  {
    name: "Shopping",
    color: "bg-gradient-to-tr from-orange-400 to-amber-500",
    chartColor: "#fb923c",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: "Money",
    color: "bg-gradient-to-tr from-emerald-400 to-green-500",
    chartColor: "#34d399",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Home",
    color: "bg-gradient-to-tr from-blue-400 to-indigo-500",
    chartColor: "#60a5fa",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Document",
    color: "bg-gradient-to-tr from-purple-400 to-pink-500",
    chartColor: "#c084fc",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: "Heart",
    color: "bg-gradient-to-tr from-red-400 to-rose-500",
    chartColor: "#f87171",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    name: "Star",
    color: "bg-gradient-to-tr from-yellow-400 to-orange-500",
    chartColor: "#facc15",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    name: "Car",
    color: "bg-gradient-to-tr from-cyan-400 to-teal-500",
    chartColor: "#22d3ee",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    name: "Education",
    color: "bg-gradient-to-tr from-indigo-400 to-purple-600",
    chartColor: "#818cf8",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// ====================== Card ======================
const Card = ({
  card,
  isDark,
  onSelect,
  onDelete,
  onManage,
}: {
  card: CardData;
  isDark: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onManage: () => void;
}) => {
  const opt = iconOptions[card.iconIndex];
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-7 w-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgb(0,0,0,0.12)] flex flex-col items-center text-center h-full relative group ${
        isDark ? "bg-gray-800 border border-gray-700 hover:bg-gray-700" : "bg-white border border-gray-100 hover:bg-gray-50"
      }`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className={`w-20 h-20 ${opt.color} rounded-full flex items-center justify-center mb-5 text-white shadow-lg`}>
        {opt.icon}
      </div>
      <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>{card.title}</h3>
      <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-gray-400" : "text-gray-500"} line-clamp-2`}>
        {card.description}
      </p>

      {/* Amount in card */}
      <div className={`w-full rounded-2xl py-3 px-4 mb-4 ${isDark ? "bg-gray-900/60" : "bg-gray-50"}`}>
        <p className={`text-[11px] uppercase font-semibold tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Allocated
        </p>
        <p className={`text-2xl font-extrabold ${isDark ? "text-emerald-300" : "text-[#1c3d72]"}`}>
          {formatMoney(card.amount)} <span className="text-xs font-medium opacity-60">MAD</span>
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onManage(); }}
        className={`mt-auto w-full py-3 rounded-xl font-semibold transition-colors z-10 ${
          isDark ? "bg-gray-700 text-blue-300 hover:bg-gray-600" : "bg-gray-50 text-[#1c3d72] hover:bg-gray-100"
        }`}
      >
        Manage {card.title}
      </button>
    </div>
  );
};

// ====================== Add card placeholder ======================
const AddCardButton = ({ onClick, isDark }: { onClick: () => void; isDark: boolean }) => (
  <div
    onClick={onClick}
    className={`rounded-3xl border-2 border-dashed p-8 w-full flex flex-col items-center justify-center min-h-[360px] cursor-pointer group transition-all duration-300 h-full ${
      isDark ? "border-gray-600 hover:border-blue-400 hover:bg-gray-800" : "border-gray-300 hover:border-[#1c3d72] hover:bg-slate-50"
    }`}
  >
    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
        isDark ? "bg-gray-700 text-gray-500 group-hover:text-blue-400 group-hover:bg-gray-600" : "bg-gray-50 text-gray-400 group-hover:text-[#1c3d72] group-hover:bg-white group-hover:shadow-md"
      }`}
    >
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </div>
    <h3 className={`text-xl font-bold transition-colors ${isDark ? "text-gray-500 group-hover:text-blue-400" : "text-gray-500 group-hover:text-[#1c3d72]"}`}>
      Add Card
    </h3>
  </div>
);

// ====================== Add Card Modal ======================
const AddCardModal = ({
  isOpen,
  onClose,
  onAdd,
  isDark,
  generalMoney,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, iconIndex: number, amount: number) => void;
  isDark: boolean;
  generalMoney: number;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount) || 0;
    if (amt < 0) {
      setError("Amount must be 0 or greater.");
      return;
    }
    if (amt > generalMoney) {
      setError(`Insufficient general money. Available: ${formatMoney(generalMoney)} MAD`);
      return;
    }
    if (title.trim() && description.trim()) {
      onAdd(title.trim(), description.trim(), selectedIcon, amt);
      setTitle("");
      setDescription("");
      setAmount("");
      setSelectedIcon(0);
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto transition-colors ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className={`text-2xl font-extrabold mb-2 ${isDark ? "text-white" : "text-[#1c3d72]"}`}>Add New Card</h2>
        <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Available General Money: <span className="font-bold">{formatMoney(generalMoney)} MAD</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
              placeholder="e.g. Transportation, Health..."
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors resize-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
              placeholder="Describe what this category is for..."
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Initial Amount (MAD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
              placeholder="0.00"
            />
            <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              This amount will be deducted from your General Money.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Choose Icon & Color</label>
            <div className="grid grid-cols-4 gap-3">
              {iconOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIcon(i)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    selectedIcon === i
                      ? isDark
                        ? "border-blue-400 bg-gray-700"
                        : "border-[#1c3d72] bg-blue-50"
                      : isDark
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 ${opt.color} rounded-full flex items-center justify-center text-white mb-1`}>
                    <div className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">{opt.icon}</div>
                  </div>
                  <span className={`text-[10px] font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-[#1c3d72] text-white py-3 rounded-xl font-bold hover:bg-[#15305c] transition-colors">
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ====================== Manage Card Modal (transfer money in/out) ======================
const ManageCardModal = ({
  card,
  isOpen,
  onClose,
  isDark,
  generalMoney,
  onTransfer,
}: {
  card: CardData | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  generalMoney: number;
  onTransfer: (cardId: string, delta: number) => void;
}) => {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"add" | "withdraw">("add");
  const [error, setError] = useState("");

  if (!isOpen || !card) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (mode === "add" && amt > generalMoney) {
      setError(`Insufficient general money. Available: ${formatMoney(generalMoney)} MAD`);
      return;
    }
    if (mode === "withdraw" && amt > card.amount) {
      setError(`Insufficient card balance. Available: ${formatMoney(card.amount)} MAD`);
      return;
    }
    onTransfer(card.id, mode === "add" ? amt : -amt);
    setAmount("");
    setError("");
    onClose();
  };

  const opt = iconOptions[card.iconIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-8 transition-colors ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 ${opt.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
            <div className="w-7 h-7 [&>svg]:w-7 [&>svg]:h-7">{opt.icon}</div>
          </div>
          <div>
            <h2 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-[#1c3d72]"}`}>{card.title}</h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Balance: <span className="font-bold">{formatMoney(card.amount)} MAD</span>
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className={`flex gap-2 p-1 rounded-xl mb-5 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
          <button
            type="button"
            onClick={() => { setMode("add"); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              mode === "add"
                ? "bg-[#1c3d72] text-white shadow"
                : isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            ↓ Add Money
          </button>
          <button
            type="button"
            onClick={() => { setMode("withdraw"); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              mode === "withdraw"
                ? "bg-red-500 text-white shadow"
                : isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            ↑ Withdraw
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Amount (MAD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors text-lg font-bold ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
              placeholder="0.00"
              required
            />
            <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {mode === "add"
                ? `From General Money (${formatMoney(generalMoney)} MAD available)`
                : `Back to General Money`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
              mode === "add" ? "bg-[#1c3d72] hover:bg-[#15305c]" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {mode === "add" ? "Add to Card" : "Withdraw to General"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ====================== Edit General Money Modal ======================
const EditGeneralModal = ({
  isOpen,
  onClose,
  isDark,
  currentValue,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentValue: number;
  onSave: (value: number) => void;
}) => {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"deposit" | "set">("deposit");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt)) return;
    if (mode === "deposit") {
      onSave(currentValue + amt);
    } else {
      if (amt < 0) return;
      onSave(amt);
    }
    setAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-8 transition-colors ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className={`text-2xl font-extrabold mb-2 ${isDark ? "text-white" : "text-[#1c3d72]"}`}>Update General Money</h2>
        <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Current: <span className="font-bold">{formatMoney(currentValue)} MAD</span>
        </p>

        <div className={`flex gap-2 p-1 rounded-xl mb-5 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
          <button
            type="button"
            onClick={() => setMode("deposit")}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              mode === "deposit" ? "bg-emerald-500 text-white shadow" : isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            + Deposit
          </button>
          <button
            type="button"
            onClick={() => setMode("set")}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              mode === "set" ? "bg-[#1c3d72] text-white shadow" : isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            = Set Exact
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {mode === "deposit" ? "Amount to Deposit (MAD)" : "New Total (MAD)"}
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors text-lg font-bold ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"}`}
              placeholder="0.00"
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#1c3d72] text-white py-3 rounded-xl font-bold hover:bg-[#15305c] transition-colors">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

// ====================== Dashboard ======================
interface DashboardProps {
  user: User;
  onLogout: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

const STORAGE_KEY = "cih_dashboard_data";

interface PersistedData {
  cards: CardData[];
  generalMoney: number;
}

const loadData = (username: string): PersistedData => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${username}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    generalMoney: 5000,
    cards: [
      { 
        id: "1", title: "Food", description: "Manage your daily groceries, restaurant bills, and food deliveries.", amount: 1200, iconIndex: 0, 
        transactions: [
          { id: "tx_1", date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 300, description: "Marjane Groceries", type: "spend" },
          { id: "tx_2", date: new Date(Date.now() - 86400000 * 5).toISOString(), amount: 150, description: "McDonald's Delivery", type: "spend" }
        ] 
      },
      { 
        id: "2", title: "Saving", description: "Track your savings goals, investments, and emergency funds.", amount: 2500, iconIndex: 1, 
        transactions: [
          { id: "tx_3", date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 500, description: "Monthly Auto-Save", type: "deposit" }
        ] 
      },
      { 
        id: "3", title: "Renting", description: "Monthly rent payments, utilities, and home maintenance.", amount: 3000, iconIndex: 2, 
        transactions: [
          { id: "tx_4", date: new Date(Date.now() - 86400000 * 15).toISOString(), amount: 3000, description: "Rent Payment - April", type: "spend" },
          { id: "tx_5", date: new Date(Date.now() - 86400000 * 20).toISOString(), amount: 6000, description: "Transfer from General", type: "deposit" }
        ],
        rental: {
          owners: [
            {
              id: "owner_old_1",
              name: "Mr. Hassan El Amrani",
              account: "MA64 1100 0000 0001 2345 6789",
              rentAmount: 4500,
              active: false,
              startDate: new Date(Date.now() - 86400000 * 365).toISOString(),
              endDate: new Date(Date.now() - 86400000 * 90).toISOString(),
            },
            {
              id: "owner_new_1",
              name: "Mrs. Fatima Bennani",
              account: "MA64 2200 0000 9876 5432 1000",
              rentAmount: 4000,
              active: true,
              startDate: new Date(Date.now() - 86400000 * 85).toISOString(),
            },
          ],
          tenants: [
            { id: "tn_1", name: "Youssef", share: 1000, paid: true, paidAt: new Date(Date.now() - 86400000 * 2).toISOString() },
            { id: "tn_2", name: "Karim", share: 1000, paid: true, paidAt: new Date(Date.now() - 86400000 * 1).toISOString() },
            { id: "tn_3", name: "Leila", share: 1000, paid: false },
            { id: "tn_4", name: "Omar", share: 1000, paid: false },
          ],
          payments: [
            { ownerId: "owner_old_1", ownerName: "Mr. Hassan El Amrani", amount: 4500, date: new Date(Date.now() - 86400000 * 180).toISOString(), month: new Date(Date.now() - 86400000 * 180).toISOString().slice(0, 7) },
            { ownerId: "owner_old_1", ownerName: "Mr. Hassan El Amrani", amount: 4500, date: new Date(Date.now() - 86400000 * 150).toISOString(), month: new Date(Date.now() - 86400000 * 150).toISOString().slice(0, 7) },
            { ownerId: "owner_old_1", ownerName: "Mr. Hassan El Amrani", amount: 4500, date: new Date(Date.now() - 86400000 * 120).toISOString(), month: new Date(Date.now() - 86400000 * 120).toISOString().slice(0, 7) },
            { ownerId: "owner_new_1", ownerName: "Mrs. Fatima Bennani", amount: 4000, date: new Date(Date.now() - 86400000 * 60).toISOString(), month: new Date(Date.now() - 86400000 * 60).toISOString().slice(0, 7) },
            { ownerId: "owner_new_1", ownerName: "Mrs. Fatima Bennani", amount: 4000, date: new Date(Date.now() - 86400000 * 30).toISOString(), month: new Date(Date.now() - 86400000 * 30).toISOString().slice(0, 7) },
          ],
        },
      },
    ],
  };
};

export default function Dashboard({ user, onLogout, isDark, toggleDark }: DashboardProps) {
  const initial = loadData(user.username);
  const [cards, setCards] = useState<CardData[]>(initial.cards);
  const [generalMoney, setGeneralMoney] = useState<number>(initial.generalMoney);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGeneralModal, setShowGeneralModal] = useState(false);
  const [manageCardId, setManageCardId] = useState<string | null>(null);

  // persist
  React.useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_${user.username}`, JSON.stringify({ cards, generalMoney }));
  }, [cards, generalMoney, user.username]);

  const allocatedTotal = cards.reduce((s, c) => s + c.amount, 0);
  const totalMoney = generalMoney + allocatedTotal;

  const chartData = [
    { name: "General Money (Unallocated)", value: generalMoney, color: isDark ? "#4b5563" : "#94a3b8" },
    ...cards.map(card => ({
      name: card.title,
      value: card.amount,
      color: iconOptions[card.iconIndex].chartColor
    }))
  ];

  const handleAddCard = (title: string, description: string, iconIndex: number, amount: number) => {
    const newCard: CardData = { id: Date.now().toString(), title, description, iconIndex, amount, transactions: [] };
    setCards((prev) => [...prev, newCard]);
    setGeneralMoney((g) => g - amount);
  };

  const handleDeleteCard = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card) {
      // refund the amount back to general
      setGeneralMoney((g) => g + card.amount);
      setCards(cards.filter((c) => c.id !== id));
    }
  };

  const handleTransfer = (cardId: string, delta: number) => {
    // delta > 0 => add money to card from general
    // delta < 0 => withdraw from card back to general
    setCards((prev) => prev.map((c) => {
      if (c.id === cardId) {
        const tx: Transaction = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          amount: Math.abs(delta),
          description: delta > 0 ? "Transfer from General" : "Withdrawal to General",
          type: delta > 0 ? "deposit" : "spend"
        };
        return { 
          ...c, 
          amount: c.amount + delta,
          transactions: [tx, ...(c.transactions || [])]
        };
      }
      return c;
    }));
    setGeneralMoney((g) => g - delta);
  };

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const manageCard = cards.find((c) => c.id === manageCardId) || null;

  if (selectedCardId) {
    const selectedCard = cards.find((c) => c.id === selectedCardId);
    if (selectedCard) {
      return (
        <CardDetail
          card={selectedCard}
          isDark={isDark}
          onBack={() => setSelectedCardId(null)}
          onSpend={(cardId, amount, desc, category) => {
            setCards((prev) => prev.map((c) => {
              if (c.id === cardId) {
                const newTx: Transaction = {
                  id: Date.now().toString(),
                  date: new Date().toISOString(),
                  amount,
                  description: desc,
                  type: 'spend',
                  category,
                };
                return { ...c, amount: c.amount - amount, transactions: [newTx, ...(c.transactions || [])] };
              }
              return c;
            }));
          }}
          onRentalUpdate={(cardId, rental) => {
            setCards((prev) => prev.map((c) => {
              if (c.id !== cardId) return c;
              // When tenants are marked paid, the money is "deposited" into the card; when unmarked, it's reversed.
              const oldPaid = (c.rental?.tenants || []).filter((t) => t.paid);
              const newPaid = rental.tenants.filter((t) => t.paid);
              const oldTotal = oldPaid.reduce((s, t) => s + t.share, 0);
              const newTotal = newPaid.reduce((s, t) => s + t.share, 0);
              const diff = newTotal - oldTotal;
              const txs: Transaction[] = [...(c.transactions || [])];
              if (diff !== 0) {
                txs.unshift({
                  id: `rent_${Date.now()}`,
                  date: new Date().toISOString(),
                  amount: Math.abs(diff),
                  description: diff > 0 ? "Tenant payment received" : "Tenant payment reversed",
                  type: diff > 0 ? "deposit" : "spend",
                  category: "Monthly Rent",
                });
              }
              return { ...c, rental, amount: c.amount + diff, transactions: txs };
            }));
          }}
          onSendToOwner={(cardId, amount, ownerName) => {
            setCards((prev) => prev.map((c) => {
              if (c.id !== cardId) return c;
              const newTx: Transaction = {
                id: `pay_${Date.now()}`,
                date: new Date().toISOString(),
                amount,
                description: `Rent sent to ${ownerName}`,
                type: 'spend',
                category: "Monthly Rent",
              };
              return { ...c, amount: c.amount - amount, transactions: [newTx, ...(c.transactions || [])] };
            }));
          }}
          onResetHistory={(cardId, period) => {
            setCards((prev) => prev.map((c) => {
              if (c.id !== cardId) return c;
              if (period === "all") {
                return { ...c, transactions: [] };
              }
              const ranges = { week: 7, month: 30, year: 365 } as const;
              const cutoff = Date.now() - ranges[period] * 24 * 60 * 60 * 1000;
              const remaining = (c.transactions || []).filter((tx) => new Date(tx.date).getTime() < cutoff);
              return { ...c, transactions: remaining };
            }));
          }}
          username={user.username}
        />
      );
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <header className="w-full px-6 sm:px-8 py-6 flex items-center justify-between gap-4">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 ${isDark ? "text-blue-300" : "text-[#1c3d72]"}`}>
          <CIHLogo />
        </div>

        {/* Money Summary - center */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className={`flex items-stretch rounded-2xl overflow-hidden shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            {/* General Money */}
            <button
              onClick={() => setShowGeneralModal(true)}
              className={`px-6 py-3 text-left transition-colors group ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
            >
              <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                General Money
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className={`text-xl lg:text-2xl font-extrabold ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
                  {formatMoney(generalMoney)}
                </p>
                <span className={`text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>MAD</span>
                <svg className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </button>

            {/* Divider */}
            <div className={`w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

            {/* Total Money */}
            <div className={`px-6 py-3 ${isDark ? "bg-gradient-to-br from-[#1c3d72] to-blue-900" : "bg-gradient-to-br from-[#1c3d72] to-blue-700"} text-white`}>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-70">Total Money</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl lg:text-2xl font-extrabold">{formatMoney(totalMoney)}</p>
                <span className="text-[10px] font-medium opacity-70">MAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          <button
            onClick={toggleDark}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${isDark ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
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

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{user.fullName}</p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>@{user.username}</p>
            </div>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-tr from-[#1c3d72] to-blue-500 text-sm">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${isDark ? "bg-gray-700 text-red-400 hover:bg-red-900/30" : "bg-gray-100 text-red-500 hover:bg-red-50"}`}
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile money summary */}
      <div className="md:hidden px-6 mb-4">
        <div className={`flex rounded-2xl overflow-hidden shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <button onClick={() => setShowGeneralModal(true)} className={`flex-1 px-4 py-3 text-left ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
            <p className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}>General</p>
            <p className={`text-lg font-extrabold ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>{formatMoney(generalMoney)}</p>
          </button>
          <div className={`flex-1 px-4 py-3 ${isDark ? "bg-gradient-to-br from-[#1c3d72] to-blue-900" : "bg-gradient-to-br from-[#1c3d72] to-blue-700"} text-white`}>
            <p className="text-[10px] uppercase font-bold opacity-70">Total</p>
            <p className="text-lg font-extrabold">{formatMoney(totalMoney)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 sm:px-8 pb-24 max-w-7xl">
        <div className="mb-10">
          <h1 className={`text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
            Your Categories
          </h1>
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Welcome back, <span className="font-semibold">{user.fullName}</span>. Manage your expenses below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isDark={isDark}
              onSelect={() => setSelectedCardId(card.id)}
              onDelete={() => handleDeleteCard(card.id)}
              onManage={() => setManageCardId(card.id)}
            />
          ))}
          <AddCardButton onClick={() => setShowAddModal(true)} isDark={isDark} />
        </div>

        {/* Diagram Section */}
        <div className={`mt-16 p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="mb-8">
            <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
              Consumption Diagram
            </h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Visual breakdown of your total money allocation for this month.
            </p>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={150}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${formatMoney(Number(value) || 0)} MAD`, 'Amount']}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                    color: isDark ? '#f3f4f6' : '#111827',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: isDark ? '#e5e7eb' : '#374151', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCard}
        isDark={isDark}
        generalMoney={generalMoney}
      />
      <ManageCardModal
        card={manageCard}
        isOpen={!!manageCard}
        onClose={() => setManageCardId(null)}
        isDark={isDark}
        generalMoney={generalMoney}
        onTransfer={handleTransfer}
      />
      <EditGeneralModal
        isOpen={showGeneralModal}
        onClose={() => setShowGeneralModal(false)}
        isDark={isDark}
        currentValue={generalMoney}
        onSave={setGeneralMoney}
      />
    </div>
  );
}
