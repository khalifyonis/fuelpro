# FUELPRO — Fuel Station Management System
## Production-Grade Multi-Branch Fuel Retail & POS ERP

**FUELPRO** is a complete, enterprise-grade Fuel Station Management System engineered for single and multi-station fuel retail networks. It unifies Point-of-Sale (POS) dispensing, tank automation, real-time stock ledgers, cashier shifts, fleet accounts, vendor deliveries, and operational finance.

---

## 🌟 Key System Capabilities & Architectural Modules

1. **Role-Tailored Dashboards (6 Variants)**
   - **Administrator Dashboard**: Company-wide revenue, litres, station performance comparison, system uptime, and activity feeds.
   - **Station Manager Dashboard**: Daily sales, average price per litre, pump online ratio (6/8 - 75%), fuel stock level progress bars.
   - **Cashier / POS Dashboard**: Shift transactions, cash float, hourly dispense trends, quick fuel POS shortcuts, recent receipts.
   - **Inventory Officer Dashboard**: Total stock, % tank capacity, low stock threshold warnings, tanker delivery logs.
   - **Accountant Dashboard**: Gross sales revenue, operating expenses, net profit margin, tender breakdown (Cash 68%, Card 24%, Mobile Money 8%).
   - **Pump Attendant Dashboard**: Assigned dispensers, live fueling rates (L/min), nozzle meter difference tracking.

2. **Fuel Sales & Touch-Friendly POS Terminal (`/pos`)**
   - Dispenser pump and nozzle selection.
   - Real-time price per litre calculations.
   - Fast cash presets ($10, $20, $50, $100, Full Tank).
   - Multi-tender payment (Cash, Card, Mobile Money, Corporate Fleet Credit).
   - Printable thermal receipt generator with barcodes and shift metadata.

3. **Tanks & Dip Gauges (`/tanks`)**
   - High-precision decimal volume calculations.
   - Visual tank tube dip indicators with fill percentage.
   - Dip stick measurement logging and variance detection.

4. **Shifts & Cash Drawer Reconciliation (`/shifts`)**
   - Shift opening with initial cash float.
   - Real-time sales accumulation by payment method.
   - Blind closing cash count with automated Over/Short calculation.
   - Shift locking and supervisor approval workflows.

5. **Deliveries & Receiving (`/deliveries`)**
   - Bulk fuel tanker receiving from refineries.
   - Driver credentials, truck number, and seal verification.
   - Pre-dip and post-dip tank variance detection.
   - Manager approval workflow with automated inventory ledger posting.

6. **Corporate Fleet Accounts (`/customers`)**
   - Company credit limits and net payment terms (Net 7, 15, 30).
   - Registered fleet vehicle license plates and fuel grade restrictions.
   - Credit sale validation against available balances.

7. **Expenses & Petty Cash (`/expenses`)**
   - Category allocation (Utilities, Wages, Maintenance, Cleaning).
   - Voucher submission, approval, and P&L ledger posting.

8. **Audit Trail & System Security (`/audit-logs`)**
   - Immutable audit logs for price changes, voids, shift reopens, and user authentications.
   - Role-Based Access Control (RBAC) enforced on the backend.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Recharts, Radix UI.
- **Backend**: NestJS, Node.js, TypeScript, Passport JWT, bcrypt, Helmet.
- **Database**: PostgreSQL with Prisma ORM (all quantities and currencies modeled using `Decimal(15, 4)`).
- **Design System**: Deep Navy (`#0f1729`), Fuel Orange (`#f59e0b`), Brand Blue (`#2563eb`), Emerald Green (`#10b981`).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- pnpm or npm
- PostgreSQL (or Docker)

### 2. Database Setup (Docker)
Start PostgreSQL using the provided `docker-compose.yml`:
```bash
docker-compose up -d
```

### 3. Backend Setup
```bash
cd backend
pnpm install
npx prisma generate
npx prisma db push
npx prisma db seed
pnpm run start:dev
```
Backend API will be running at `http://localhost:3001/api`.

### 4. Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```
Frontend Web Application will be available at `http://localhost:3000`.

---

## 🔐 Default Demo Accounts (`FuelPro@2026`)

| Role | Username / Email | Password | Scope |
|---|---|---|---|
| **Super Admin** | `admin@fuelpro.com` | `FuelPro@2026` | Company-wide |
| **Station Manager** | `manager@fuelpro.com` | `FuelPro@2026` | Central Station |
| **Cashier** | `cashier@fuelpro.com` | `FuelPro@2026` | Shift Register #01 |
| **Inventory Officer** | `inventory@fuelpro.com` | `FuelPro@2026` | Tank Storage |
| **Accountant** | `accountant@fuelpro.com` | `FuelPro@2026` | Finance & P&L |
| **Pump Attendant** | `attendant@fuelpro.com` | `FuelPro@2026` | Forecourt Pumps |

*All roles can be logged in with a single click on the login screen using the Quick Demo picker.*

---

## 📋 Acceptance Criteria Verification

- [x] **Authentication**: Secure JWT token exchange, password hashing, and role-based redirects.
- [x] **Design Fidelity**: Exact reproduction of `FuelPro Dashboard Collection.png` and `FUELPRO Smarter Fuel Management Login.png`.
- [x] **POS Dispensing**: Live litre and price calculations with printable thermal receipts.
- [x] **Delivery Approvals**: Receiving entries increment tank volume and write to the stock ledger.
- [x] **Cash Drawer Reconciliation**: Calculates exact cash over/short variance upon shift closure.
- [x] **Multi-Branch Isolation**: Branch-level data filtering across Central, North, East, and West stations.
