# Expense Tracker — Full-Stack Personal Finance & College Evaluation Project

A full-stack Expense Tracker web application built with **React, TypeScript, Tailwind CSS, Express, and SQLite**, complete with financial analytics, interactive charts, budget limits, multi-currency support, and a dedicated **College Project & Viva Demonstration Hub** (including a reference **Django REST Framework** implementation).

---

## 📌 Project Overview

This project satisfies both real-world personal finance management needs and academic evaluation criteria for Web Development / Full-Stack courses. It demonstrates:
- **ACID-compliant relational database persistence** using SQLite (`expenses.db`).
- **RESTful API architecture** with Express (and equivalent Django REST Framework reference).
- **Interactive client-side data visualizations** (Category Donut Chart, Monthly Trend Bar Chart, and Payment Mode distribution).
- **Responsive design** with dual-level validation, multi-filter search, and currency localization.
- **Academic presentation utilities**: in-browser REST API testing console, interactive ER diagram viewer, 13-step Viva demonstration walkthrough, and Postman collection export.

---

## 🛠 Tech Stack

### Frontend
- **React 18** with **TypeScript** & **Vite**
- **Tailwind CSS** for responsive styling
- **Lucide React** for consistent iconography
- **Custom Interactive SVG Charts** (Donut & Bar charts with hover states)

### Backend & Storage
- **Node.js** + **Express** server (`server.ts`)
- **SQLite3** via `better-sqlite3` with automated seeding
- **Django REST Framework Reference** (`/backend`) including models, serializers, viewsets, URLs, admin configuration, and 16 unit tests

---

## ✨ Key Features

### 1. Financial Dashboard & Overview
- **Key Metric Cards**: Total Expenses, This Month's Expenses, This Week's Expenses, and Total Transactions.
- **Interactive Category Donut Chart**: Hover-enabled SVG breakdown with percentage labels and color-coded legends.
- **Monthly Trend Bar Chart**: Visualizes expenditure patterns across recent months.
- **Payment Method Distribution**: Tracks Cash, UPI, Credit Card, Debit Card, and Bank Transfer allocations.
- **Monthly Budget Tracker**: Real-time progress bar with threshold indicators:
  - 🟢 Normal (0% – 79%)
  - 🟡 Warning (80% – 99%)
  - 🔴 Over-Budget (100%+)

### 2. Full CRUD Operations
- **Add Expense**: Form with real-time validation, category badges, payment options, date picker, and custom notes. Auto-generates sequential expense IDs (`EXP001`, `EXP002`, ...).
- **View All Expenses**: Paginated data table with category color chips, transaction dates, amounts, and quick actions.
- **View Details**: Modal with breakdown into **Expense Information**, **Payment Details**, and **Audit Timestamps**.
- **Edit Expense**: Pre-filled update dialog with validation and instant recalculation of dashboard totals.
- **Delete Expense**: Protected by an accessible confirmation dialog.

### 3. Search & Multi-Factor Filtering
- Instant full-text search across Title, ID, Description, Category, Payment Method, and Notes.
- Filter by:
  - **Category**: Food, Transportation, Shopping, Bills, Entertainment, Healthcare, Education, Travel, Rent, Other.
  - **Payment Method**: Cash, UPI, Credit Card, Debit Card, Bank Transfer.
  - **Date Range**: From Date to To Date.
  - **Amount Range**: Minimum and Maximum thresholds.
- Sort by: Newest First, Oldest First, Highest Amount, Lowest Amount.

### 4. Reports & Analytics View
- Summary statistics: Total Spend, Average Transaction Value, Highest Expense, Lowest Expense.
- Annual breakdown table for all 12 months.
- Category share percentages with bar-width visualizers.

### 5. Multi-Currency Support & Data Management
- Multi-currency switcher: **INR (₹)**, **USD ($)**, **EUR (€)**, **GBP (£)** with Indian numbering formatting for INR (`1,00,000.00`).
- **Export SQLite Data**: Single-click JSON backup export.
- **Reset Sample Database**: Restores the 12 pre-seeded sample transactions with a single click.

### 6. College Project & Viva Demonstration Hub
- **13-Step Viva Walkthrough**: Interactive presentation guide with step-by-step instructions and examiner Q&A.
- **Live In-Browser API Console**: Test `GET`, `POST`, `PUT`, `DELETE` endpoints directly inside the web UI without external tools.
- **Database ER Schema Viewer**: Visual table schemas showing primary keys, constraints, and data types for both `expenses` and `budgets` tables.
- **Postman Collection Download**: One-click download of `Expense_Tracker.postman_collection.json`.
- **Django Code Viewer**: Syntax-highlighted viewer for Django models, serializers, views, URLs, admin, and test files.

---

## 🗄 Database Schema (SQLite)

### Table: `expenses`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique row identifier |
| `expense_id` | TEXT | UNIQUE NOT NULL | Formatted ID (`EXP001`) |
| `title` | TEXT | NOT NULL | Title of the expense |
| `description` | TEXT | NULL | Detailed notes |
| `amount` | REAL | NOT NULL CHECK(amount > 0) | Monetary spend |
| `category` | TEXT | NOT NULL | One of 10 standard categories |
| `payment_method`| TEXT | NOT NULL | Cash, UPI, Card, etc. |
| `expense_date` | TEXT | NOT NULL (YYYY-MM-DD) | Date of transaction |
| `notes` | TEXT | NULL | Additional remarks |
| `created_at` | TEXT | NOT NULL (ISO 8601) | Record creation timestamp |
| `updated_at` | TEXT | NOT NULL (ISO 8601) | Last update timestamp |

