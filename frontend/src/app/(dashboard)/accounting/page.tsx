'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Calculator,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MoreVertical,
  X,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  BookOpen,
  Scale,
  Receipt,
  PieChart,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface JournalVoucher {
  id: string;
  reference: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  postedBy: string;
  status: 'POSTED' | 'DRAFT';
}

const INITIAL_JOURNALS: JournalVoucher[] = [
  {
    id: 'je-1',
    reference: 'JV-2026-081',
    date: 'Today, 15:00 PM',
    description: 'Forecourt retail pump sales cash drop reconciliation',
    debitAccount: '1010 - Forecourt Cash Strongbox',
    creditAccount: '4010 - Fuel Retail Sales Revenue',
    amount: 4250.8,
    postedBy: 'Robert Sterling (Accountant)',
    status: 'POSTED',
  },
  {
    id: 'je-2',
    reference: 'JV-2026-080',
    date: 'Today, 11:30 AM',
    description: 'Bulk road tanker fuel delivery intake payment',
    debitAccount: '1210 - Underground Wet Stock Inventory',
    creditAccount: '2010 - Hass Petroleum Trade Payables',
    amount: 18500.0,
    postedBy: 'Robert Sterling (Accountant)',
    status: 'POSTED',
  },
  {
    id: 'je-3',
    reference: 'JV-2026-079',
    date: 'Yesterday, 16:00 PM',
    description: 'Station backup diesel generator operating fuel voucher',
    debitAccount: '6120 - Station Power & Generator Expense',
    creditAccount: '1020 - Petty Cash Drawer',
    amount: 156.0,
    postedBy: 'Robert Sterling (Accountant)',
    status: 'POSTED',
  },
  {
    id: 'je-4',
    reference: 'JV-2026-078',
    date: 'Yesterday, 14:15 PM',
    description: 'Corporate fleet account credit replenishment (Metro Rapid)',
    debitAccount: '1030 - Premier Bank Operating Account',
    creditAccount: '1110 - Trade Accounts Receivable (Fleet)',
    amount: 5000.0,
    postedBy: 'Robert Sterling (Accountant)',
    status: 'POSTED',
  },
  {
    id: 'je-5',
    reference: 'JV-2026-077',
    date: 'Nov 15, 2026',
    description: 'Dispenser calibration maintenance vendor payment',
    debitAccount: '6150 - Forecourt Maintenance & Calibration',
    creditAccount: '1030 - Premier Bank Operating Account',
    amount: 750.0,
    postedBy: 'Robert Sterling (Accountant)',
    status: 'POSTED',
  },
];

const PNL_ITEMS = [
  { item: 'Gross Fuel Sales Revenue (Petrol, Diesel, Kerosene)', amount: 248750.0, type: 'REV' },
  { item: 'Cost of Goods Sold (Refinery Wholesale Wet Stock)', amount: -182100.0, type: 'COGS' },
  { item: 'Forecourt Gross Operating Margin', amount: 66650.0, type: 'GROSS' },
  { item: 'Generator Fuel & Utility Power OPEX', amount: -4200.0, type: 'OPEX' },
  { item: 'Forecourt Staff & Attendant Wages', amount: -6800.0, type: 'OPEX' },
  { item: 'Dispenser Maintenance & Weights Seals', amount: -1200.0, type: 'OPEX' },
  { item: 'Station Security & Cleaning Supplies', amount: -800.0, type: 'OPEX' },
  { item: 'Net Station Operating EBITDA', amount: 53650.0, type: 'NET' },
];

const CHART_OF_ACCOUNTS = [
  { code: '1010', name: 'Forecourt Cash Strongbox', type: 'Asset', balance: 14250.0 },
  { code: '1020', name: 'Petty Cash Drawer', type: 'Asset', balance: 1250.0 },
  { code: '1030', name: 'Premier Bank Operating Account', type: 'Asset', balance: 88420.0 },
  { code: '1110', name: 'Trade Accounts Receivable (Fleet)', type: 'Asset', balance: 28950.0 },
  { code: '1210', name: 'Underground Wet Stock Inventory', type: 'Asset', balance: 112400.0 },
  { code: '2010', name: 'Fuel Supplier Trade Payables', type: 'Liability', balance: 42000.0 },
  { code: '4010', name: 'Fuel Retail Sales Revenue', type: 'Revenue', balance: 248750.0 },
  { code: '5010', name: 'Cost of Goods Sold (Wet Stock)', type: 'Expense', balance: 182100.0 },
  { code: '6120', name: 'Station Power & Generator Expense', type: 'Expense', balance: 4200.0 },
];

