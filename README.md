# 🏦 CIH Bank - Digital Wallet & Financial Manager

A powerful, interactive personal finance management dashboard built with **React**, **Vite**, and **Tailwind CSS**. This application is inspired by the **CIH Bank (Morocco)** mobile and web experience, offering a clean digital-first aesthetic with advanced money tracking features.

---

## 🚀 Key Features

### 🔐 Secure Authentication
*   **User Accounts**: Create multiple profiles with unique data persistence.
*   **Persistent Sessions**: Stay logged in even after page refreshes.
*   **Encrypted Feel**: Username and password verification against a simulated local database.

### 💰 Money Management
*   **General Money**: Your "available funds" bucket for unallocated cash.
*   **Total Money**: Real-time calculation of your entire net worth (General + all Cards).
*   **Allocation System**: Transfer funds between your General Money and specific Cards with simple "Manage" controls.

### 💳 Dynamic Card System
*   **Pre-set Categories**: Specialized cards for **Food**, **Saving**, and **Renting**.
*   **Custom Cards**: Add your own custom categories with unique icons, descriptions, and initial balances.
*   **Vertical Digital Cards**: High-fidelity vertical credit card designs for every category with unique gold-etched icons.

### 🏠 Specialized Renting Dashboard
*   **Roommate Tracking**: Manage up to 4 roommates and track who has sent their monthly share.
*   **Homeowner Verification**: Securely "Send to Homeowner" only after all roommates have contributed.
*   **Profit/Savings Insight**: Automatically compares roommate contributions vs. actual rent to show your monthly savings.

### 📊 Consumption & Analytics
*   **Interactive Donut Chart**: A dynamic diagram showing your spending distribution across all categories.
*   **Catalog of Consumption**: Detailed transaction history per card with sub-categories (e.g., *Grocery, Restaurant, Internet, Electricity*).
*   **Real-time Updates**: Every transaction immediately reflects in the global diagrams and totals.

### 🛡️ Privacy & Themes
*   **Dark/Light Mode**: Seamlessly toggle between "Night" and "White" themes with system-wide style adaptation.
*   **Secure Reset**: Clear your history by **Week**, **Month**, **Year**, or **All Time** with a mandatory **password confirmation** step.

---

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS (with Lucide-React icons)
*   **Animations**: Framer Motion
*   **Charts**: Recharts
*   **Storage**: Browser LocalStorage (Persistence per user)

---

## 🚦 Getting Started

### 🔓 Demo Credentials
To explore the app immediately, use one of these pre-loaded accounts:

| Username | Password |
| :--- | :--- |
| **admin** | `admin123` |
| **user** | `user123` |
| **mohamed** | `1234` |

*You can also use the **Register** button to create a fresh account.*

### 🛠️ Installation & Running
1.  **Clone the project**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## 📂 Project Structure

*   `src/App.tsx`: Main routing and theme orchestration.
*   `src/LoginPage.tsx`: Authentication logic and UI.
*   `src/Dashboard.tsx`: Main overview with cards, money bar, and diagrams.
*   `src/CardDetail.tsx`: Individual card views, transaction logs, and Renting logic.
*   `src/database.ts`: LocalStorage management and mock database operations.

---

## 📜 License
*This project was created as a functional UI/UX demo. All bank-related icons and names are for conceptual/educational purposes.*
