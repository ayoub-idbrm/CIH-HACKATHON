import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: "spend" | "deposit";
  category?: string;
}

export interface Tenant {
  id: string;
  name: string;
  share: number; // amount this tenant is supposed to pay
  paid: boolean;
  paidAt?: string;
}

export interface OwnerPayment {
  ownerId: string;
  ownerName: string;
  amount: number;
  date: string; // ISO date
  month: string; // e.g. "2026-03"
}

export interface HomeOwner {
  id: string;
  name: string;
  account: string; // IBAN-like account number
  rentAmount: number;
  active: boolean;
  startDate: string;
  endDate?: string;
}

export interface RentalData {
  owners: HomeOwner[];
  tenants: Tenant[];
  payments: OwnerPayment[]; // history of money sent to owners
}

export interface Subscription {
  id: string;
  name: string;        // e.g. "Netflix"
  plan?: string;       // e.g. "Premium"
  amount: number;      // monthly cost in MAD
  cycle: "monthly" | "yearly";
  category: string;    // Streaming / Music / etc
  color: string;       // brand color (#hex)
  emoji: string;       // brand emoji/icon char
  nextRenewal: string; // ISO date
  active: boolean;     // currently subscribed
  createdAt: string;
}

// Category presets per card type
const CATEGORY_PRESETS: Record<string, { name: string; color: string; icon: string }[]> = {
  food: [
    { name: "Groceries", color: "#22c55e", icon: "🛒" },
    { name: "Restaurant", color: "#f97316", icon: "🍽️" },
    { name: "Fast Food", color: "#ef4444", icon: "🍔" },
    { name: "Coffee & Drinks", color: "#a16207", icon: "☕" },
    { name: "Snacks", color: "#eab308", icon: "🍿" },
    { name: "Other", color: "#64748b", icon: "📦" },
  ],
  saving: [
    { name: "Emergency Fund", color: "#dc2626", icon: "🚨" },
    { name: "Investment", color: "#059669", icon: "📈" },
    { name: "Vacation", color: "#0ea5e9", icon: "✈️" },
    { name: "Big Purchase", color: "#8b5cf6", icon: "🛍️" },
    { name: "Retirement", color: "#1c3d72", icon: "🏖️" },
    { name: "Other", color: "#64748b", icon: "📦" },
  ],
  renting: [
    { name: "Monthly Rent", color: "#1c3d72", icon: "🏠" },
    { name: "Utilities", color: "#eab308", icon: "💡" },
    { name: "Internet & TV", color: "#8b5cf6", icon: "📡" },
    { name: "Maintenance", color: "#f97316", icon: "🔧" },
    { name: "Furniture", color: "#059669", icon: "🛋️" },
    { name: "Other", color: "#64748b", icon: "📦" },
  ],
  subscriptions: [
    { name: "Streaming", color: "#dc2626", icon: "🎬" },
    { name: "Music", color: "#22c55e", icon: "🎵" },
    { name: "Gaming", color: "#8b5cf6", icon: "🎮" },
    { name: "Cloud Storage", color: "#0ea5e9", icon: "☁️" },
    { name: "Software", color: "#f97316", icon: "💻" },
    { name: "Other", color: "#64748b", icon: "📦" },
  ],
  default: [
    { name: "Essential", color: "#1c3d72", icon: "⭐" },
    { name: "Leisure", color: "#f97316", icon: "🎉" },
    { name: "Bills", color: "#dc2626", icon: "📄" },
    { name: "Shopping", color: "#8b5cf6", icon: "🛍️" },
    { name: "Transport", color: "#0ea5e9", icon: "🚗" },
    { name: "Other", color: "#64748b", icon: "📦" },
  ],
};

const getCategoriesForCard = (title: string) => {
  const key = title.toLowerCase();
  return CATEGORY_PRESETS[key] || CATEGORY_PRESETS.default;
};

export interface CardData {
  id: string;
  title: string;
  description: string;
  amount: number;
  iconIndex: number;
  transactions: Transaction[];
  rental?: RentalData;
  subscriptions?: Subscription[];
}

const CIHLogoSmall = () => (
  <svg viewBox="0 0 200 200" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="6" />
    <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M100 28 L105 45 L122 45 L108 55 L114 72 L100 62 L86 72 L92 55 L78 45 L95 45 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <text x="100" y="125" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="64" fill="currentColor" textAnchor="middle" letterSpacing="-3">CIH</text>
    <text x="100" y="145" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="11" fill="currentColor" textAnchor="middle">PIN DANE</text>
    <text x="100" y="160" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="11" fill="currentColor" textAnchor="middle">OU MAREE</text>
  </svg>
);

const ChipIcon = () => (
  <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="30" rx="4" fill="#E5E7EB" />
    <path d="M0 10H10V0M0 20H10V30M40 10H30V0M40 20H30V30M15 0V30M25 0V30M10 15H30" stroke="#9CA3AF" strokeWidth="1" />
  </svg>
);

const MastercardLogo = () => (
  <svg width="44" height="26" viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="13" fill="#D1D5DB" fillOpacity="0.8" />
    <circle cx="31" cy="13" r="13" fill="#E5E7EB" fillOpacity="0.8" />
  </svg>
);

const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

interface CardDetailProps {
  card: CardData;
  isDark: boolean;
  onBack: () => void;
  onSpend: (cardId: string, amount: number, description: string, category?: string) => void;
  onRentalUpdate?: (cardId: string, rental: RentalData) => void;
  onSendToOwner?: (cardId: string, amount: number, ownerName: string) => void;
  onResetHistory?: (cardId: string, period: "week" | "month" | "year" | "all") => void;
  onSubscriptionsUpdate?: (cardId: string, subs: Subscription[]) => void;
  onChargeSubscription?: (cardId: string, sub: Subscription) => void;
  username?: string;
}

