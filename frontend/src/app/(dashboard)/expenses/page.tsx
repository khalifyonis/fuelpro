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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100/70 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Station Operating Expenses (OPEX) & Petty Cash
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Voucher submission, manager approval workflow, monthly budget burn, and petty cash reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/expenses/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Expense Voucher</span>
          </Link>
        </div>
      </div>

      {/* Monthly Budget Burn & Pipeline Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-semibold text-gray-400 uppercase">Monthly OPEX Budget</div>
          <div className="text-xl font-black text-gray-900 mt-1">$10,000.00</div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '21.3%' }} />
          </div>
          <div className="text-[10px] text-gray-500 mt-1">21.3% consumed ($2,131 spent)</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-semibold text-amber-700 uppercase">Pending Approval</div>
          <div className="text-xl font-black text-amber-800 mt-1">$1,250.00</div>
          <div className="text-[10px] text-amber-600 font-bold mt-1">1 voucher awaiting manager</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase">Approved & Paid</div>
          <div className="text-xl font-black text-emerald-800 mt-1">$881.00</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">4 vouchers settled</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-semibold text-gray-400 uppercase">Petty Cash Strongbox</div>
          <div className="text-xl font-black text-gray-900 mt-1">$624.00</div>
          <div className="text-[10px] text-gray-500 mt-1">Reimbursed weekly</div>
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
