# 💳 CIH Bank — Personal Money Manager

A modern, full-featured personal finance management web application inspired by **CIH Bank Du Maroc**. Manage your money across multiple categories, track consumption with beautiful interactive charts, handle rental properties with multi-tenant payment tracking, and switch between elegant light/dark themes — all in a single, fast, locally-stored app.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-FF6384)

---

## ✨ Features

### 🔐 Authentication
- **Login page** with username/password validation against a local "database"
- **User registration** for creating new accounts
- **Session persistence** — stay logged in across page refreshes
- **Password verification** required for sensitive operations (e.g. deleting history)
- **Pre-loaded demo accounts** so you can start instantly

### 🌓 Theme System
- **Dark / Light mode toggle** available on **both** the Login page and Dashboard
- Theme preference saved in localStorage (persists across sessions and survives login/logout)
- Smooth transitions on every component, modal, chart, and form

### 💰 Money Management
- **General Money** indicator (top-center) — your unallocated balance
- **Total Money** indicator — auto-calculated as `General + sum of all card balances`
- **Deposit / Set Exact** modal for managing your General balance
- **Allocate / Withdraw** money between General and any card
- **Per-user persistence** — each account has its own independent state

### 💳 Category Cards (Food, Saving, Renting, Custom)
- Default cards: **Food** 🍴 (orange), **Saving** 💰 (green), **Renting** 🏠 (blue)
- **+ Add Card** button opens a modal to create custom cards with:
  - Custom title & description
  - 8 preset icons & color schemes (Shopping, Money, Home, Document, Heart, Star, Car, Education)
  - Optional initial allocation from General Money
- **Delete cards** — the balance is automatically refunded to General Money (no money lost!)
- **Click any card** → opens a dedicated detail page

### 📊 Live Consumption Diagram (Dashboard)
- **Interactive donut chart** below the cards (powered by Recharts)
- Each slice colored to match its card's theme color
- Includes a **gray "General Money"** slice for unallocated funds
- **Hover tooltips** show exact MAD amounts
- **Auto-updates** whenever any balance changes anywhere in the app

### 💎 Card Detail Page
Each card opens a full-page view featuring:

- **High-fidelity vertical credit card mockup** styled like a real CIH Bank Mastercard:
  - Custom icon & subtitle for each category
  - Embedded CIH Bank logo, EMV chip, dual Mastercard logos
  - Glowing gold geometric frame
- **Live balance display** with deposit/withdraw quick actions
- **Spend Form** to record purchases with:
  - Description (e.g. *"McDonald's"*)
  - Amount in MAD
  - **Category selector** with icon-pill buttons (categories tailored per card type)
- **Catalog of Consumption** — chronological transaction history with type badges (spend / deposit / withdrawal / rent)
- **📊 Consumption by Category** — donut chart + legend with progress bars showing per-category spending percentages

### 🏠 Rental Management (Renting Card Only)
A specialized section that appears exclusively inside the Renting card:

- **Home Owner Account** — register the current owner with name, IBAN/account, and monthly rent
- **Add Owner** flow — automatically archives the previous owner with start/end dates and rent history
- **4 Tenants Tracker** — manage tenants with names and individual share amounts
  - **Mark Paid / Unpaid** toggle that automatically deposits or refunds the share
  - Each payment logged in the Catalog of Consumption
- **💸 Send to Owner** — unlocks only when **all 4 tenants** have paid:
  - Dynamic progress feedback (amber → green)
  - Click to deduct the collected total and reset all tenants for the next month
- **📈 Monthly Payments by Owner** — multi-color bar chart comparing payments per owner across months
- **💰 Savings Analysis** — green/red comparison panel showing how much you save (or overspend) by switching owners

### 🗑️ Reset History (Per Card)
A safe, two-step destructive action:

- **Step 1 — Period Selection:**
  - This Week (last 7 days)
  - This Month (last 30 days)
  - This Year (last 365 days)
  - **ALL Time** (highlighted in red)
  - Live transaction count shown for each option
