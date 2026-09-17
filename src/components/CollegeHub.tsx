import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Code2,
  Terminal,
  Send,
  Database,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const CollegeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viva' | 'report' | 'api-test' | 'django' | 'er-diagram'>('viva');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State for Live API Tester
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [apiUrl, setApiUrl] = useState<string>('/api/expenses');
  const [apiBody, setApiBody] = useState<string>('{\n  "title": "College Lab Manuals",\n  "amount": 450.00,\n  "category": "Education",\n  "payment_method": "UPI",\n  "expense_date": "2026-09-17"\n}');
  const [apiResponse, setApiResponse] = useState<string>('Click "Send API Request" to execute a live test against SQLite backend.');
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunApiTest = async () => {
    setApiLoading(true);
    setApiResponse('Sending request...');
    try {
      const options: RequestInit = {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      if (apiMethod === 'POST' || apiMethod === 'PUT') {
        options.body = apiBody;
      }

      const res = await fetch(apiUrl, options);
      setApiStatus(res.status);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiStatus(500);
      setApiResponse(`Error: ${err.message}`);
    } finally {
      setApiLoading(false);
    }
  };

  const demonstrationSteps = [
    { step: 1, title: 'Inspect Architecture & Backend Server', desc: 'Verify SQLite database initialized, tables created, and REST endpoints exposed.' },
    { step: 2, title: 'Open Dashboard & Review Summary Stats', desc: 'Observe Total Expenses, This Month, This Week, and Total Transactions calculated dynamically.' },
    { step: 3, title: 'Category Donut & Monthly Spending Trends', desc: 'Interact with SVG Category Donut chart, hover legends, and monthly bar chart.' },
    { step: 4, title: 'Open Expenses Table Page', desc: 'Review existing SQLite records with currency formatting, category color badges, and payment methods.' },
    { step: 5, title: 'Demonstrate Frontend & Backend Validation', desc: 'Attempt saving an expense with negative amount or missing title to verify rejection.' },
    { step: 6, title: 'Add a New Valid Expense', desc: 'Create a new expense (e.g. "College Semester Project Books", ₹1,200, Education, UPI).' },
    { step: 7, title: 'Search & Dynamic Filtering', desc: 'Search by keyword "College" or filter by category "Education" to verify multi-parameter filtering.' },
    { step: 8, title: 'Open Expense Details View', desc: 'View 3 structured sections: Expense Information, Payment Information, and Audit Timestamps.' },
    { step: 9, title: 'Edit & Update Expense', desc: 'Change the amount or notes and save; observe immediate database update and toast notification.' },
    { step: 10, title: 'Delete Expense with Confirmation Modal', desc: 'Click Delete, confirm deletion in the accessible modal dialog, and watch dashboard stats recalculate.' },
    { step: 11, title: 'Open Reports & Analytics Page', desc: 'Examine 12-month spending progression, highest/lowest transactions, and category percentages.' },
    { step: 12, title: 'Budget Planning & Overspending Alert', desc: 'Set monthly cap, observe progress bar color shifts, and verify warning when spent > budget.' },
    { step: 13, title: 'Postman & REST API Verification', desc: 'Demonstrate endpoints with proper status codes (200, 201, 400, 404).' },
  ];

  const postmanCollection = {
    info: {
      name: "Expense Tracker REST API",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      { name: "1. GET All Expenses", request: { method: "GET", url: "{{base_url}}/api/expenses/" } },
      { name: "2. GET Single Expense", request: { method: "GET", url: "{{base_url}}/api/expenses/1/" } },
      { name: "3. POST Create Expense", request: { method: "POST", url: "{{base_url}}/api/expenses/", body: { mode: "raw", raw: JSON.stringify({ title: "Grocery Shopping", amount: 1250.00, category: "Food", payment_method: "UPI", expense_date: "2026-09-17" }, null, 2) } } },
      { name: "4. PUT Update Expense", request: { method: "PUT", url: "{{base_url}}/api/expenses/1/", body: { mode: "raw", raw: JSON.stringify({ title: "Supermarket Groceries Updated", amount: 1500.00, category: "Food", payment_method: "UPI", expense_date: "2026-09-17" }, null, 2) } } },
      { name: "5. DELETE Expense", request: { method: "DELETE", url: "{{base_url}}/api/expenses/1/" } },
      { name: "6. Search Expenses", request: { method: "GET", url: "{{base_url}}/api/expenses/search/?q=food" } },
      { name: "7. Filter Category", request: { method: "GET", url: "{{base_url}}/api/expenses/?category=Food" } },
      { name: "8. Dashboard Stats", request: { method: "GET", url: "{{base_url}}/api/stats/dashboard" } }
    ]
  };

  const downloadPostman = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postmanCollection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Expense_Tracker.postman_collection.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="college-hub-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                College Project Viva & Evaluation Hub
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
                Expense Tracker — Full-Stack Web Development Project
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Comprehensive documentation, ER diagram, live REST API test runner, Postman test suites, and Django REST Framework code.
              </p>
            </div>
          </div>

          <button
            id="btn-download-postman"
            onClick={downloadPostman}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Postman JSON</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/10">
          {[
            { id: 'viva' as const, label: 'Viva Demo Flow', icon: CheckCircle2 },
            { id: 'api-test' as const, label: 'Live REST API Tester', icon: Terminal },
            { id: 'report' as const, label: 'Project Report Docs', icon: BookOpen },
            { id: 'er-diagram' as const, label: 'Database & ER Diagram', icon: Database },
            { id: 'django' as const, label: 'Django Backend Code', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Viva Demo Flow */}
      {activeTab === 'viva' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Viva Practical Demonstration Checklist (Step-by-Step)
              </h3>
              <p className="text-xs text-slate-500">
                Follow this sequential script when presenting to external college evaluators.
              </p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              13 Verified Steps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demonstrationSteps.map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white transition-all flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Viva Answers */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Common Viva Questions & Ready Answers</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-900">Q: Why use SQLite and not browser localStorage?</p>
                <p className="text-slate-600 mt-1">
                  A: SQLite provides true relational database integrity, ACID transactions, data persistence independent of browser cache, foreign keys, unique constraints, and standard SQL queries.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-900">Q: How is data validation enforced in this application?</p>
                <p className="text-slate-600 mt-1">
                  A: Dual-layer validation: First, React performs immediate client-side feedback (non-empty title, amount &gt; 0, valid category, ISO date). Second, the backend API independently validates all payloads, rejecting invalid requests with 400 Bad Request and structured error maps.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-900">Q: How does the architecture maintain separation of concerns?</p>
                <p className="text-slate-600 mt-1">
                  A: Frontend UI components never call raw fetch URLs directly; they communicate through a decoupled `expenseService` layer. Backend routes process queries through parameterized SQL queries, preventing SQL injection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live REST API Tester */}
      {activeTab === 'api-test' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Interactive REST API Console</h3>
              <p className="text-xs text-slate-500">
                Execute live HTTP calls directly against the running SQLite backend.
              </p>
            </div>
            {apiStatus && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  apiStatus >= 200 && apiStatus < 300
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                HTTP {apiStatus}
              </span>
            )}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-400 font-semibold self-center mr-1">Presets:</span>
            <button
              onClick={() => {
                setApiMethod('GET');
                setApiUrl('/api/expenses');
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
            >
              GET /api/expenses
            </button>
            <button
              onClick={() => {
                setApiMethod('GET');
                setApiUrl('/api/stats/dashboard');
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
            >
              GET /api/stats/dashboard
            </button>
            <button
              onClick={() => {
                setApiMethod('GET');
                setApiUrl('/api/expenses/search?q=Food');
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
            >
              GET /api/expenses/search?q=Food
            </button>
            <button
              onClick={() => {
                setApiMethod('POST');
                setApiUrl('/api/expenses');
                setApiBody('{\n  "title": "Semester Examination Fee",\n  "amount": 2500.00,\n  "category": "Education",\n  "payment_method": "UPI",\n  "expense_date": "2026-09-17"\n}');
              }}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium border border-emerald-200"
            >
              POST New Expense
            </button>
            <button
              onClick={() => {
                setApiMethod('POST');
                setApiUrl('/api/expenses');
                setApiBody('{\n  "title": "",\n  "amount": -50,\n  "category": "InvalidCat",\n  "payment_method": "Cash",\n  "expense_date": "2026-09-17"\n}');
              }}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium border border-rose-200"
            >
              Test 400 Validation
            </button>
          </div>

          {/* Request Bar */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <select
              value={apiMethod}
              onChange={(e) => setApiMethod(e.target.value as any)}
              className="bg-slate-100 font-bold text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 font-mono text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              onClick={handleRunApiTest}
              disabled={apiLoading}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{apiLoading ? 'Sending...' : 'Send API Request'}</span>
            </button>
          </div>

          {/* Body editor if POST or PUT */}
          {(apiMethod === 'POST' || apiMethod === 'PUT') && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                JSON Request Payload:
              </label>
              <textarea
                rows={5}
                value={apiBody}
                onChange={(e) => setApiBody(e.target.value)}
                className="w-full font-mono text-xs p-3 bg-slate-900 text-emerald-400 rounded-xl focus:outline-hidden"
              />
            </div>
          )}

          {/* Response Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600">Response Payload (JSON):</span>
              <button
                onClick={() => copyToClipboard(apiResponse, 'api-resp')}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                {copiedKey === 'api-resp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>Copy JSON</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-80 leading-relaxed">
              {apiResponse}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: Project Report Documentation */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">College Academic Project Report</h3>
            <p className="text-xs text-slate-500 mt-0.5">Comprehensive documentation formatted for engineering project viva</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 text-blue-600">1. Introduction & Problem Statement</h4>
            <p>
              Managing day-to-day expenditures is vital for personal financial discipline. Traditional methods such as paper notebooks or generic spreadsheets lack real-time validation, automatic category segregation, visual trend analysis, and budget overrun alerts. The proposed <strong>Expense Tracker</strong> system provides a centralized, full-stack web application designed for students and professionals to log expenses, enforce monthly budgetary limits, and visualize cashflow patterns.
            </p>

            <h4 className="text-sm font-bold text-slate-900 text-blue-600">2. Objectives & Scope</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Implement complete CRUD (Create, Read, Update, Delete) operations with real-time UI synchronization.</li>
              <li>Provide dynamic search and multi-parameter filtering (by Category, Payment Method, Date Range, Amount).</li>
              <li>Enforce dual-layer data validation (Frontend immediate validation and Backend schema validation).</li>
              <li>Calculate dynamic financial summaries (Total Spend, Monthly Average, Highest/Lowest transactions).</li>
              <li>Deliver clean visual reporting including category distribution and monthly progression.</li>
            </ul>

            <h4 className="text-sm font-bold text-slate-900 text-blue-600">3. System Architecture</h4>
            <p>
              The application adheres to the 3-Tier Web Architecture:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs">
              Client Tier (React 19 + Tailwind CSS) &lt;-- REST API (JSON) --&gt; Application Tier (REST Service / Django REST) &lt;-- ORM / Driver --&gt; Data Tier (SQLite Database)
            </div>

            <h4 className="text-sm font-bold text-slate-900 text-blue-600">4. REST API Specifications</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold">
                    <th className="p-2 border border-slate-200">Method</th>
                    <th className="p-2 border border-slate-200">Endpoint</th>
                    <th className="p-2 border border-slate-200">Status</th>
                    <th className="p-2 border border-slate-200">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border font-mono text-blue-600 font-bold">GET</td><td className="p-2 border font-mono">/api/expenses/</td><td className="p-2 border">200 OK</td><td className="p-2 border">Retrieve all expenses with optional query filters</td></tr>
                  <tr><td className="p-2 border font-mono text-emerald-600 font-bold">POST</td><td className="p-2 border font-mono">/api/expenses/</td><td className="p-2 border">201 Created / 400</td><td className="p-2 border">Create a new validated expense</td></tr>
                  <tr><td className="p-2 border font-mono text-blue-600 font-bold">GET</td><td className="p-2 border font-mono">/api/expenses/:id/</td><td className="p-2 border">200 OK / 404</td><td className="p-2 border">Retrieve single expense by ID</td></tr>
                  <tr><td className="p-2 border font-mono text-amber-600 font-bold">PUT</td><td className="p-2 border font-mono">/api/expenses/:id/</td><td className="p-2 border">200 OK / 400</td><td className="p-2 border">Full update of an existing expense record</td></tr>
                  <tr><td className="p-2 border font-mono text-rose-600 font-bold">DELETE</td><td className="p-2 border font-mono">/api/expenses/:id/</td><td className="p-2 border">200 OK / 404</td><td className="p-2 border">Permanently remove expense from database</td></tr>
                  <tr><td className="p-2 border font-mono text-blue-600 font-bold">GET</td><td className="p-2 border font-mono">/api/expenses/search/?q=val</td><td className="p-2 border">200 OK</td><td className="p-2 border">Full-text search across Title, ID, Category, Notes</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-sm font-bold text-slate-900 text-blue-600">5. Conclusion & Future Enhancements</h4>
            <p>
              The Expense Tracker project successfully demonstrates a full-stack web application adhering to professional coding standards, ACID relational storage, responsive UI design, and modular service separation. Future enhancements include receipt image OCR scanning, recurring subscription auto-reminders, and multi-user authentication.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: Database & ER Diagram */}
      {activeTab === 'er-diagram' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Database Design & Entity Relationship</h3>
            <p className="text-xs text-slate-500">Relational SQLite schema design and table structures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table 1: Expense */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-blue-600 text-white p-3.5 flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Entity: Expense</span>
                </span>
                <span className="text-[11px] bg-blue-700 px-2 py-0.5 rounded">Primary Table</span>
              </div>
              <div className="p-4 bg-slate-50 space-y-2 text-xs font-mono">
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-blue-700">id</span>
                  <span className="text-slate-500">INTEGER PK AUTOINCREMENT</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-amber-700">expense_id</span>
                  <span className="text-slate-500">TEXT UNIQUE NOT NULL</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">title</span>
                  <span className="text-slate-500">TEXT NOT NULL</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">amount</span>
                  <span className="text-slate-500">REAL CHECK(amount &gt; 0)</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">category</span>
                  <span className="text-slate-500">TEXT (Enum 10 categories)</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">payment_method</span>
                  <span className="text-slate-500">TEXT (Enum 6 methods)</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">expense_date</span>
                  <span className="text-slate-500">TEXT (YYYY-MM-DD)</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">description</span>
                  <span className="text-slate-500">TEXT DEFAULT ''</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">notes</span>
                  <span className="text-slate-500">TEXT DEFAULT ''</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">created_at</span>
                  <span className="text-slate-500">TEXT (ISO-8601)</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">updated_at</span>
                  <span className="text-slate-500">TEXT (ISO-8601)</span>
                </div>
              </div>
            </div>

            {/* Table 2: Budget */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-indigo-600 text-white p-3.5 flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Entity: Budget</span>
                </span>
                <span className="text-[11px] bg-indigo-700 px-2 py-0.5 rounded">Config Table</span>
              </div>
              <div className="p-4 bg-slate-50 space-y-2 text-xs font-mono">
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-blue-700">id</span>
                  <span className="text-slate-500">INTEGER PK AUTOINCREMENT</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">month</span>
                  <span className="text-slate-500">INTEGER (1-12) NOT NULL</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">year</span>
                  <span className="text-slate-500">INTEGER NOT NULL</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">amount</span>
                  <span className="text-slate-500">REAL CHECK(amount &gt; 0)</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-amber-700">UNIQUE(month, year)</span>
                  <span className="text-slate-500">Composite Unique Index</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">created_at</span>
                  <span className="text-slate-500">TEXT (ISO-8601)</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                  <span className="font-bold text-slate-800">updated_at</span>
                  <span className="text-slate-500">TEXT (ISO-8601)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Django Backend Code Explorer */}
      {activeTab === 'django' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Django REST Framework Setup & Files</h3>
              <p className="text-xs text-slate-500">
                Complete Django project files located in the <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">backend/</code> directory.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Terminal Execution Commands
            </h4>
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl space-y-2">
              <p className="text-slate-400"># 1. Navigate to backend and create virtualenv:</p>
              <p>cd backend && python3 -m venv venv && source venv/bin/activate</p>
              <p className="text-slate-400"># 2. Install dependencies:</p>
              <p>pip install -r requirements.txt</p>
              <p className="text-slate-400"># 3. Run database migrations:</p>
              <p>python manage.py makemigrations</p>
              <p>python manage.py migrate</p>
              <p className="text-slate-400"># 4. Run automated unit test suite (16 tests):</p>
              <p>python manage.py test</p>
              <p className="text-slate-400"># 5. Start development server:</p>
              <p>python manage.py runserver 8000</p>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
              Django File Hierarchy
            </h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 leading-relaxed">
              backend/<br />
              ├── manage.py<br />
              ├── requirements.txt<br />
              ├── project/<br />
              │   ├── settings.py (CORS, REST Framework, SQLite DB configuration)<br />
              │   ├── urls.py (Root API router routing to /api/expenses/)<br />
              │   └── wsgi.py<br />
              └── expenses/<br />
                  ├── models.py (Expense & Budget models with validation)<br />
                  ├── serializers.py (ModelSerializer with custom field validation)<br />
                  ├── views.py (ModelViewSet & custom search/filter actions)<br />
                  ├── urls.py (DefaultRouter endpoints)<br />
                  ├── admin.py (Django Admin registration with filters & search)<br />
                  └── tests.py (16 automated tests covering all CRUD & edge cases)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
