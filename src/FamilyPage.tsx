import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getUserData, saveUserData, authenticateUser } from "./database";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  allowance: number;
  paid: boolean;
  paymentHistory: { date: string; amount: number }[];
}

export default function FamilyPage({
  user,
  isDark,
  onBack,
  onGeneralMoneyChange,
}: {
  user: any;
  isDark: boolean;
  onBack: () => void;
  onGeneralMoneyChange: (amount: number) => void;
}) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", relationship: "", allowance: "" });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPeriod, setResetPeriod] = useState<"week" | "month" | "year" | "all">("month");
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [resetError, setResetError] = useState("");

  // Load family data
  useEffect(() => {
    const data = getUserData(user.username);
    if (data?.familyMembers) {
      setMembers(data.familyMembers);
    } else {
      // Demo data
      const demoMembers: FamilyMember[] = [
        { id: "1", name: "Spouse", relationship: "Spouse", allowance: 3000, paid: true, paymentHistory: [{ date: "2025-01-01", amount: 3000 }] },
        { id: "2", name: "Child 1", relationship: "Child", allowance: 1000, paid: true, paymentHistory: [{ date: "2025-01-01", amount: 1000 }] },
        { id: "3", name: "Child 2", relationship: "Child", allowance: 1000, paid: false, paymentHistory: [{ date: "2025-01-01", amount: 1000 }] },
        { id: "4", name: "Parent", relationship: "Parent", allowance: 2000, paid: false, paymentHistory: [{ date: "2025-01-01", amount: 2000 }] },
      ];
      setMembers(demoMembers);
      saveUserData(user.username, { familyMembers: demoMembers });
    }
  }, [user.username]);

  const totalAllowance = members.reduce((sum, m) => sum + m.allowance, 0);
  const paidAmount = members.filter((m) => m.paid).reduce((sum, m) => sum + m.allowance, 0);

  const pieData = members.map((m) => ({
    name: m.name,
    value: m.allowance,
    color: m.paid ? "#22c55e" : "#eab308",
  }));

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.allowance) return;
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      relationship: newMember.relationship,
      allowance: parseFloat(newMember.allowance),
      paid: false,
      paymentHistory: [],
    };
    const updated = [...members, member];
    setMembers(updated);
    saveUserData(user.username, { familyMembers: updated });
    setNewMember({ name: "", relationship: "", allowance: "" });
    setShowAddModal(false);
  };

  const togglePaid = (id: string) => {
    const updated = members.map((m) => {
      if (m.id === id) {
        const newPaid = !m.paid;
        if (newPaid) {
          // Deduct from general money
          onGeneralMoneyChange(-m.allowance);
          return {
            ...m,
            paid: true,
            paymentHistory: [...m.paymentHistory, { date: new Date().toISOString().split("T")[0], amount: m.allowance }],
          };
        } else {
          // Refund to general money
          onGeneralMoneyChange(m.allowance);
          return {
            ...m,
            paid: false,
            paymentHistory: m.paymentHistory.slice(0, -1),
          };
        }
      }
      return m;
    });
    setMembers(updated);
    saveUserData(user.username, { familyMembers: updated });
  };

  const handleResetHistory = async () => {
    if (confirmText !== "DELETE") {
      setResetError("Please type DELETE to confirm");
      return;
    }
    const valid = await authenticateUser(user.username, password);
    if (!valid) {
      setResetError("Incorrect password");
      return;
    }

    const now = new Date();
    let cutoffDate: Date;
    switch (resetPeriod) {
      case "week":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "all":
        cutoffDate = new Date(0);
        break;
    }

    const updated = members.map((m) => ({
      ...m,
      paymentHistory: m.paymentHistory.filter((h) => new Date(h.date) > cutoffDate),
    }));
    setMembers(updated);
    saveUserData(user.username, { familyMembers: updated });
    setShowResetModal(false);
    setConfirmText("");
    setPassword("");
    setResetError("");
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold">👨‍👩‍👦 Family Expenses</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
            <h3 className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total Monthly Allowance</h3>
            <p className="text-3xl font-bold text-[#1c3d72]">{totalAllowance.toLocaleString()} MAD</p>
          </div>
          <div className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
            <h3 className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Paid This Month</h3>
            <p className="text-3xl font-bold text-green-500">{paidAmount.toLocaleString()} MAD</p>
          </div>
          <div className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
            <h3 className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Remaining to Pay</h3>
            <p className="text-3xl font-bold text-amber-500">{(totalAllowance - paidAmount).toLocaleString()} MAD</p>
          </div>
        </div>

        {/* Add Member Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className={`w-full p-4 rounded-xl border-2 border-dashed ${isDark ? "border-gray-600 hover:border-[#1c3d72] hover:bg-gray-800" : "border-gray-300 hover:border-[#1c3d72] hover:bg-gray-50"} transition-all flex items-center justify-center gap-2`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Add Family Member</span>
        </button>

        {/* Family Members List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Family Members</h2>
            {members.some((m) => m.paymentHistory.length > 0) && (
              <button
                onClick={() => setShowResetModal(true)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                🗑️ Reset History
              </button>
            )}
          </div>
          {members.map((member) => (
            <div key={member.id} className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${member.paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {member.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{member.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{member.allowance.toLocaleString()} MAD</p>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {member.paymentHistory.length} payment(s)
                    </p>
                  </div>
                  <button
                    onClick={() => togglePaid(member.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      member.paid
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : isDark
                        ? "bg-gray-700 hover:bg-amber-600 text-white"
                        : "bg-gray-200 hover:bg-amber-500 hover:text-white"
                    }`}
                  >
                    {member.paid ? "✓ Paid" : "Mark Paid"}
                  </button>
                </div>
              </div>
              {member.paymentHistory.length > 0 && (
                <div className={`mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mb-2`}>Recent Payments:</p>
                  <div className="flex flex-wrap gap-2">
                    {member.paymentHistory.slice(-5).map((h, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        {h.date}: {h.amount} MAD
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Distribution Chart */}
        <div className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <h2 className="text-xl font-bold mb-6">Allowance Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-2xl`}>
            <h2 className="text-xl font-bold mb-4">Add Family Member</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#1c3d72]`}
              />
              <input
                type="text"
                placeholder="Relationship (e.g., Child, Spouse)"
                value={newMember.relationship}
                onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#1c3d72]`}
              />
              <input
                type="number"
                placeholder="Monthly Allowance (MAD)"
                value={newMember.allowance}
                onChange={(e) => setNewMember({ ...newMember, allowance: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#1c3d72]`}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="flex-1 px-4 py-2 rounded-lg bg-[#1c3d72] text-white hover:bg-[#2a4d8a] transition"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-2xl`}>
            <h2 className="text-xl font-bold mb-4">🗑️ Reset Payment History</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(["week", "month", "year", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setResetPeriod(p)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    resetPeriod === p
                      ? p === "all"
                        ? "bg-red-500 text-white"
                        : "bg-[#1c3d72] text-white"
                      : isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {p === "week" && "📅 This Week"}
                  {p === "month" && "🗓️ This Month"}
                  {p === "year" && "📆 This Year"}
                  {p === "all" && "🗑️ ALL Time"}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type DELETE to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border font-mono ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-red-500`}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border mt-3 ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-red-500`}
            />
            {resetError && <p className="text-red-500 text-sm mt-2">{resetError}</p>}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setConfirmText("");
                  setPassword("");
                  setResetError("");
                }}
                className={`flex-1 px-4 py-2 rounded-lg ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition`}
              >
                ← Back
              </button>
              <button
                onClick={handleResetHistory}
                disabled={confirmText !== "DELETE"}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                🗑️ Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