- **Step 2 — Double Confirmation:**
  - Type the literal word **`DELETE`**
  - Enter your **account password** (verified via the local database)
- Card balance is **never affected** — only the transaction history is wiped
- All charts and totals re-render instantly

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**

### Install
```bash
npm install
```

### Run in development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production
```bash
npm run build
```
The project is configured with `vite-plugin-singlefile`, so the entire app builds into a **single self-contained `dist/index.html`** file you can host anywhere (or even open directly).

### Preview the production build
```bash
npm run preview
```

---

## 🔑 Demo Accounts

The local database ships pre-loaded with three demo users:

| Username  | Password   |
|-----------|------------|
| `admin`   | `admin123` |
| `user`    | `user123`  |
| `mohamed` | `1234`     |

You can also register a new account from the login page.

---

## 🗂️ Project Structure

```
.
├── public/
│   └── images/              # Generated images (logos, card art)
├── src/
│   ├── App.tsx              # Root: routes between Login & Dashboard, manages session + theme
│   ├── LoginPage.tsx        # Login + Register UI with theme toggle
│   ├── Dashboard.tsx        # Main page: cards grid, money bar, consumption chart
│   ├── CardDetail.tsx       # Full card detail view (credit-card mockup, catalog, charts, rental mgmt)
│   ├── Card.tsx             # Reusable card tile component
│   ├── database.ts          # Local "backend" — users, auth, per-user state in localStorage
│   ├── main.tsx             # Vite entry
│   └── index.css            # Tailwind + global styles + animations
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** — UI framework
- **[TypeScript](https://www.typescriptlang.org/)** — type safety
- **[Vite 7](https://vitejs.dev/)** — lightning-fast build tool
- **[Tailwind CSS 4](https://tailwindcss.com/)** — utility-first styling
- **[Recharts](https://recharts.org/)** — interactive donut & bar charts
- **[vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)** — bundles the entire app into a single HTML file

---

## 🧠 How the "Backend" Works

This app has **no real server** — it ships as a single static HTML file. The "database" is a TypeScript module (`src/database.ts`) that:

1. Maintains an in-memory `users` table seeded with the demo accounts
2. Persists everything to **`localStorage`** under namespaced keys
3. Stores **per-user state** (cards, transactions, general money, rental data) under `cih_user_data_<username>`
4. Exposes auth helpers: `authenticateUser`, `registerUser`, `getCurrentUser`, `setCurrentUser`, `logout`

This means:
- ✅ All data persists across refreshes
- ✅ Each user has fully isolated state
- ✅ Zero infrastructure to deploy — just open the HTML file
- ⚠️ Data lives **only in your browser** — clearing localStorage wipes everything

---

## 🎨 Design Highlights

- **CIH Bank visual identity** — custom SVG logo recreating the blue-ringed *CIH Bank Du Maroc* badge
- **Pure white** light theme with soft shadows; **deep slate** dark theme with subtle gradients
- **Smooth animations** — `fadeIn` and `slideUp` on every modal
- **Hover micro-interactions** on cards, buttons, and chart slices
- **Fully responsive** — money bar reflows below the header on mobile, cards stack into a single column

---

## 📱 Usage Tips

1. **First login?** Try `mohamed` / `1234`.
2. **Click "General Money"** at the top to deposit your salary.
3. **Use "Manage"** on any card to allocate funds from General → Card.
4. **Click a card** to open its detail page and start logging spendings with categories.
5. **In the Renting card**, mark all 4 tenants as paid to unlock the **Send to Owner** button.
6. Switch owners over time and watch the **Savings Analysis** appear automatically.
7. **Toggle the moon/sun** in the top-right at any time to switch themes.

---

## 📝 License

This project was built as a personal demonstration. CIH Bank branding is used for educational/illustrative purposes only and is not affiliated with the actual CIH Bank Du Maroc.

---

## 👨‍💻 Built With ❤️

Crafted iteratively as a full-featured banking-style demo combining authentication, state management, data visualization, and rich interactions — all in a single static HTML file.