export default function CardDetail({ card, isDark, onBack, onSpend, onRentalUpdate, onSendToOwner, onResetHistory, onSubscriptionsUpdate, onChargeSubscription, username }: CardDetailProps) {
  const categories = getCategoriesForCard(card.title);
  const [spendAmount, setSpendAmount] = useState("");
  const [spendDesc, setSpendDesc] = useState("");
  const [spendCategory, setSpendCategory] = useState(categories[0].name);
  const [error, setError] = useState("");
  const isRenting = card.title.toLowerCase() === "renting";
  const isSubscriptions = card.title.toLowerCase() === "subscriptions";

  // Subscriptions state
  const subscriptions: Subscription[] = card.subscriptions || [];
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubPlan, setNewSubPlan] = useState("");
  const [newSubAmount, setNewSubAmount] = useState("");
  const [newSubCycle, setNewSubCycle] = useState<"monthly" | "yearly">("monthly");
  const [newSubCategory, setNewSubCategory] = useState("Streaming");
  const [newSubColor, setNewSubColor] = useState("#dc2626");
  const [newSubEmoji, setNewSubEmoji] = useState("🎬");
  const [subError, setSubError] = useState("");

  // Popular subscription presets
  const SUB_PRESETS = [
    { name: "Netflix", plan: "Premium", amount: 120, category: "Streaming", color: "#e50914", emoji: "🎬" },
    { name: "Spotify", plan: "Premium", amount: 50, category: "Music", color: "#1db954", emoji: "🎵" },
    { name: "Disney+", plan: "Standard", amount: 80, category: "Streaming", color: "#0c2461", emoji: "🏰" },
    { name: "YouTube Premium", plan: "Individual", amount: 60, category: "Streaming", color: "#ff0000", emoji: "▶️" },
    { name: "Apple Music", plan: "Individual", amount: 55, category: "Music", color: "#fc3c44", emoji: "🍎" },
    { name: "Amazon Prime", plan: "Annual", amount: 35, category: "Streaming", color: "#00a8e1", emoji: "📦" },
    { name: "PlayStation Plus", plan: "Essential", amount: 80, category: "Gaming", color: "#0070d1", emoji: "🎮" },
    { name: "Xbox Game Pass", plan: "Ultimate", amount: 130, category: "Gaming", color: "#107c10", emoji: "🎯" },
    { name: "iCloud", plan: "200GB", amount: 30, category: "Cloud Storage", color: "#1c79c0", emoji: "☁️" },
    { name: "Google One", plan: "100GB", amount: 20, category: "Cloud Storage", color: "#4285f4", emoji: "💾" },
    { name: "Adobe CC", plan: "All Apps", amount: 550, category: "Software", color: "#fa0f00", emoji: "🎨" },
    { name: "Microsoft 365", plan: "Personal", amount: 70, category: "Software", color: "#d83b01", emoji: "📊" },
  ];

  const applyPreset = (preset: typeof SUB_PRESETS[0]) => {
    setNewSubName(preset.name);
    setNewSubPlan(preset.plan);
    setNewSubAmount(String(preset.amount));
    setNewSubCategory(preset.category);
    setNewSubColor(preset.color);
    setNewSubEmoji(preset.emoji);
  };

  const updateSubscriptions = (next: Subscription[]) => {
    onSubscriptionsUpdate?.(card.id, next);
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    setSubError("");
    const amt = parseFloat(newSubAmount);
    if (!newSubName.trim() || !amt || amt <= 0) {
      setSubError("Please fill in name and a valid amount.");
      return;
    }
    const sub: Subscription = {
      id: `sub_${Date.now()}`,
      name: newSubName.trim(),
      plan: newSubPlan.trim() || undefined,
      amount: amt,
      cycle: newSubCycle,
      category: newSubCategory,
      color: newSubColor,
      emoji: newSubEmoji,
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
      createdAt: new Date().toISOString(),
    };
    updateSubscriptions([...subscriptions, sub]);
    // reset
    setNewSubName(""); setNewSubPlan(""); setNewSubAmount("");
    setNewSubCategory("Streaming"); setNewSubColor("#dc2626"); setNewSubEmoji("🎬");
    setShowAddSubModal(false);
  };

  const toggleSubActive = (subId: string) => {
    updateSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, active: !s.active } : s))
    );
  };

  const deleteSub = (subId: string) => {
    updateSubscriptions(subscriptions.filter((s) => s.id !== subId));
  };

  const chargeSub = (sub: Subscription) => {
    if (card.amount < sub.amount) {
      alert(`Insufficient balance. Need ${formatMoney(sub.amount)} MAD but only ${formatMoney(card.amount)} MAD available.`);
      return;
    }
    onChargeSubscription?.(card.id, sub);
    // Roll forward renewal
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (sub.cycle === "monthly" ? 30 : 365));
    updateSubscriptions(
      subscriptions.map((s) => (s.id === sub.id ? { ...s, nextRenewal: nextDate.toISOString() } : s))
    );
  };

  const monthlyTotal = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + (s.cycle === "monthly" ? s.amount : s.amount / 12), 0);
  const yearlyTotal = monthlyTotal * 12;

  // Reset history modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPeriod, setResetPeriod] = useState<"week" | "month" | "year" | "all">("week");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetStep, setResetStep] = useState<1 | 2>(1); // step 1: pick + warning, step 2: password

  // How many transactions match the chosen period
  const countTxByPeriod = (period: "week" | "month" | "year" | "all") => {
    const txs = card.transactions || [];
    if (period === "all") return txs.length;
    const now = Date.now();
    const ranges = { week: 7, month: 30, year: 365 } as const;
    const cutoff = now - ranges[period] * 24 * 60 * 60 * 1000;
    return txs.filter((tx) => new Date(tx.date).getTime() >= cutoff).length;
  };

  const periodLabel = (p: string) =>
    p === "week" ? "this Week" : p === "month" ? "this Month" : p === "year" ? "this Year" : "ALL Time";

  const handleResetConfirm = async () => {
    setResetError("");
    if (resetConfirmText.trim().toUpperCase() !== "DELETE") {
      setResetError('Please type "DELETE" to confirm.');
      return;
    }
    if (!resetPassword) {
      setResetError("Password required.");
      return;
    }
    // Verify password against logged-in user via the authenticateUser function from database
    const { authenticateUser } = await import("./database");
    if (!username) {
      setResetError("Session error. Please log in again.");
      return;
    }
    const result = authenticateUser(username, resetPassword);
    if (!result.success) {
      setResetError("Incorrect password. Please try again.");
      return;
    }
    onResetHistory?.(card.id, resetPeriod);
    // close & reset
    setShowResetModal(false);
    setResetPassword("");
    setResetConfirmText("");
    setResetError("");
    setResetStep(1);
  };

  // Rental local helpers
  const rental: RentalData = card.rental || { owners: [], tenants: [], payments: [] };
  const activeOwner = rental.owners.find((o) => o.active) || null;
  const allTenantsPaid = rental.tenants.length > 0 && rental.tenants.every((t) => t.paid);
  const totalCollected = rental.tenants.filter((t) => t.paid).reduce((s, t) => s + t.share, 0);

  const updateRental = (next: RentalData) => {
    onRentalUpdate?.(card.id, next);
  };

  const togglePaid = (tenantId: string) => {
    const next: RentalData = {
      ...rental,
      tenants: rental.tenants.map((t) =>
        t.id === tenantId ? { ...t, paid: !t.paid, paidAt: !t.paid ? new Date().toISOString() : undefined } : t
      ),
    };
    updateRental(next);
  };

  const handleSendToOwner = () => {
    if (!activeOwner || !allTenantsPaid) return;
    const amount = totalCollected;
    if (amount > card.amount + 0.001) {
      // need to ensure card has the funds (tenants paid means money is in card already, but safety)
      alert(`Insufficient balance on the card. Need ${formatMoney(amount)} MAD.`);
      return;
    }
    const monthKey = new Date().toISOString().slice(0, 7);
    const payment: OwnerPayment = {
      ownerId: activeOwner.id,
      ownerName: activeOwner.name,
      amount,
      date: new Date().toISOString(),
      month: monthKey,
    };
    const next: RentalData = {
      ...rental,
      payments: [payment, ...rental.payments],
      // Reset tenants to unpaid for next month
      tenants: rental.tenants.map((t) => ({ ...t, paid: false, paidAt: undefined })),
    };
    updateRental(next);
    onSendToOwner?.(card.id, amount, activeOwner.name);
  };

  // --- Owner & tenant editor state ---
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerAccount, setOwnerAccount] = useState("");
  const [ownerRent, setOwnerRent] = useState("");

  const addOwner = () => {
    if (!ownerName.trim() || !ownerAccount.trim() || !ownerRent) return;
    const newOwner: HomeOwner = {
      id: `owner_${Date.now()}`,
      name: ownerName.trim(),
      account: ownerAccount.trim(),
      rentAmount: parseFloat(ownerRent),
      active: true,
      startDate: new Date().toISOString(),
    };
    // Deactivate previous owners and stamp endDate
    const today = new Date().toISOString();
    const next: RentalData = {
      ...rental,
      owners: [
        ...rental.owners.map((o) => (o.active ? { ...o, active: false, endDate: today } : o)),
        newOwner,
      ],
    };
    updateRental(next);
    setOwnerName("");
    setOwnerAccount("");
    setOwnerRent("");
    setShowOwnerForm(false);
  };

  // Tenant editor
  const [tenantName, setTenantName] = useState("");
  const [tenantShare, setTenantShare] = useState("");

  const addTenant = () => {
    if (!tenantName.trim() || !tenantShare) return;
    if (rental.tenants.length >= 4) {
      alert("Maximum 4 tenants allowed.");
      return;
    }
    const newTenant: Tenant = {
      id: `t_${Date.now()}`,
      name: tenantName.trim(),
      share: parseFloat(tenantShare),
      paid: false,
    };
    updateRental({ ...rental, tenants: [...rental.tenants, newTenant] });
    setTenantName("");
    setTenantShare("");
  };

  const removeTenant = (id: string) => {
    updateRental({ ...rental, tenants: rental.tenants.filter((t) => t.id !== id) });
  };

  // Owner comparison data: total per month per owner, plus avg per owner
  const ownerComparison = useMemo(() => {
    if (!isRenting) return { perOwner: [], months: [] as string[], dataset: [] as any[] };
    const perOwner = rental.owners.map((o) => {
      const ownerPayments = rental.payments.filter((p) => p.ownerId === o.id);
      const total = ownerPayments.reduce((s, p) => s + p.amount, 0);
      const avg = ownerPayments.length ? total / ownerPayments.length : o.rentAmount;
      return { ...o, total, avg, count: ownerPayments.length };
    });

    // Build month dataset
    const monthSet = new Set<string>();
    rental.payments.forEach((p) => monthSet.add(p.month));
    const months = Array.from(monthSet).sort();
    const dataset = months.map((m) => {
      const row: any = { month: m };
      rental.owners.forEach((o) => {
        const payment = rental.payments.find((p) => p.month === m && p.ownerId === o.id);
        row[o.name] = payment ? payment.amount : 0;
      });
      return row;
    });

    return { perOwner, months, dataset };
  }, [rental, isRenting]);

  // Savings comparison: between current active owner and the most recent previous owner
  const savingsAnalysis = useMemo(() => {
    if (!isRenting || !activeOwner) return null;
    const previousOwners = rental.owners.filter((o) => !o.active);
    if (previousOwners.length === 0) return null;
    // Most recent prev owner = highest endDate
    const sorted = [...previousOwners].sort((a, b) => (b.endDate || "").localeCompare(a.endDate || ""));
    const previousOwner = sorted[0];
    const diffPerMonth = previousOwner.rentAmount - activeOwner.rentAmount;
    const monthsCount = ownerComparison.perOwner.find((o) => o.id === activeOwner.id)?.count || 0;
    const totalSavedSoFar = diffPerMonth * monthsCount;
    return {
      previousOwner,
      currentOwner: activeOwner,
      diffPerMonth,
      monthsCount,
      totalSavedSoFar,
      saving: diffPerMonth > 0,
    };
  }, [isRenting, activeOwner, rental.owners, ownerComparison]);

  const handleSpend = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(spendAmount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (amt > card.amount) {
      setError(`Insufficient balance. You only have ${formatMoney(card.amount)} MAD.`);
      return;
    }
    if (!spendDesc.trim()) {
      setError("Enter a description.");
      return;
    }
    onSpend(card.id, amt, spendDesc.trim(), spendCategory);
    setSpendAmount("");
    setSpendDesc("");
    setError("");
  };

  // Compute category breakdown from transactions
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    (card.transactions || [])
      .filter((tx) => tx.type === "spend")
      .forEach((tx) => {
        const cat = tx.category || "Other";
        map.set(cat, (map.get(cat) || 0) + tx.amount);
      });
    return categories
      .map((c) => ({
        name: c.name,
        value: map.get(c.name) || 0,
        color: c.color,
        icon: c.icon,
      }))
      .filter((c) => c.value > 0);
  }, [card.transactions, categories]);

  const totalSpent = categoryBreakdown.reduce((s, c) => s + c.value, 0);

  const getCardTitle = () => {
    if (card.title.toLowerCase() === "food") return "GENERAL ACCESS";
    if (card.title.toLowerCase() === "saving") return "SAVING LOGIN";
    if (card.title.toLowerCase() === "renting") return "RENTAL LOGIN";
    return `${card.title.toUpperCase()} ACCESS`;
  };

  const getCardSubtitle = () => {
    if (card.title.toLowerCase() === "food") return "FOR ALL YOUR EVERYDAY MATTERS";
    if (card.title.toLowerCase() === "saving") return "GROWTH THROUGH CONSISTENCY";
    if (card.title.toLowerCase() === "renting") return "SECURE ACCESS";
    return "SECURE ACCESS";
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} py-8 px-4 sm:px-8 transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className={`mb-8 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        <div className="grid lg:grid-cols-[auto_1fr] gap-12 items-start">
          
          {/* Vertical Credit Card - The "Image" mockup */}
          <div className="flex justify-center">
            <div className="relative w-80 h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-[#0a1128] border border-slate-700 p-6 flex flex-col justify-between group">
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="text-[#1e293b] opacity-80 mix-blend-color-dodge">
                  <CIHLogoSmall />
                </div>
                <div className="mt-2">
                  <ChipIcon />
                </div>
              </div>

              {/* Center Logo/Icon */}
              <div className="flex flex-col items-center justify-center my-4 relative">
                {/* Glow behind icon */}
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
                
                {/* Gold geometric frame */}
                <div className="absolute inset-0 z-0 text-[#847346]/40 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
                    <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
                    <circle cx="50" cy="50" r="38" />
                    <path d="M50 5 V95 M10 25 L90 75 M10 75 L90 25" strokeWidth="0.5" />
                  </svg>
                </div>

                {/* Icon Placeholder based on type */}
                <div className="w-24 h-24 text-yellow-500 opacity-90 relative z-10 flex items-center justify-center bg-slate-900/50 rounded-full backdrop-blur-sm border border-yellow-500/20 p-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                   {card.title.toLowerCase() === 'food' && (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-24 h-24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                   )}
                   {card.title.toLowerCase() === 'saving' && (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-24 h-24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                     </svg>
                   )}
                   {card.title.toLowerCase() === 'renting' && (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-24 h-24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                     </svg>
                   )}
                   {!['food', 'saving', 'renting'].includes(card.title.toLowerCase()) && (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-24 h-24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                     </svg>
                   )}
                </div>
              </div>

              {/* Text Info */}
              <div className="text-center mb-6">
                <h2 className="text-[#a1894a] text-xl font-black tracking-widest">{getCardTitle()}</h2>
                <p className="text-[#847346] text-[8px] font-bold tracking-widest mt-1 uppercase">{getCardSubtitle()}</p>
              </div>

              {/* Bottom Details */}
              <div className="mt-auto">
                <div className="text-slate-400 font-mono text-lg tracking-[0.2em] mb-1">
                  [ XXXX XXXX XXXX ]
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-slate-500 font-mono text-xs tracking-widest">
                    VALID<br/>THRU <span className="text-slate-400 text-sm">12/30</span>
                  </div>
                  <div className="text-right">
                    <MastercardLogo />
                    <div className="text-slate-500 text-[8px] font-bold tracking-wider mt-1">mastercard.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Balance & Transactions */}
          <div className="flex flex-col gap-8">
            {/* Balance Card */}
            <div className={`p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <p className={`text-sm uppercase font-bold tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Available Balance</p>
              <h1 className={`text-5xl font-extrabold ${isDark ? "text-emerald-400" : "text-[#1c3d72]"}`}>
                {formatMoney(card.amount)} <span className="text-2xl font-medium opacity-60">MAD</span>
              </h1>
            </div>

            {/* Spend Action */}
            <div className={`p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <h3 className="text-xl font-bold mb-4">Record a Transaction</h3>
              <form onSubmit={handleSpend} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={spendDesc}
                    onChange={(e) => setSpendDesc(e.target.value)}
                    placeholder="What did you buy?"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                      isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"
                    }`}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={spendAmount}
                    onChange={(e) => { setSpendAmount(e.target.value); setError(""); }}
                    placeholder="Amount (MAD)"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                      isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#1c3d72]"
                    }`}
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const active = spendCategory === cat.name;
                      return (
                        <button
                          type="button"
                          key={cat.name}
                          onClick={() => setSpendCategory(cat.name)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 font-semibold text-sm transition-all ${
                            active
                              ? "text-white shadow-lg scale-105"
                              : isDark
                                ? "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                          style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-[#1c3d72] text-white rounded-xl font-bold hover:bg-[#15305c] transition-colors"
                >
                  Spend
                </button>
              </form>
              {error && <p className="text-red-500 mt-3 text-sm font-semibold">{error}</p>}
            </div>

            {/* Category Breakdown Chart */}
            <div className={`p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <svg className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-[#1c3d72]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Consumption by Category
                </h3>
                <div className={`text-right ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <p className="text-xs uppercase font-bold tracking-wider">Total Spent</p>
                  <p className={`text-xl font-extrabold ${isDark ? "text-red-400" : "text-red-500"}`}>
                    {formatMoney(totalSpent)} MAD
                  </p>
                </div>
              </div>

              {categoryBreakdown.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Spend money to see your category breakdown.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* Pie chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          stroke={isDark ? "#1f2937" : "#fff"}
                          strokeWidth={3}
                        >
                          {categoryBreakdown.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: any) => [`${formatMoney(Number(v))} MAD`, "Spent"]}
                          contentStyle={{
                            backgroundColor: isDark ? "#1f2937" : "#fff",
                            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                            borderRadius: 12,
                            color: isDark ? "#fff" : "#111",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend with bars */}
                  <div className="space-y-3">
                    {categoryBreakdown.map((c) => {
                      const pct = totalSpent > 0 ? (c.value / totalSpent) * 100 : 0;
                      return (
                        <div key={c.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`flex items-center gap-2 font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                              <span>{c.icon}</span>
                              <span>{c.name}</span>
                            </span>
                            <span className={`text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              {formatMoney(c.value)} <span className="opacity-60 text-xs">({pct.toFixed(1)}%)</span>
                            </span>
                          </div>
                          <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: c.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Catalog of Consumption */}
            <div className={`p-8 rounded-3xl shadow-lg border flex-1 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <svg className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-[#1c3d72]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Catalog of Consumption
                </h3>
                {(card.transactions && card.transactions.length > 0) && (
                  <button
                    onClick={() => { setShowResetModal(true); setResetStep(1); setResetPeriod("week"); setResetPassword(""); setResetConfirmText(""); setResetError(""); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors ${
                      isDark ? "border-red-800 text-red-400 hover:bg-red-900/20" : "border-red-300 text-red-600 hover:bg-red-50"
                    }`}
                    title="Reset transaction history"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                    Reset History
                  </button>
                )}
              </div>

              {!card.transactions || card.transactions.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No transactions recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {[...card.transactions].reverse().map((tx) => (
                    <div key={tx.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "spend" ? "bg-red-100 text-red-500" : "bg-emerald-100 text-emerald-500"
                        }`}>
                          {tx.type === "spend" ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{tx.description}</p>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{new Date(tx.date).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${tx.type === "spend" ? "text-red-500" : "text-emerald-500"}`}>
                        {tx.type === "spend" ? "-" : "+"}{formatMoney(tx.amount)} MAD
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====== RENTING-ONLY: RENTAL MANAGEMENT SECTION ====== */}
        {isRenting && (
          <div className="mt-12 space-y-8">
            <div className="flex items-center gap-3">
              <div className={`h-px flex-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <h2 className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
                🏠 Rental Management
              </h2>
              <div className={`h-px flex-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>

            {/* Home Owner Section */}
            <div className={`p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🏛️</span> Home Owner
                </h3>
                <button
                  onClick={() => setShowOwnerForm((v) => !v)}
                  className="px-4 py-2 bg-[#1c3d72] text-white rounded-xl font-semibold hover:bg-[#15305c] transition-colors text-sm"
                >
                  {showOwnerForm ? "Cancel" : activeOwner ? "Change Owner" : "+ Add Owner"}
                </button>
              </div>

              {/* Active Owner Card */}
              {activeOwner ? (
                <div className={`p-6 rounded-2xl border-2 ${isDark ? "bg-gradient-to-br from-blue-900/30 to-slate-900/40 border-blue-700/50" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"}`}>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#1c3d72] flex items-center justify-center text-white text-2xl font-bold">
                        {activeOwner.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-blue-300" : "text-[#1c3d72]"}`}>Current Owner</p>
                        <h4 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>{activeOwner.name}</h4>
                        <p className={`text-sm font-mono mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Acc: {activeOwner.account}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Monthly Rent</p>
                      <p className={`text-3xl font-extrabold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        {formatMoney(activeOwner.rentAmount)} <span className="text-base opacity-70">MAD</span>
                      </p>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Since {new Date(activeOwner.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                  No home owner registered yet. Click "+ Add Owner" to start.
                </div>
              )}

              {/* Owner add form */}
              {showOwnerForm && (
                <div className={`mt-6 p-6 rounded-2xl border-2 ${isDark ? "bg-gray-900/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-sm font-bold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {activeOwner ? "Replacing the current owner will archive them in your history." : "Add a new home owner."}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Owner full name"
                      className={`px-4 py-3 rounded-xl border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                    />
                    <input
                      value={ownerAccount}
                      onChange={(e) => setOwnerAccount(e.target.value)}
                      placeholder="Account / IBAN"
                      className={`px-4 py-3 rounded-xl border-2 focus:outline-none font-mono ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={ownerRent}
                      onChange={(e) => setOwnerRent(e.target.value)}
                      placeholder="Monthly rent (MAD)"
                      className={`px-4 py-3 rounded-xl border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                    />
                  </div>
                  <button
                    onClick={addOwner}
                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Save Owner
                  </button>
                </div>
              )}

              {/* Previous owners */}
              {rental.owners.filter((o) => !o.active).length > 0 && (
                <div className="mt-6">
                  <p className={`text-xs uppercase font-bold tracking-widest mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Previous Owners</p>
                  <div className="space-y-2">
                    {rental.owners.filter((o) => !o.active).map((o) => (
                      <div key={o.id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? "bg-gray-900/40" : "bg-gray-50"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                            {o.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>{o.name}</p>
                            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                              {new Date(o.startDate).toLocaleDateString()} → {o.endDate ? new Date(o.endDate).toLocaleDateString() : "Now"}
                            </p>
                          </div>
                        </div>
                        <div className={`text-right text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {formatMoney(o.rentAmount)} MAD/mo
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tenants Section */}
            <div className={`p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">👥</span> Tenants ({rental.tenants.length}/4)
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Track who has paid their share this month.
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Collected</p>
                  <p className={`text-2xl font-extrabold ${allTenantsPaid ? "text-emerald-500" : isDark ? "text-yellow-400" : "text-amber-600"}`}>
                    {formatMoney(totalCollected)} MAD
                  </p>
                </div>
              </div>

              {/* Tenants list */}
              <div className="space-y-3 mb-4">
                {rental.tenants.length === 0 ? (
                  <div className={`text-center py-6 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                    Add up to 4 tenants below.
                  </div>
                ) : (
                  rental.tenants.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between gap-3 p-4 rounded-2xl border-2 transition-colors ${
                        t.paid
                          ? isDark
                            ? "bg-emerald-900/20 border-emerald-700/40"
                            : "bg-emerald-50 border-emerald-200"
                          : isDark
                            ? "bg-gray-900/40 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white ${
                          t.paid ? "bg-emerald-500" : "bg-gray-400"
                        }`}>
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{t.name}</p>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            Share: {formatMoney(t.share)} MAD {t.paid && t.paidAt && `· paid ${new Date(t.paidAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePaid(t.id)}
                          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                            t.paid
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : isDark
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {t.paid ? "✓ Paid" : "Mark Paid"}
                        </button>
                        <button
                          onClick={() => removeTenant(t.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? "bg-red-900/40 text-red-400 hover:bg-red-900/60" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                          title="Remove tenant"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add tenant form */}
              {rental.tenants.length < 4 && (
                <div className={`p-4 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                    <input
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="Tenant name"
                      className={`px-4 py-3 rounded-xl border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={tenantShare}
                      onChange={(e) => setTenantShare(e.target.value)}
                      placeholder="Share amount (MAD)"
                      className={`px-4 py-3 rounded-xl border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                    />
                    <button
                      onClick={addTenant}
                      className="px-6 py-3 bg-[#1c3d72] text-white rounded-xl font-semibold hover:bg-[#15305c] transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}

              {/* Send to Owner big button */}
              <div className={`mt-6 p-6 rounded-2xl ${
                allTenantsPaid && activeOwner
                  ? isDark ? "bg-gradient-to-r from-emerald-900/40 to-green-900/30 border-2 border-emerald-700/50" : "bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300"
                  : isDark ? "bg-gray-900/40 border-2 border-gray-700" : "bg-gray-50 border-2 border-gray-200"
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Ready to transfer</p>
                    <p className={`text-2xl font-extrabold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {formatMoney(totalCollected)} MAD → {activeOwner ? activeOwner.name : "(no owner set)"}
                    </p>
                    <p className={`text-sm mt-1 ${
                      allTenantsPaid ? "text-emerald-500 font-bold" : isDark ? "text-yellow-400" : "text-amber-600"
                    }`}>
                      {rental.tenants.length === 0
                        ? "⚠ Add tenants first."
                        : allTenantsPaid
                          ? "✓ All tenants have paid! You can send the rent."
                          : `⏳ Waiting for ${rental.tenants.filter((t) => !t.paid).length} tenant(s) to pay.`}
                    </p>
                  </div>
                  <button
                    onClick={handleSendToOwner}
                    disabled={!allTenantsPaid || !activeOwner}
                    className={`px-8 py-4 rounded-2xl font-extrabold text-lg transition-all ${
                      allTenantsPaid && activeOwner
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:scale-105 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    💸 Send to Owner
                  </button>
                </div>
              </div>
            </div>

            {/* Owner Comparison + Savings */}
            {ownerComparison.perOwner.length > 0 && (
              <div className={`p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <span className="text-3xl">📊</span> Monthly Payments by Owner
                </h3>
                <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Compare how much you sent to past and current home owners each month.
                </p>

                {ownerComparison.dataset.length === 0 ? (
                  <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                    Send rent at least once to see the comparison chart.
                  </div>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ownerComparison.dataset}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                        <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} />
                        <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} />
                        <Tooltip
                          formatter={(v: any) => [`${formatMoney(Number(v))} MAD`, ""]}
                          contentStyle={{
                            backgroundColor: isDark ? "#1f2937" : "#fff",
                            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                            borderRadius: 12,
                            color: isDark ? "#fff" : "#111",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        {rental.owners.map((o, idx) => {
                          const palette = ["#1c3d72", "#10b981", "#f97316", "#a855f7", "#ef4444", "#0ea5e9"];
                          return (
                            <Bar key={o.id} dataKey={o.name} fill={palette[idx % palette.length]} radius={[8, 8, 0, 0]} />
                          );
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Per-owner totals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {ownerComparison.perOwner.map((o, idx) => {
                    const palette = ["#1c3d72", "#10b981", "#f97316", "#a855f7", "#ef4444", "#0ea5e9"];
                    const color = palette[idx % palette.length];
                    return (
                      <div key={o.id} className={`p-4 rounded-2xl border-2 ${isDark ? "bg-gray-900/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{o.name}</p>
                          {o.active && <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>}
                        </div>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total sent</p>
                        <p className={`text-xl font-extrabold ${isDark ? "text-white" : "text-gray-800"}`}>{formatMoney(o.total)} MAD</p>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {o.count} payment(s) · Avg {formatMoney(o.avg)} MAD
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Savings analysis vs previous owner */}
                {savingsAnalysis && (
                  <div className={`mt-6 p-6 rounded-2xl border-2 ${
                    savingsAnalysis.saving
                      ? isDark ? "bg-emerald-900/20 border-emerald-700/50" : "bg-emerald-50 border-emerald-200"
                      : isDark ? "bg-red-900/20 border-red-700/50" : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {savingsAnalysis.saving ? "💰 You're saving!" : "📈 You're paying more"}
                        </p>
                        <p className={`text-lg font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                          vs. previous owner <span className="opacity-70">({savingsAnalysis.previousOwner.name})</span>
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Old: <strong>{formatMoney(savingsAnalysis.previousOwner.rentAmount)} MAD/mo</strong>
                          {" "}→ New: <strong>{formatMoney(savingsAnalysis.currentOwner.rentAmount)} MAD/mo</strong>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {savingsAnalysis.saving ? "Saved" : "Extra cost"} so far
                        </p>
                        <p className={`text-4xl font-extrabold ${
                          savingsAnalysis.saving ? "text-emerald-500" : "text-red-500"
                        }`}>
                          {savingsAnalysis.saving ? "+" : "-"}{formatMoney(Math.abs(savingsAnalysis.totalSavedSoFar))} <span className="text-base font-medium opacity-70">MAD</span>
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                          over {savingsAnalysis.monthsCount} month(s) · {savingsAnalysis.saving ? "+" : "-"}{formatMoney(Math.abs(savingsAnalysis.diffPerMonth))} MAD/month
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ====== SUBSCRIPTIONS-ONLY: SUBSCRIPTIONS MANAGEMENT ====== */}
        {isSubscriptions && (
          <div className="mt-12 space-y-8">
            <div className="flex items-center gap-3">
              <div className={`h-px flex-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <h2 className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
                📺 My Subscriptions
              </h2>
              <div className={`h-px flex-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow`}>
                <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Active</p>
                <p className={`text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-[#1c3d72]"}`}>
                  {subscriptions.filter((s) => s.active).length}
                  <span className={`text-sm font-medium ml-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>of {subscriptions.length}</span>
                </p>
              </div>
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow`}>
                <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Monthly Cost</p>
                <p className={`text-3xl font-extrabold mt-1 text-emerald-500`}>
                  {formatMoney(monthlyTotal)}
                  <span className="text-sm opacity-70 ml-1">MAD</span>
                </p>
              </div>
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow`}>
                <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Yearly Cost</p>
                <p className={`text-3xl font-extrabold mt-1 ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                  {formatMoney(yearlyTotal)}
                  <span className="text-sm opacity-70 ml-1">MAD</span>
                </p>
              </div>
            </div>

            {/* Subscriptions Grid */}
            <div className={`p-8 rounded-3xl shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#1c3d72]"}`}>Your Services</h3>
                <button
                  onClick={() => setShowAddSubModal(true)}
                  className="px-4 py-2 bg-[#1c3d72] text-white rounded-xl font-semibold hover:bg-[#15305c] transition-colors text-sm"
                >
                  + Add Subscription
                </button>
              </div>

              {subscriptions.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                  <p className="text-5xl mb-3">📺</p>
                  <p className="font-semibold mb-1">No subscriptions yet</p>
                  <p className="text-sm">Click "+ Add Subscription" to track Netflix, Spotify, and more.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscriptions.map((sub) => {
                    const daysUntil = Math.ceil((new Date(sub.nextRenewal).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const renewalSoon = daysUntil <= 7 && daysUntil >= 0;
                    return (
                      <div
                        key={sub.id}
                        className={`relative p-5 rounded-2xl border-2 transition-all ${
                          sub.active
                            ? isDark ? "bg-gray-900/40 border-gray-700" : "bg-white border-gray-200"
                            : isDark ? "bg-gray-900/20 border-gray-800 opacity-60" : "bg-gray-50 border-gray-200 opacity-60"
                        } shadow-sm hover:shadow-lg`}
                        style={{ borderLeftWidth: "6px", borderLeftColor: sub.color }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                              style={{ backgroundColor: sub.color + "20", color: sub.color }}
                            >
                              {sub.emoji}
                            </div>
                            <div>
                              <h4 className={`font-extrabold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>{sub.name}</h4>
                              {sub.plan && <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{sub.plan}</p>}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteSub(sub.id)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-red-900/40 text-gray-500 hover:text-red-400" : "hover:bg-red-50 text-gray-400 hover:text-red-600"}`}
                            title="Delete subscription"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <p className={`text-2xl font-extrabold`} style={{ color: sub.color }}>
                              {formatMoney(sub.amount)} <span className="text-xs font-medium opacity-70">MAD</span>
                            </p>
                            <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                              per {sub.cycle === "monthly" ? "month" : "year"} · {sub.category}
                            </p>
                          </div>
                        </div>

                        {sub.active && (
                          <div className={`text-xs mb-3 ${renewalSoon ? "text-amber-500 font-bold" : isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {renewalSoon ? "⏰ " : "📅 "}
                            {daysUntil < 0
                              ? `Overdue by ${-daysUntil} day(s)`
                              : daysUntil === 0
                              ? "Renews today!"
                              : `Renews in ${daysUntil} day(s)`}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleSubActive(sub.id)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                              sub.active
                                ? isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : isDark ? "bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {sub.active ? "⏸ Pause" : "▶ Resume"}
                          </button>
                          {sub.active && (
                            <button
                              onClick={() => chargeSub(sub)}
                              disabled={card.amount < sub.amount}
                              className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-[#1c3d72] hover:bg-[#15305c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              title={card.amount < sub.amount ? "Insufficient balance" : "Charge this subscription"}
                            >
                              💸 Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========== ADD SUBSCRIPTION MODAL ========== */}
      {showAddSubModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowAddSubModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            } animate-slideUp`}
          >
            <div className="bg-gradient-to-r from-[#1c3d72] to-blue-700 px-6 py-5 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold">Add Subscription</h3>
                  <p className="text-xs text-blue-100 font-medium">Pick a popular service or add your own</p>
                </div>
                <button
                  onClick={() => setShowAddSubModal(false)}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Presets */}
              <div>
                <p className={`text-xs uppercase font-bold tracking-widest mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Popular Services</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SUB_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        newSubName === p.name
                          ? "border-[#1c3d72] shadow-md"
                          : isDark ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={newSubName === p.name ? { backgroundColor: p.color + "15" } : {}}
                    >
                      <div className="text-2xl mb-1">{p.emoji}</div>
                      <div className={`text-xs font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{p.name}</div>
                      <div className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{p.amount} MAD</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddSub} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Service Name *</label>
                    <input
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      placeholder="e.g. Netflix"
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Plan</label>
                    <input
                      value={newSubPlan}
                      onChange={(e) => setNewSubPlan(e.target.value)}
                      placeholder="e.g. Premium"
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Amount (MAD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newSubAmount}
                      onChange={(e) => setNewSubAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Billing Cycle</label>
                    <div className={`flex p-1 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                      <button
                        type="button"
                        onClick={() => setNewSubCycle("monthly")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${newSubCycle === "monthly" ? "bg-[#1c3d72] text-white shadow" : isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewSubCycle("yearly")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${newSubCycle === "yearly" ? "bg-[#1c3d72] text-white shadow" : isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Category</label>
                    <select
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-[#1c3d72]"}`}
                    >
                      <option>Streaming</option>
                      <option>Music</option>
                      <option>Gaming</option>
                      <option>Cloud Storage</option>
                      <option>Software</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Icon & Color</label>
                    <div className="flex gap-2">
                      <input
                        value={newSubEmoji}
                        onChange={(e) => setNewSubEmoji(e.target.value)}
                        maxLength={2}
                        className={`w-16 px-3 py-2 rounded-lg border-2 text-center text-xl focus:outline-none ${isDark ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-gray-50 border-gray-200 focus:border-[#1c3d72]"}`}
                      />
                      <input
                        type="color"
                        value={newSubColor}
                        onChange={(e) => setNewSubColor(e.target.value)}
                        className={`flex-1 h-10 rounded-lg border-2 cursor-pointer ${isDark ? "border-gray-600 bg-gray-700" : "border-gray-200"}`}
                      />
                    </div>
                  </div>
                </div>

                {subError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl">
                    {subError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSubModal(false)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#1c3d72] text-white py-3 rounded-xl font-bold hover:bg-[#15305c] transition-colors"
                  >
                    Add Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========== RESET HISTORY MODAL ========== */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowResetModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-3xl shadow-2xl border-2 ${
              isDark ? "bg-gray-800 border-red-900/50" : "bg-white border-red-200"
            } overflow-hidden animate-slideUp`}
          >
            {/* Red warning header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Reset Transaction History</h3>
                  <p className="text-xs text-red-100 font-medium">This action is permanent and cannot be undone.</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {resetStep === 1 ? (
                <>
                  {/* Period Selection */}
                  <div>
                    <label className={`block text-sm font-bold mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Select period to delete:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["week", "month", "year", "all"] as const).map((p) => {
                        const count = countTxByPeriod(p);
                        const selected = resetPeriod === p;
                        const labels: Record<string, string> = { week: "📅 This Week", month: "🗓️ This Month", year: "📆 This Year", all: "🗑️ ALL Time" };
                        const isAll = p === "all";
                        return (
                          <button
                            key={p}
                            onClick={() => setResetPeriod(p)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              selected
                                ? isAll
                                  ? "border-red-500 bg-red-500/10 ring-2 ring-red-500/30"
                                  : "border-[#1c3d72] bg-[#1c3d72]/10 ring-2 ring-[#1c3d72]/20"
                                : isDark
                                ? "border-gray-700 hover:border-gray-600 bg-gray-900/40"
                                : "border-gray-200 hover:border-gray-300 bg-gray-50"
                            }`}
                          >
                            <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"} ${isAll && selected ? "text-red-500" : ""}`}>
                              {labels[p]}
                            </p>
                            <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              {count} transaction{count !== 1 ? "s" : ""} affected
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className={`p-4 rounded-2xl border-2 ${
                    resetPeriod === "all"
                      ? isDark ? "bg-red-900/30 border-red-700" : "bg-red-50 border-red-300"
                      : isDark ? "bg-amber-900/20 border-amber-700/50" : "bg-amber-50 border-amber-300"
                  }`}>
                    <div className="flex gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {resetPeriod === "all" ? "🚨" : "⚠️"}
                      </span>
                      <div>
                        <p className={`font-bold text-sm ${
                          resetPeriod === "all"
                            ? isDark ? "text-red-300" : "text-red-700"
                            : isDark ? "text-amber-300" : "text-amber-800"
                        }`}>
                          {resetPeriod === "all" ? "DANGER: Permanent Total Deletion" : "Warning"}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          You are about to permanently delete <strong>{countTxByPeriod(resetPeriod)} transaction(s)</strong> from <strong>{periodLabel(resetPeriod)}</strong>.
                          {" "}This will also remove them from your category breakdown and totals. <strong>Card balance will NOT change.</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowResetModal(false)}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors ${
                        isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { setResetStep(2); setResetError(""); }}
                      disabled={countTxByPeriod(resetPeriod) === 0}
                      className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Step 2: Password confirmation */}
                  <div className={`p-4 rounded-2xl ${isDark ? "bg-red-900/20 border border-red-800" : "bg-red-50 border border-red-200"}`}>
                    <p className={`text-sm ${isDark ? "text-red-300" : "text-red-700"}`}>
                      You're about to delete <strong>{countTxByPeriod(resetPeriod)} transaction(s)</strong> from <strong>{periodLabel(resetPeriod)}</strong>.
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Type <span className="font-mono bg-red-500/20 text-red-500 px-2 py-0.5 rounded">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={resetConfirmText}
                      onChange={(e) => setResetConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className={`w-full px-4 py-3 rounded-xl border-2 font-mono font-bold tracking-widest transition-colors ${
                        isDark
                          ? "bg-gray-900 border-gray-700 text-white focus:border-red-500"
                          : "bg-white border-gray-200 text-gray-900 focus:border-red-500"
                      } focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      🔒 Enter your account password
                    </label>
                    <input
                      type="password"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") handleResetConfirm(); }}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                        isDark
                          ? "bg-gray-900 border-gray-700 text-white focus:border-red-500"
                          : "bg-white border-gray-200 text-gray-900 focus:border-red-500"
                      } focus:outline-none`}
                    />
                    {username && (
                      <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        Logged in as <span className="font-bold">{username}</span>
                      </p>
                    )}
                  </div>

                  {resetError && (
                    <div className={`p-3 rounded-xl text-sm font-semibold ${
                      isDark ? "bg-red-900/30 text-red-300 border border-red-800" : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      ❌ {resetError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setResetStep(1)}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors ${
                        isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleResetConfirm}
                      className="flex-1 px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-colors shadow-lg"
                    >
                      🗑️ Confirm Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
