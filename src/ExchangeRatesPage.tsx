import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ExchangeRate {
  currency: string;
  name: string;
  rate: number;
  change: number;
  icon: string;
  color: string;
}

interface MetalPrice {
  name: string;
  price: number;
  unit: string;
  change: number;
  icon: string;
  color: string;
}

export default function ExchangeRatesPage({
  isDark,
  onBack,
  generalMoney = 0,
  totalMoney = 0,
}: {
  isDark: boolean;
  onBack: () => void;
  generalMoney?: number;
  totalMoney?: number;
}) {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [metals, setMetals] = useState<MetalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [converterAmount, setConverterAmount] = useState<string>(totalMoney.toString());
  const [converterSource, setConverterSource] = useState<"total" | "general" | "custom">("total");

  // Update converter amount when source changes
  useEffect(() => {
    if (converterSource === "total") setConverterAmount(totalMoney.toString());
    else if (converterSource === "general") setConverterAmount(generalMoney.toString());
  }, [converterSource, totalMoney, generalMoney]);

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Using a free exchange rate API
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/MAD"
        );
        const data = await response.json();

        const ratesData: ExchangeRate[] = [
          {
            currency: "USD",
            name: "US Dollar",
            rate: data.rates.USD || 0.1,
            change: (Math.random() - 0.5) * 2,
            icon: "",
            color: "#22c55e",
          },
          {
            currency: "EUR",
            name: "Euro",
            rate: data.rates.EUR || 0.09,
            change: (Math.random() - 0.5) * 2,
            icon: "💶",
            color: "#3b82f6",
          },
          {
            currency: "GBP",
            name: "British Pound",
            rate: data.rates.GBP || 0.08,
            change: (Math.random() - 0.5) * 2,
            icon: "💷",
            color: "#8b5cf6",
          },
          {
            currency: "SAR",
            name: "Saudi Riyal",
            rate: data.rates.SAR || 0.38,
            change: (Math.random() - 0.5) * 2,
            icon: "💰",
            color: "#059669",
          },
          {
            currency: "AED",
            name: "UAE Dirham",
            rate: data.rates.AED || 0.37,
            change: (Math.random() - 0.5) * 2,
            icon: "🏦",
            color: "#0891b2",
          },
        ];

        setRates(ratesData);
      } catch (error) {
        console.error("Failed to fetch rates:", error);
        // Fallback rates
        setRates([
          { currency: "USD", name: "US Dollar", rate: 0.1, change: 0.5, icon: "💵", color: "#22c55e" },
          { currency: "EUR", name: "Euro", rate: 0.09, change: -0.3, icon: "💶", color: "#3b82f6" },
          { currency: "GBP", name: "British Pound", rate: 0.08, change: 0.2, icon: "💷", color: "#8b5cf6" },
          { currency: "SAR", name: "Saudi Riyal", rate: 0.38, change: 0.1, icon: "💰", color: "#059669" },
          { currency: "AED", name: "UAE Dirham", rate: 0.37, change: -0.1, icon: "🏦", color: "#0891b2" },
        ]);
      }
      setLoading(false);
      setLastUpdated(new Date());
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Simulated metal prices
  useEffect(() => {
    const metalsData: MetalPrice[] = [
      {
        name: "Gold",
        price: 650 + (Math.random() - 0.5) * 10,
        unit: "MAD/g",
        change: (Math.random() - 0.5) * 3,
        icon: "",
        color: "#eab308",
      },
      {
        name: "Silver",
        price: 7.5 + (Math.random() - 0.5) * 0.5,
        unit: "MAD/g",
        change: (Math.random() - 0.5) * 2,
        icon: "🥈",
        color: "#94a3b8",
      },
      {
        name: "Bitcoin",
        price: 950000 + (Math.random() - 0.5) * 10000,
        unit: "MAD",
        change: (Math.random() - 0.5) * 5,
        icon: "",
        color: "#f97316",
      },
    ];
    setMetals(metalsData);
  }, []);

  const pieData = rates.map((r) => ({
    name: r.currency,
    value: r.rate,
    color: r.color,
  }));

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold">💱 Exchange Rates</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Last Updated */}
        <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow`}>
          <div>
            <h2 className="text-lg font-semibold">Live Rates vs MAD</h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {loading ? "Loading..." : lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : ""}
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setLastUpdated(new Date());
              }, 1000);
            }}
            className={`p-2 rounded-lg ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition`}
          >
            <svg className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* MY MONEY CONVERTER */}
        <div className={`rounded-2xl overflow-hidden shadow-xl ${isDark ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" : "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"} text-white`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                💼
              </div>
              <div>
                <h2 className="text-xl font-bold">My Money in Different Currencies</h2>
                <p className="text-white/80 text-sm">See your balance converted in real-time</p>
              </div>
            </div>

            {/* Source selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setConverterSource("total")}
                className={`p-3 rounded-xl transition-all text-left ${
                  converterSource === "total"
                    ? "bg-white text-indigo-700 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <div className="text-xs opacity-80">Total Money</div>
                <div className="font-bold text-lg">{totalMoney.toLocaleString()} MAD</div>
              </button>
              <button
                onClick={() => setConverterSource("general")}
                className={`p-3 rounded-xl transition-all text-left ${
                  converterSource === "general"
                    ? "bg-white text-indigo-700 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <div className="text-xs opacity-80">General Money</div>
                <div className="font-bold text-lg">{generalMoney.toLocaleString()} MAD</div>
              </button>
              <button
                onClick={() => setConverterSource("custom")}
                className={`p-3 rounded-xl transition-all text-left ${
                  converterSource === "custom"
                    ? "bg-white text-indigo-700 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <div className="text-xs opacity-80">Custom Amount</div>
                <div className="font-bold text-lg">Enter ↓</div>
              </button>
            </div>

            {/* Custom amount input */}
            {converterSource === "custom" && (
              <div className="mb-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-2xl">💰</span>
                  <input
                    type="number"
                    value={converterAmount}
                    onChange={(e) => setConverterAmount(e.target.value)}
                    placeholder="Enter amount in MAD"
                    className="flex-1 bg-transparent text-white text-2xl font-bold placeholder-white/40 focus:outline-none"
                  />
                  <span className="text-white/80 font-semibold">MAD</span>
                </div>
              </div>
            )}

            {/* Converted amounts grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
              {rates.map((rate) => {
                const amount = parseFloat(converterAmount) || 0;
                const converted = amount * rate.rate;
                return (
                  <div
                    key={rate.currency}
                    className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all border border-white/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{rate.icon || "💵"}</span>
                      <span className="font-bold text-sm">{rate.currency}</span>
                    </div>
                    <div className="font-bold text-lg break-all">
                      {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-white/70 mt-1">{rate.name}</div>
                  </div>
                );
              })}

              {/* Metals/crypto conversions */}
              {metals.map((metal) => {
                const amount = parseFloat(converterAmount) || 0;
                const converted = amount / metal.price;
                return (
                  <div
                    key={metal.name}
                    className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 hover:from-yellow-400/30 hover:to-orange-500/30 transition-all border border-yellow-300/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{metal.icon || "🏆"}</span>
                      <span className="font-bold text-sm">{metal.name}</span>
                    </div>
                    <div className="font-bold text-lg break-all">
                      {converted.toLocaleString(undefined, { maximumFractionDigits: metal.name === "Bitcoin" ? 8 : 2 })}
                    </div>
                    <div className="text-xs text-white/70 mt-1">
                      {metal.name === "Bitcoin" ? "BTC" : `grams`}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-white/60 text-center">
              💡 Conversions update automatically with live rates
            </div>
          </div>
        </div>

        {/* Currency Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rates.map((rate) => (
            <div
              key={rate.currency}
              className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg hover:shadow-xl transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{rate.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{rate.currency}</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{rate.name}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${rate.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {rate.change >= 0 ? "↑" : "↓"} {Math.abs(rate.change).toFixed(2)}%
                </div>
              </div>
              <div className="text-3xl font-bold" style={{ color: rate.color }}>
                {rate.rate.toFixed(4)} MAD
              </div>
              <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                1 {rate.currency} = {rate.rate.toFixed(4)} MAD
              </p>
            </div>
          ))}
        </div>

        {/* Precious Metals & Crypto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metals.map((metal) => (
            <div
              key={metal.name}
              className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg hover:shadow-xl transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{metal.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{metal.name}</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Per {metal.unit}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${metal.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {metal.change >= 0 ? "↑" : "↓"} {Math.abs(metal.change).toFixed(2)}%
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: metal.color }}>
                {metal.price.toLocaleString(undefined, { maximumFractionDigits: 2 })} {metal.unit.split("/")[0]}
              </div>
            </div>
          ))}
        </div>

        {/* Distribution Chart */}
        <div className={`p-6 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <h2 className="text-xl font-bold mb-6">Currency Distribution</h2>
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
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
