<div align="center">

<h1>🚀 CIH Smart Pockets</h1>

**Visual Envelope Budgeting • Shared Rent Management • Multi-Currency Wealth**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

</div>

<br/>

## 🎯 4 Core Pillars

| 💳 **1. Purpose Cards** | 🏠 **2. Rent Manager** | 💱 **3. Global Wealth** | 👨‍👩‍👧 **4. Payroll system** |
| :--- | :--- | :--- | :--- |
| • Digital envelopes<br>• Custom icons & colors<br>• Isolated tracking<br>• Category analytics | • Track 4 tenants<br>• Auto-unlock rent payment<br>• Compare owner costs<br>• Track savings | • Live API rates<br>• Total MAD converter<br>• Crypto & Metals<br>• 7-day trend charts | • Family allowances<br>• Worker salaries<br>• Payment history<br>• Expense distributions |

<br/>

## 🗺️ App Architecture

```mermaid
graph TD;
    Login[🔐 Login] --> Hub[🏠 Main Dashboard];
    
    Hub --> C[💳 Virtual Cards];
    C --> Food[🍔 Food & Groceries];
    C --> Rent[🏠 Shared Rent];
    C --> Save[💰 Savings Goals];
    C --> Subs[📺 Subscriptions];
    C --> Custom[✨ Custom Cards];

    Hub --> N[🧭 Top Navigation];
    N --> Family[👨‍👩‍👧 Family Board];
    N --> Workers[👷 Workers Board];
    N --> Exchange[💱 Exchange & Wealth];
    N --> Profile[👤 Profile Settings];
```

<br/>

## 💸 Money Engine Flow

```mermaid
stateDiagram-v2
    [*] --> GeneralMoney: 🏦 Income / Salary
    GeneralMoney --> VirtualCard: 📥 Allocate Funds
    VirtualCard --> GeneralMoney: 📤 Refund
    VirtualCard --> Spending: 💸 Log Transaction
    Spending --> Catalog: 📜 Save to History
    Catalog --> LiveChart: 📊 Auto-Update Donut Charts
```

<br/>

## 🏠 Shared Rent Logic

```mermaid
sequenceDiagram
    participant T as 👥 4 Tenants
    participant C as 💳 Rent Card
    participant L as 🏠 Landlord

    T->>C: Pay Share (Youssef ✓)
    T->>C: Pay Share (Karim ✓)
    T->>C: Pay Share (Leila ✓)
    T->>C: Pay Share (Omar ✓)
    
    Note over C: 🔓 "Send Rent" Button Unlocks
    
    C->>L: 💸 Transfer Total Rent
    Note over C: 🔄 Tenants reset to unpaid for next month
```

<br/>

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local server
npm run dev
```

| 👤 User | 🔑 Password |
| :--- | :--- |
| `admin` | `admin123` |
| `mohamed` | `1234` |