### Table: `budgets`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique row identifier |
| `month` | INTEGER | NOT NULL (1–12) | Target month |
| `year` | INTEGER | NOT NULL | Target year |
| `amount` | REAL | NOT NULL CHECK(amount > 0) | Budget limit |
| `created_at` | TEXT | NOT NULL (ISO 8601) | Creation timestamp |
| `updated_at` | TEXT | NOT NULL (ISO 8601) | Last update timestamp |

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and engine status |
| `GET` | `/api/expenses` | List expenses (supports search, filters, pagination, sort) |
| `GET` | `/api/expenses/:id` | Retrieve single expense by numeric ID or formatted ID |
| `POST` | `/api/expenses` | Create a new expense record |
| `PUT` | `/api/expenses/:id` | Update an existing expense record |
| `DELETE` | `/api/expenses/:id` | Delete an expense record |
| `GET` | `/api/expenses/search?q=query` | Full-text search across all fields |
| `GET` | `/api/stats/dashboard` | Dashboard analytics (totals, trends, category & payment breakdowns) |
| `GET` | `/api/budget?month=M&year=YYYY` | Retrieve monthly budget limit and current utilization |
| `POST` | `/api/budget` | Update monthly budget limit |
| `POST` | `/api/reset-data` | Re-seed the SQLite database with 12 default sample records |

---

## 📁 Project Structure

```
├── backend/                  # Reference Django REST Framework implementation
│   ├── expenses/
│   │   ├── admin.py          # Django Admin panel configuration
│   │   ├── models.py         # Django ORM models (Expense, Budget)
│   │   ├── serializers.py    # DRF ModelSerializers with field validation
│   │   ├── tests.py          # 16 automated unit & API tests
│   │   ├── urls.py           # API route mappings
│   │   └── views.py          # ModelViewSet and API view functions
│   ├── manage.py             # Django CLI manager
│   └── requirements.txt      # Python dependencies
├── src/                      # React Frontend
│   ├── components/           # Extracted UI components
│   │   ├── BudgetProgress.tsx    # Budget card with progress bar
│   │   ├── ChartCard.tsx         # SVG Donut Chart and Trend Chart
│   │   ├── CollegeHub.tsx        # Viva Demo, API Console & ER Diagram
│   │   ├── ConfirmDialog.tsx     # Delete confirmation modal
│   │   ├── ExpenseDetailModal.tsx# Comprehensive view modal
│   │   ├── ExpenseForm.tsx       # Add / Edit expense modal form
│   │   ├── ExpenseTable.tsx      # Paginated data table
│   │   ├── FilterBar.tsx         # Multi-field filtering bar
│   │   ├── MetricCard.tsx        # Dashboard metric summary cards
│   │   ├── Navbar.tsx            # Header with currency selector & quick actions
│   │   ├── Notification.tsx      # Toast notifications
│   │   ├── ReportsView.tsx       # Deep-dive analytics & annual reports
│   │   ├── SettingsView.tsx      # Currency, backup export, and database reset
│   │   └── Sidebar.tsx           # Primary navigation drawer
│   ├── services/
│   │   └── expenseService.ts     # Client HTTP service for API communication
│   ├── types.ts                  # Shared TypeScript interfaces & types
│   ├── utils/
│   │   └── formatters.ts         # Currency formatting & category metadata
│   ├── App.tsx                   # Main application state & view controller
│   ├── index.css                 # Global Tailwind CSS styles
│   └── main.tsx                  # React DOM entry point
├── expenses.db               # SQLite database file
├── server.ts                 # Full-Stack Express API server + Vite middleware
├── package.json              # NPM dependencies & scripts
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or newer
- **npm** or **bun**

### Installation
1. Clone or extract the project repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm run dev
```
The application will boot at **`http://localhost:3000`** with live hot reloading and backend API services running concurrently.

### Production Build
Compile both client assets and server bundle:
```bash
npm run build
npm start
```

---

## 🧪 Testing

### Backend Unit Tests (Django Reference)
To run the automated test suite in the `/backend` environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py test expenses
```
The 16 tests cover:
- Expense creation, retrieval, updates, and deletion.
- Search and multi-parameter filtering (category, payment method, date range).
- Input validation (empty title, negative amounts, invalid categories).
- Metric and budget limit calculations.

---

## 🎓 College Viva & Evaluation Tips

1. **How is data persisted?**
   - The app uses an ACID-compliant **SQLite database** (`expenses.db`) with parameterized SQL statements via `better-sqlite3` to prevent SQL injection.
2. **How does the budget calculation work?**
   - The backend aggregates the sum of expenses matching the active month and compares it with the budget record for that period to compute `percentage` and the `isOverBudget` flag.
3. **What prevents duplicate IDs?**
   - Expense IDs follow the `EXP001` format. The server checks the existing count and ensures uniqueness before committing new records.
4. **How are charts rendered?**
   - The charts are created using mathematical SVG coordinate calculations (`strokeDasharray`, `strokeDashoffset`, and dynamic viewBox widths) without heavy external chart dependencies.