export default function AccountingPage() {
  const [journals, setJournals] = useState<JournalVoucher[]>(INITIAL_JOURNALS);
  const [activeTab, setActiveTab] = useState<'GL' | 'PNL' | 'COA'>('GL');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // Journal form state
  const [newDesc, setNewDesc] = useState('');
  const [newDebitAcc, setNewDebitAcc] = useState('1010 - Forecourt Cash Strongbox');
  const [newCreditAcc, setNewCreditAcc] = useState('4010 - Fuel Retail Sales Revenue');
  const [newAmount, setNewAmount] = useState('');

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount) || 0;
    const created: JournalVoucher = {
      id: `je-${Date.now()}`,
      reference: `JV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: 'Just now',
      description: newDesc || 'Manual general ledger journal entry',
      debitAccount: newDebitAcc,
      creditAccount: newCreditAcc,
      amount: amt,
      postedBy: 'Active Accountant',
      status: 'POSTED',
    };
    setJournals([created, ...journals]);
    setIsJournalModalOpen(false);
    setNewDesc('');
    setNewAmount('');
  };

  // TanStack table columns for GL
  const journalColumns: ColumnDef<JournalVoucher>[] = [
    {
      accessorKey: 'reference',
      header: 'Voucher #',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Posting Date',
      cell: ({ row }) => <span className="font-semibold text-gray-800">{row.original.date}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Transaction Memo / Narrative',
      cell: ({ row }) => <span className="font-medium text-gray-800">{row.original.description}</span>,
    },
    {
      accessorKey: 'debitAccount',
      header: 'Debit Leg (Dr)',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
          {row.original.debitAccount}
        </span>
      ),
    },
    {
      accessorKey: 'creditAccount',
      header: 'Credit Leg (Cr)',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.creditAccount}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Balanced Amount',
      cell: ({ row }) => (
        <span className="font-extrabold text-sm text-gray-900 font-mono">
          ${row.original.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Audit State',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          BALANCED
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Architecture)          */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0">
            <Calculator className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                General Accounting & Financial Ledger
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Double-entry bookkeeping, balanced journal vouchers, Profit & Loss statement, and Chart of Accounts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Voucher Ref,Date,Description,Debit Account,Credit Account,Amount ($),Posted By,Status'];
              const rows = journals.map(
                (j) => `"${j.reference}","${j.date}","${j.description}","${j.debitAccount}","${j.creditAccount}",${j.amount},"${j.postedBy}","${j.status}"`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_General_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/accounting/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Post Journal Voucher</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT FINANCIAL KPI CARDS (With Sparkline Waves)             */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Sales Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Gross Sales Revenue
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">$248,750</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  +14.2% YoY
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Fuel & Oasis Mart retail
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

        {/* Card 2: Cost of Goods Sold (COGS) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Wholesale COGS
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">$182,100</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                  Wholesale
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Bulk road tanker procurement
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

        {/* Card 3: Gross Trading Margin */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Gross Trading Margin
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-emerald-600 font-mono">$66,650</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  26.8%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Net operational profit margin
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

        {/* Card 4: Operating EBITDA */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Net Operating EBITDA
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-purple-700 font-mono">$53,650</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md">
                  21.5%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                GAAP zero-sum balanced
              </span>
            </div>
          </div>
          {/* Purple Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-purple-500" viewBox="0 0 70 30" fill="none">
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

      {/* Accounting Statement Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('GL')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'GL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>General Ledger Journal</span>
        </button>

        <button
          onClick={() => setActiveTab('PNL')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'PNL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Profit & Loss Statement (P&L)</span>
        </button>

        <button
          onClick={() => setActiveTab('COA')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'COA'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Chart of Accounts</span>
        </button>
      </div>

      {/* Tab 1: General Ledger TanStack Table */}
      {activeTab === 'GL' && (
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">General Ledger Journal Entries</h2>
            <p className="text-xs text-gray-500 font-medium">
              Double-entry postings audit trail with balanced debit/credit legs.
            </p>
          </div>

          <DataTable
            columns={journalColumns}
            data={journals}
            searchPlaceholder="Search journal voucher #, narrative, or account..."
            pageSize={10}
            emptyMessage="No journal entries posted."
          />
        </div>
      )}

      {/* Tab 2: Profit & Loss Statement (P&L) */}
      {activeTab === 'PNL' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">Profit & Loss Statement (P&L)</h2>
              <p className="text-xs text-gray-500 font-medium">
                Current month operating performance for all forecourt retail sales.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-gray-500">Currency: USD ($)</span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {PNL_ITEMS.map((line, idx) => {
              const isGross = line.type === 'GROSS';
              const isNet = line.type === 'NET';
              return (
                <div
                  key={idx}
                  className={`py-3 flex justify-between items-center ${
                    isNet
                      ? 'bg-blue-50/70 px-4 rounded-xl font-black text-blue-950 text-sm mt-2'
                      : isGross
                      ? 'bg-gray-50 px-4 rounded-xl font-bold text-gray-900'
                      : 'text-gray-700 px-2'
                  }`}
                >
                  <span className={isNet || isGross ? 'font-bold' : 'font-medium'}>{line.item}</span>
                  <span
                    className={`font-mono ${
                      line.amount < 0
                        ? 'text-red-600 font-bold'
                        : isNet
                        ? 'text-blue-700 font-black text-base'
                        : 'text-gray-900 font-bold'
                    }`}
                  >
                    {line.amount < 0
                      ? `-$${Math.abs(line.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : `$${line.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Chart of Accounts */}
      {activeTab === 'COA' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Forecourt Chart of Accounts</h2>
            <p className="text-xs text-gray-500 font-medium">Standardized fuel station general ledger account codes.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Account Code</th>
                  <th className="py-2.5 px-3">Account Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {CHART_OF_ACCOUNTS.map((acc) => (
                  <tr key={acc.code} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">{acc.code}</td>
                    <td className="py-3 px-3 font-semibold text-gray-800">{acc.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-gray-100 text-gray-700">
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-gray-900">
                      ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Post Journal Voucher */}
      {isJournalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Post General Ledger Journal Voucher</h3>
              </div>
              <button
                onClick={() => setIsJournalModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJournal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Journal Narrative / Memo</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of day cash drop to strongbox"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Debit Account (Dr)</label>
                <select
                  value={newDebitAcc}
                  onChange={(e) => setNewDebitAcc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                >
                  {CHART_OF_ACCOUNTS.map((a) => (
                    <option key={a.code} value={`${a.code} - ${a.name}`}>
                      {a.code} - {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Credit Account (Cr)</label>
                <select
                  value={newCreditAcc}
                  onChange={(e) => setNewCreditAcc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                >
                  {CHART_OF_ACCOUNTS.map((a) => (
                    <option key={a.code} value={`${a.code} - ${a.name}`}>
                      {a.code} - {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Balanced Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-base"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Debit leg and credit leg will be balanced equally.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsJournalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Post Journal Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
