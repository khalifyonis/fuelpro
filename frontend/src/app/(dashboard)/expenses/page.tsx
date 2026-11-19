'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MoreVertical,
  X,
  DollarSign,
  Receipt,
  FileText,
  Clock,
  ShieldCheck,
  Zap,
  Check,
  Ban,
  Download,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface ExpenseVoucher {
  id: string;
  voucherNumber: string;
  category: 'MAINTENANCE' | 'GENERATOR_FUEL' | 'UTILITIES' | 'STAFF_MEALS' | 'SUPPLIES';
  description: string;
  amount: number;
  date: string;
  vendor: string;
  submittedBy: string;
  approvedBy: string;
  paymentMethod: 'PETTY_CASH' | 'BANK_TRANSFER' | 'EVC_PLUS';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

const INITIAL_EXPENSES: ExpenseVoucher[] = [
  {
    id: 'exp-1',
    voucherNumber: 'EXP-9921',
    category: 'GENERATOR_FUEL',
    description: 'Diesel fuel intake for backup generator (120L)',
    amount: 156.0,
    date: 'Today, 11:30 AM',
    vendor: 'Station UST Internal Transfer',
    submittedBy: 'Marcus Vance',
    approvedBy: 'David Miller (Manager)',
    paymentMethod: 'PETTY_CASH',
    status: 'APPROVED',
  },
  {
    id: 'exp-2',
    voucherNumber: 'EXP-9920',
    category: 'MAINTENANCE',
    description: 'Replacement nozzle swivel & breakaway valve Pump 02',
    amount: 420.0,
    date: 'Yesterday, 15:45 PM',
    vendor: 'Somali Fuel Equipment Spares Ltd',
    submittedBy: 'David Miller',
    approvedBy: 'David Miller (Manager)',
    paymentMethod: 'BANK_TRANSFER',
    status: 'APPROVED',
  },
  {
    id: 'exp-3',
    voucherNumber: 'EXP-9919',
    category: 'UTILITIES',
    description: 'Monthly commercial electricity & high-voltage canopy lighting',
    amount: 1250.0,
    date: 'Nov 15, 2026',
    vendor: 'Mogadishu Power Corporation (BECO)',
    submittedBy: 'Robert Sterling',
    approvedBy: 'Pending Manager Approval',
    paymentMethod: 'BANK_TRANSFER',
    status: 'PENDING',
  },
  {
    id: 'exp-4',
    voucherNumber: 'EXP-9918',
    category: 'STAFF_MEALS',
    description: 'Shift catering & night attendant refreshment allowance',
    amount: 85.0,
    date: 'Nov 14, 2026',
    vendor: 'Forecourt Diner',
    submittedBy: 'Sarah Jenkins',
    approvedBy: 'David Miller (Manager)',
    paymentMethod: 'EVC_PLUS',
    status: 'APPROVED',
  },
  {
    id: 'exp-5',
    voucherNumber: 'EXP-9917',
    category: 'SUPPLIES',
    description: 'Thermal receipt rolls (80mm x 50 boxes) & printer ribbons',
    amount: 220.0,
    date: 'Nov 12, 2026',
    vendor: 'Al-Haramain Office Supplies',
    submittedBy: 'Robert Sterling',
    approvedBy: 'David Miller (Manager)',
    paymentMethod: 'PETTY_CASH',
    status: 'APPROVED',
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseVoucher[]>(INITIAL_EXPENSES);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form states
  const [newCategory, setNewCategory] = useState<ExpenseVoucher['category']>('MAINTENANCE');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [newPayMethod, setNewPayMethod] = useState<ExpenseVoucher['paymentMethod']>('PETTY_CASH');

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount) || 0;
    const created: ExpenseVoucher = {
      id: `exp-${Date.now()}`,
      voucherNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      description: newDesc,
      amount: amt,
      date: 'Just now',
      vendor: newVendor || 'General Vendor',
      submittedBy: 'Active Staff Member',
      approvedBy: 'Pending Manager Approval',
      paymentMethod: newPayMethod,
      status: 'PENDING',
    };
    setExpenses([created, ...expenses]);
    setIsSubmitModalOpen(false);
    setNewDesc('');
    setNewAmount('');
    setNewVendor('');
  };

  const handleApprove = (id: string) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? { ...e, status: 'APPROVED', approvedBy: 'Station Manager (Signed)' } : e
      )
    );
  };

  const handleReject = (id: string) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? { ...e, status: 'REJECTED', approvedBy: 'Rejected by Manager' } : e
      )
    );
  };

  // TanStack table columns
  const columns: ColumnDef<ExpenseVoucher>[] = [
    {
      accessorKey: 'voucherNumber',
      header: 'Voucher #',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.voucherNumber}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Voucher Date',
      cell: ({ row }) => <span className="font-semibold text-gray-800">{row.original.date}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Expense Category',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
          {row.original.category.replace('_', ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description & Vendor',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.original.description}</span>
          <span className="text-[11px] text-gray-400">Vendor: {row.original.vendor}</span>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Disbursed Amount',
      cell: ({ row }) => (
        <span className="font-extrabold text-sm text-gray-900 font-mono">
          ${row.original.amount.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Settlement Account',
      cell: ({ row }) => (
        <span className="text-gray-600 text-xs font-semibold">
          {row.original.paymentMethod.replace('_', ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Approval State',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              s === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-800'
                : s === 'PENDING'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {s}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Manager Action',
      cell: ({ row }) => {
        if (row.original.status === 'PENDING') {
          return (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleApprove(row.original.id)}
                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
                title="Approve Voucher"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleReject(row.original.id)}
                className="p-1 rounded-md text-red-600 hover:bg-red-50 border border-red-200"
                title="Reject Voucher"
              >
                <Ban className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        }
        return <span className="text-gray-400 text-[11px] font-medium">{row.original.approvedBy}</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Architecture)          */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <Wallet className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Operating Expenses (OPEX) & Petty Cash
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Voucher submission, manager approval workflow, monthly budget burn, and petty cash reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Voucher #,Category,Description,Amount ($),Date,Vendor,Submitted By,Approved By,Payment Method,Status'];
              const rows = expenses.map(
                (e) => `"${e.voucherNumber}","${e.category}","${e.description}",${e.amount},"${e.date}","${e.vendor}","${e.submittedBy}","${e.approvedBy}","${e.paymentMethod}","${e.status}"`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Expenses_Audit_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/expenses/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Submit Expense Voucher</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT EXPENSE KPI CARDS (With Sparkline Waves)               */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly OPEX Budget */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Monthly OPEX Budget
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">$10,000</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-md">
                  21.3% Spent
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                $2,131 spent of $10,000 cap
              </span>
            </div>
          </div>
          {/* Blue Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-blue-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 24C12 24 16 12 26 12C36 12 40 20 50 14C56 9 62 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Pending Approval Pipeline */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Pending Manager Approval
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-amber-700 font-mono">$1,250.00</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                  1 Voucher
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Awaiting controller sign-off
              </span>
            </div>
          </div>
          {/* Amber Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-amber-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 20C10 20 18 6 28 6C38 6 44 24 54 18C60 14 64 6 68 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Settled & Paid Vouchers */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Approved & Paid
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-emerald-700 font-mono">$881.00</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  4 Paid
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Reconciled with petty cash
              </span>
            </div>
          </div>
          {/* Emerald Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 18C12 18 16 26 26 22C36 18 42 8 52 8C58 8 62 14 68 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Petty Cash Strongbox */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Petty Cash Strongbox
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">$624.00</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md">
                  Vault OK
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Weekly manager replenishment
              </span>
            </div>
          </div>
          {/* Rose Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-rose-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 10C14 10 20 22 30 20C40 18 46 6 56 6C62 6 64 12 68 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Operating Expense Vouchers Ledger</h2>
          <p className="text-xs text-gray-500 font-medium">
            Complete voucher records with payment settlement accounts and manager sign-offs.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={expenses}
          searchPlaceholder="Search voucher #, description, or vendor..."
          pageSize={10}
          emptyMessage="No expense vouchers recorded."
        />
      </div>

      {/* Modal: Submit Expense */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-gray-900 text-sm">Submit Operating Expense Voucher</h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Expense Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="GENERATOR_FUEL">Generator Fuel</option>
                    <option value="UTILITIES">Utilities & Power</option>
                    <option value="STAFF_MEALS">Staff Meals</option>
                    <option value="SUPPLIES">Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={newPayMethod}
                    onChange={(e) => setNewPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="PETTY_CASH">Petty Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="EVC_PLUS">EVC Plus Mobile</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pump 02 nozzle seal replacement"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    required
                    placeholder="Vendor name"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
