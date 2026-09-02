# AnumatiSetu — Business Compliance & Statutory Approval Platform

> **Project Name:** AnumatiSetu (अनुमति सेतु)  
> **Purpose:** Centralized Gateway for Business Approvals, Statutory Clearances & License Renewal Lifecycle

---

## 1. Project Overview & Purpose

**AnumatiSetu** is a centralized compliance and statutory approval management platform designed for entrepreneurs, businesses, and industrial units.

### The Problem It Solves
When establishing or operating an enterprise, businesses must navigate a fragmented web of regulatory bodies (e.g., State Pollution Control Boards, Directorate of Industrial Safety & Health, Fire & Emergency Services, Labour Departments, Municipal Corporations, Legal Metrology, Boilers Inspectorates). Entrepreneurs face:
* Lack of clarity on which specific approvals, licenses, and NOCs are mandatory for their sector and location.
* Disjointed tracking of applications across multiple departmental portals.
* Missed inspection schedules and document clarifications.
* Lapsed licenses and financial penalties due to poor renewal visibility.

### The Core Conceptual Flow
AnumatiSetu organizes industrial governance into a unified, deterministic pipeline:

```text
1. Business Profile
   (Specify Industry Sector, Location, Stage, Investment Scale, Employees)
        ↓
2. Applicable Approvals & Requirements
   (Automated rule engine identifies required licenses, clearances & NOCs)
        ↓
3. Application Submission & Document Management
   (Draft, upload required documents, submit to regulatory workflow)
        ↓
4. Authority Review & Clarification / Inspection Handling
   (Track status: DRAFT → SUBMITTED → UNDER REVIEW → CLARIFICATION / INSPECTION → APPROVED / REJECTED)
        ↓
5. License Issuance & Renewal Lifecycle Tracking
   (Active license registry with automated expiry alerts and renewal triggers)
```

---

## 2. Technology Stack & Architecture

AnumatiSetu is built with clean, modern, zero-dependency web technologies:

* **Frontend Structure:** HTML5 (Semantic, accessible), CSS3 (Modern custom design system with CSS custom properties), Vanilla JavaScript (ES6+).
* **State & Data Layer (`script.js`):**
  * `AlgoStore`: Pure client-side state manager utilizing browser `localStorage`.
  * **Zero Fabricated Data on Start:** The application starts in an authentic, clean empty state (`[]` applications, `[]` documents, `[]` renewals).
  * `RequirementRuleEngine`: Deterministic regulatory mapping that evaluates business profile parameters (e.g. Manufacturing in Karnataka with >20 employees triggers Factories Act Form 2, SPCB CTO, Fire Safety NOC, and EPFO/ESIC).
* **API Bridge Layer (`ApiService`):**
  * Asynchronous abstraction returning Promises for all data operations (`getProfile()`, `saveProfile()`, `getRequirements()`, `getApplications()`, `createApplication()`, `updateApplicationStatus()`, `getDocuments()`, `uploadDocument()`, `getRenewals()`, `renewLicense()`).
  * Ready to be connected to a Node.js/Express REST API backend by swapping local store methods with `fetch('/api/...')`.

---

## 3. Folder & File Structure

```text
AnumatiSetu/
├── README.md               # Repository overview & quick start
├── PROJECT_GUIDE.md        # Comprehensive technical guide (this document)
├── .gitignore              # Git ignore rules for node_modules, temp files
├── package.json            # Node.js development scripts & local server runner
│
└── frontend/               # Complete frontend application
    ├── index.html          # Public Landing Page (Overview, Core flow)
    ├── dashboard.html      # Central Dashboard (KPI metrics, active applications, upcoming renewals)
    ├── profile.html        # Business Profile setup & dynamic requirement generator
    ├── approvals.html      # Applicable Approvals & Compliance catalog
    ├── applications.html   # Application lifecycle tracker & workflow manager
    ├── documents.html      # Document repository & upload manager
    ├── renewals.html       # Active licenses & statutory renewal tracker
    ├── style.css           # Professional enterprise design system & responsive layout
    ├── script.js           # Core state store, rule engine, API service, and page controllers
    └── assets/
        └── logo.svg        # Official AnumatiSetu brand asset
```

---

## 4. What Each Important File Does

| File | Purpose |
| :--- | :--- |
| `frontend/index.html` | Public landing page explaining the compliance challenge, platform architecture, and entry points into onboarding. |
| `frontend/profile.html` | Form allowing an entrepreneur to specify entity name, industry type, stage, state, investment scale, and employee count. Triggers dynamic requirement generation. |
| `frontend/dashboard.html` | Central control panel showing real-time KPIs (Total Required Approvals, Active Applications, Pending Actions, Upcoming Renewals) with graceful empty states. |
| `frontend/approvals.html` | Catalog of statutory approvals identified for the profile. Allows filtering by department and launching new applications. |
| `frontend/applications.html` | End-to-end application tracker supporting standard workflow statuses: `DRAFT`, `SUBMITTED`, `UNDER REVIEW`, `CLARIFICATION REQUIRED`, `INSPECTION REQUIRED`, `APPROVED`, `REJECTED`. |
| `frontend/documents.html` | Central repository for uploading and verifying required statutory documents (Blueprints, Test Reports, PAN/GST, Form copies). |
| `frontend/renewals.html` | Active license ledger displaying issue dates, validity periods, countdown timers, and renewal actions. |
| `frontend/style.css` | Enterprise stylesheet using a restrained slate/teal color palette, clean cards, standard desktop navigation, accessible forms, and responsive tables. |
| `frontend/script.js` | Single source of truth for business logic, localStorage synchronization, API abstraction, modal dialogs, and toast alerts. |

---

## 5. Application Workflow Statuses

Applications follow a clear, realistic regulatory lifecycle:

```text
[ DRAFT ] ──► [ SUBMITTED ] ──► [ UNDER REVIEW ]
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     [ CLARIFICATION REQUIRED ]                      [ INSPECTION REQUIRED ]
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼
                         [ APPROVED ]  or  [ REJECTED ]
                              │
                              ▼
                      [ RENEWAL TRACKING ]
```

---

## 6. How to Run Locally

### Option A: Using VS Code (Recommended)
1. Open the project folder in **Visual Studio Code**:
   ```powershell
   code "C:\Users\manas\.gemini\antigravity\scratch"
   ```
2. Open a terminal inside VS Code (`Ctrl + ~`) and run:
   ```powershell
   npm start
   ```

### Option B: Using Python (Built-in)
```powershell
cd frontend
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

### Option C: Using Node.js / npx
```powershell
npx serve frontend
```

---

## 7. Connecting to a Node.js / Express Backend (Future Phase)

When integrating with a Node.js backend:
1. Create a `backend/` directory with Express and PostgreSQL / MongoDB.
2. Replace the methods inside `ApiService` in `frontend/script.js` with standard `fetch()` calls:
   ```javascript
   // Example in frontend/script.js:
   async getApplications() {
     const res = await fetch('/api/applications');
     return await res.json();
   }
   ```
3. No changes to the HTML structure or CSS styling will be necessary.
