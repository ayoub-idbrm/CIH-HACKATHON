Perfect ✅ — I’ll convert your README into a **structured categorized block format** using clean section markers.

I’ll use this format:

```
::SECTION_NAME::
content...

::SUBSECTION::
content...
```

This keeps it:
- ✅ Human readable
- ✅ Machine parsable
- ✅ Clearly categorized
- ✅ Not boring plain text

---

Here is your transformed structured version:

---

```
::PROJECT::
Name: CIH Bank — Personal Money Manager
Type: Personal Finance Web Application
Inspiration: CIH Bank Du Maroc
Storage: Fully Local (localStorage)
Build Output: Single self-contained HTML file

::TECH_BADGES::
React 19
TypeScript 5
Vite 7
Tailwind CSS 4
Recharts 3

::OVERVIEW::
Modern personal finance manager with multi-category money tracking,
interactive charts, rental management with tenant tracking,
light/dark themes, and full local persistence.

--------------------------------------------------

::FEATURES::

::AUTHENTICATION::
- Login with local database validation
- User registration
- Session persistence
- Password verification for sensitive actions
- Preloaded demo accounts

::THEME_SYSTEM::
- Dark / Light toggle (Login + Dashboard)
- Saved in localStorage
- Smooth UI transitions

::MONEY_MANAGEMENT::
- General Money balance
- Auto-calculated Total Money
- Deposit / Set Exact modal
- Allocate / Withdraw between General and Cards
- Per-user isolated state

::CATEGORY_CARDS::
Default:
  - Food (orange)
  - Saving (green)
  - Renting (blue)

Custom Cards:
  - Custom title + description
  - 8 preset icons
  - 8 color schemes
  - Optional initial allocation

Card Rules:
  - Delete card → balance refunded to General
  - Click card → opens detail page

::LIVE_DASHBOARD_CHART::
Type: Donut Chart
Library: Recharts
Includes:
  - Slice per card
  - Gray slice for General Money
  - Hover tooltips
  - Auto updates on balance change

--------------------------------------------------

::CARD_DETAIL_PAGE::

::VISUAL_CARD_UI::
- Vertical credit card mockup
- Custom icon & subtitle
- CIH logo
- EMV chip
- Mastercard logos
- Gold glowing frame

::BALANCE_ACTIONS::
- Deposit
- Withdraw

::SPEND_FORM::
Inputs:
  - Description
  - Amount (MAD)
  - Category selector (icon pills)

::TRANSACTION_CATALOG::
- Chronological history
- Type badges:
    spend
    deposit
    withdrawal
    rent

::CATEGORY_ANALYTICS::
- Donut chart
- Legend with progress bars
- Percentage breakdown

--------------------------------------------------

::RENTAL_MANAGEMENT:: (Renting Card Only)

::OWNER_SYSTEM::
- Register owner (name, IBAN, rent)
- Add new owner auto-archives previous
- Owner payment history tracking

::TENANT_TRACKER::
- 4 tenants
- Individual share amounts
- Mark Paid / Unpaid
- Auto deposit / refund logic
- Logged in catalog

::SEND_TO_OWNER_FLOW::
Condition: All 4 tenants paid
Features:
  - Dynamic progress color
  - Deduct total rent
  - Reset tenants for next month

::OWNER_ANALYTICS::
- Monthly payments bar chart
- Savings comparison (green/red panel)

--------------------------------------------------

::RESET_HISTORY::

::STEP_1_PERIOD_SELECTION::
Options:
  - This Week (7 days)
  - This Month (30 days)
  - This Year (365 days)
  - ALL Time (red)

Shows live transaction count.

::STEP_2_CONFIRMATION::
Requirements:
  - Type DELETE
  - Enter account password

Rules:
  - Balance unchanged
  - Only history removed
  - Charts auto re-render

--------------------------------------------------

::GETTING_STARTED::

::PREREQUISITES::
Node.js 18+
npm

::INSTALL::
Command: npm install

::DEV_RUN::
Command: npm run dev
URL: http://localhost:5173

::BUILD_PRODUCTION::
Command: npm run build
Output: Single dist/index.html (via vite-plugin-singlefile)

::PREVIEW_BUILD::
Command: npm run preview

--------------------------------------------------

::DEMO_ACCOUNTS::
admin / admin123
user / user123
mohamed / 1234

--------------------------------------------------

::PROJECT_STRUCTURE::
public/images → logos & card art
src/App.tsx → routing + session + theme
src/LoginPage.tsx → login/register
src/Dashboard.tsx → cards + money + chart
src/CardDetail.tsx → full detail + rental system
src/Card.tsx → reusable tile
src/database.ts → local backend + persistence
src/main.tsx → entry point
src/index.css → Tailwind + animations
index.html
package.json
vite.config.ts
README.md

--------------------------------------------------

::TECH_STACK::
React 19 → UI
TypeScript → Type safety
Vite 7 → Build tool
Tailwind CSS 4 → Styling
Recharts → Charts
vite-plugin-singlefile → Single file bundle

--------------------------------------------------

::BACKEND_ARCHITECTURE::
Server: None
Type: Static app

Database Logic:
  - In-memory users table
  - localStorage persistence
  - Per-user namespace: cih_user_data_<username>

Auth Helpers:
  authenticateUser
  registerUser
  getCurrentUser
  setCurrentUser
  logout

Notes:
  ✅ Data persists across refresh
  ✅ Per-user isolation
  ⚠️ Clearing localStorage deletes all data

--------------------------------------------------

::DESIGN_HIGHLIGHTS::
- CIH Bank visual identity
- Light: pure white + soft shadows
- Dark: deep slate + gradients
- Smooth animations
- Hover micro-interactions
- Fully responsive layout

--------------------------------------------------

::USAGE_TIPS::
1. Login with mohamed / 1234
2. Deposit salary into General Money
3. Allocate funds to cards
4. Log spendings inside card detail
5. In Renting card → mark all tenants paid
6. Send to owner when unlocked
7. Toggle theme anytime

--------------------------------------------------

::LICENSE::
Educational demo.
Not affiliated with CIH Bank Du Maroc.

--------------------------------------------------

::AUTHOR_NOTE::
Full-featured banking-style demo combining:
- Authentication
- State management
- Data visualization
- Rich UI interactions
Delivered as a single static HTML file.
```

---

If you’d like, I can now:

- 🔥 Convert it into a **compact AI-training format**
- ⚙ Convert it into **JSON structured data**
- 🧠 Convert it into a **knowledge-base optimized format**
- 🧩 Create your own mini markup language**
- 📦 Create a README-to-database schema version**

Just tell me the target use.
