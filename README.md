# 📋 README Structured Categories

---

## 🎯 Meta Info

| Field | Value |
|-------|-------|
| **Title** | CIH Bank — Personal Money Manager |
| **Type** | Personal Finance Web Application |
| **Style** | Inspired by CIH Bank Du Maroc |
| **Build Output** | Single self-contained HTML file |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ React | 19 | UI framework |
| 🔷 TypeScript | 5 | Type safety |
| ⚡ Vite | 7 | Build tool |
| 🎨 Tailwind CSS | 4 | Styling |
| 📊 Recharts | 3 | Charts |
| 📦 vite-plugin-singlefile | — | Single-file bundling |

---

## ✨ Features

### 🔐 Authentication
- Login with username/password validation
- User registration
- Session persistence across refreshes
- Password verification for sensitive actions
- Pre-loaded demo accounts

### 🌓 Theme System
- Dark / Light mode toggle
- Available on Login AND Dashboard
- Preferences saved in localStorage
- Smooth transitions on all components

### 💰 Money Management
- **General Money** — unallocated balance (top-center)
- **Total Money** — General + sum of all cards
- Deposit / Set Exact balance
- Allocate / Withdraw between General and cards
- Per-user isolated state

### 💳 Category Cards
| Card | Icon | Color | Description |
|------|------|-------|-------------|
| Food | 🍴 | Orange | Food expenses |
| Saving | 💰 | Green | Savings |
| Renting | 🏠 | Blue | Rental management |
| Custom | + | 8 presets | User-created cards |

**Card Features:**
- Custom title & description
- 8 preset icons (Shopping, Money, Home, Document, Heart, Star, Car, Education)
- Auto-refund balance on delete

### 📊 Live Consumption Diagram
- Interactive donut chart (Recharts)
- Color-matched slices per card
- Gray slice for General Money
- Hover tooltips with MAD amounts
- Auto-updates on balance changes

### 💎 Card Detail Page
- High-fidelity credit card mockup (CIH Bank Mastercard style)
- Live balance display
- Spend form with category selector
- Catalog of Consumption (transaction history)
- Consumption by Category chart

### 🏠 Rental Management *(Renting Card Only)*
- Home Owner registration (name, IBAN, rent)
- Add/Archive owners with history
- 4 Tenants Tracker with individual shares
- Mark Paid/Unpaid toggle
- Send to Owner (unlocks when all 4 paid)
- Monthly Payments by Owner chart
- Savings Analysis comparison

### 🗑️ Reset History
- Period selection (Week/Month/Year/All)
- Transaction count preview
- Double confirmation (type "DELETE" + password)
- Card balance unaffected

---

## 🚀 Getting Started

### Prerequisites
```
Node.js 18+
npm
```

### Commands

```bash
npm install              # Install dependencies
npm run dev              # Development server
npm run build            # Production build (single HTML)
npm run preview          # Preview production build
```

### Access
```
http://localhost:5173
```

---

## 🔑 Demo Accounts

| Username | Password |
|----------|----------|
| `admin` | `admin123` |
| `user` | `user123` |
| `mohamed` | `1234` |

---

## 📁 Project Structure

```
📦 Project Root
├── 📂 public/images/           # Generated images (logos, card art)
├── 📂 src/
│   ├── App.tsx                 # Root routing, session, theme
│   ├── LoginPage.tsx           # Login + Register UI
│   ├── Dashboard.tsx           # Main page (cards, money bar, chart)
│   ├── CardDetail.tsx          # Card detail view
│   ├── Card.tsx                # Reusable card component
│   ├── database.ts             # Local "backend" (localStorage)
│   ├── main.tsx                # Vite entry
│   └── index.css               # Styles + animations
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🧠 How the "Backend" Works

| Aspect | Implementation |
|--------|----------------|
| **Storage** | localStorage |
| **Data Keys** | `cih_user_data_<username>` |
| **Auth** | `authenticateUser`, `registerUser`, `getCurrentUser`, `setCurrentUser`, `logout` |
| **Persistence** | All data survives refresh |
| **Isolation** | Each user has separate state |

**Pros:** ✅ Persists, ✅ Isolated, ✅ Zero infrastructure
**Cons:** ⚠️ Cleared if localStorage wiped

---

## 🎨 Design Highlights

- ✅ CIH Bank visual identity
- ✅ Pure white light theme / Deep slate dark theme
- ✅ Smooth fadeIn & slideUp animations
- ✅ Hover micro-interactions
- ✅ Fully responsive (mobile-friendly)

---

## 📱 Usage Tips

| Step | Action |
|------|--------|
| 1 | Login with `mohamed` / `1234` |
| 2 | Click "General Money" to deposit salary |
| 3 | Use "Manage" to allocate to cards |
| 4 | Click card to log spendings |
| 5 | In Renting card: mark all 4 tenants paid |
| 6 | Switch owners → watch Savings Analysis |
| 7 | Toggle moon/sun for themes |

---

## 📝 License

> Personal demonstration project. CIH Bank branding is for educational purposes only — not affiliated with CIH Bank Du Maroc.

---

## 👨‍💻 Credits

Built with ❤️ — combining authentication, state management, data visualization, and rich interactions in a single static HTML file.
