'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calculator,
  Save,
  CheckCircle2,
  AlertTriangle,
  Scale,
  DollarSign,
  FileText,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  Receipt,
  Sparkles,
  ArrowRightLeft,
  Paperclip,
} from 'lucide-react';

const CHART_OF_ACCOUNTS = [
  { code: '1010', name: 'Forecourt Cash Strongbox & Vault', type: 'ASSET' },
  { code: '1020', name: 'Petty Cash Drawer - Station Manager', type: 'ASSET' },
  { code: '1030', name: 'Premier Commercial Bank Operating A/C', type: 'ASSET' },
  { code: '1110', name: 'Trade Accounts Receivable (Fleet Customers)', type: 'ASSET' },
  { code: '1210', name: 'Underground Wet Stock Inventory (PMS/AGO/V-Power)', type: 'ASSET' },
  { code: '2010', name: 'Trade Payables - Refinery & Fuel Distributors', type: 'LIABILITY' },
  { code: '2020', name: 'Forecourt Attendants Accrued Shift Wages', type: 'LIABILITY' },
  { code: '2030', name: 'Petroleum Regulatory Tax & VAT Escrow', type: 'LIABILITY' },
  { code: '3010', name: 'Station Partner Paid-In Equity Capital', type: 'EQUITY' },
  { code: '4010', name: 'Forecourt Retail Fuel Sales Revenue', type: 'REVENUE' },
  { code: '4020', name: 'Convenience Mart & Quick-Lube Retail Sales', type: 'REVENUE' },
  { code: '5010', name: 'Cost of Goods Sold (COGS) - Wet Fuel Bulk Purchases', type: 'EXPENSE' },
  { code: '6010', name: 'Forecourt Electricity & Backup Diesel Generator Opex', type: 'EXPENSE' },
  { code: '6020', name: 'Dispenser Calibration & Tank Inspection Maintenance', type: 'EXPENSE' },
  { code: '6030', name: 'Merchant POS Card & Mobile Money Processing Fees', type: 'EXPENSE' },
];

export default function NewJournalVoucherPage() {
  const router = useRouter();

  // Form State
  const [voucherNumber, setVoucherNumber] = useState(`JV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [postingDate, setPostingDate] = useState(new Date().toISOString().split('T')[0]);
  const [fiscalPeriod, setFiscalPeriod] = useState('FY-2026-Q4');
  const [voucherType, setVoucherType] = useState<'STANDARD' | 'ADJUSTING' | 'INTER_ACCOUNT' | 'INVENTORY_REVAL'>('STANDARD');
  
  // Debit & Credit Legs
  const [debitAccount, setDebitAccount] = useState('1010');
  const [debitAmount, setDebitAmount] = useState('4250.00');
  const [creditAccount, setCreditAccount] = useState('4010');
  const [creditAmount, setCreditAmount] = useState('4250.00');

  // Audit and Reference
  const [costCenter, setCostCenter] = useState('MAIN-FORECOURT');
  const [sourceRef, setSourceRef] = useState('SHIFT-EVENING-PUMP1-4');
  const [memo, setMemo] = useState('Forecourt evening shift cash drop reconciliation to commercial vault');
  const [approvedBy, setApprovedBy] = useState('Robert Sterling (Chief Controller)');
  const [attachmentName, setAttachmentName] = useState('shift_z_report_pos_audit.pdf');

  // Math validations
  const numDebit = parseFloat(debitAmount) || 0;
  const numCredit = parseFloat(creditAmount) || 0;
  const variance = Math.abs(numDebit - numCredit);
  const isBalanced = variance < 0.001 && numDebit > 0;

  const debitObj = CHART_OF_ACCOUNTS.find((a) => a.code === debitAccount);
  const creditObj = CHART_OF_ACCOUNTS.find((a) => a.code === creditAccount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      alert('Error: Journal voucher is out of balance. Debit must equal Credit.');
      return;
    }
    // Simulate commit to backend
    router.push('/accounting');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/accounting" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              General Ledger & Accounting
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Post Double-Entry Journal Voucher</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-blue-600" />
            General Ledger Double-Entry Requisition
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Post balanced dual-entry accounting journals for forecourt sales, wet stock inventory adjustments, and vendor settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/accounting"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!isBalanced}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
              isBalanced
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed opacity-70'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Post Journal Entry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Header & Fiscal Identification */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Voucher Header & Fiscal Period</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Official posting sequence and accounting year alignment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Journal Voucher #</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={voucherNumber}
                    onChange={(e) => setVoucherNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Effective Posting Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={postingDate}
                    onChange={(e) => setPostingDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Fiscal Quarter / Year</label>
                <select
                  value={fiscalPeriod}
                  onChange={(e) => setFiscalPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="FY-2026-Q4">FY 2026 - Quarter 4 (Current)</option>
                  <option value="FY-2026-Q3">FY 2026 - Quarter 3 (Audited)</option>
                  <option value="FY-2027-Q1">FY 2027 - Quarter 1 (Projected)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Journal Classification</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'STANDARD', label: 'Standard Cash / Rev' },
                    { key: 'ADJUSTING', label: 'Month-End Adjusting' },
                    { key: 'INTER_ACCOUNT', label: 'Inter-Bank Transfer' },
                    { key: 'INVENTORY_REVAL', label: 'Wet Stock Variance' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setVoucherType(t.key as any)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold text-center transition-all ${
                        voucherType === t.key
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-2xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Forecourt Cost Center</label>
                <select
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="MAIN-FORECOURT">Station Retail Forecourt (Fuel)</option>
                  <option value="LUBE-BAY">Quick-Lube & Oil Service Bay</option>
                  <option value="C-STORE">Oasis Convenience Mart</option>
                  <option value="HQ-ADMIN">Station Central Administration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Double-Entry Dual Legs */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Double-Entry Posting Legs (GAAP / IFRS)</h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Debit and Credit legs must be equal. Enter accounts from master Chart of Accounts.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[11px] font-bold text-gray-700">
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                <span>Zero-Sum Rule Enforced</span>
              </div>
            </div>

            {/* Debit Leg Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Debit Leg (Dr.)
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Increase Asset / Expense
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-8">
                  <label className="block text-gray-700 font-bold mb-1">Debit General Ledger Account</label>
                  <select
                    value={debitAccount}
                    onChange={(e) => setDebitAccount(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-xl font-bold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {CHART_OF_ACCOUNTS.map((acc) => (
                      <option key={acc.code} value={acc.code}>
                        {acc.code} — {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-gray-700 font-bold mb-1">Debit Amount ($ USD)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={debitAmount}
                      onChange={(e) => {
                        setDebitAmount(e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2 border border-emerald-300 bg-white rounded-xl font-mono font-black text-emerald-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Leg Box */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Credit Leg (Cr.)
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                  Increase Liability / Revenue / Equity
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-8">
                  <label className="block text-gray-700 font-bold mb-1">Credit General Ledger Account</label>
                  <select
                    value={creditAccount}
                    onChange={(e) => setCreditAccount(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-xl font-bold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {CHART_OF_ACCOUNTS.map((acc) => (
                      <option key={acc.code} value={acc.code}>
                        {acc.code} — {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-gray-700 font-bold mb-1">Credit Amount ($ USD)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={creditAmount}
                      onChange={(e) => {
                        setCreditAmount(e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2 border border-blue-300 bg-white rounded-xl font-mono font-black text-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Balance Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCreditAmount(debitAmount)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <span>Match Credit to Debit ($ {numDebit.toLocaleString()})</span>
              </button>
            </div>
          </div>

          {/* Card 3: Narrative Memo & Audit Justification */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Forecourt Operational Audit Trail</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Traceability linkage to shift reports, delivery BOLs, or customer fleet accounts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Operational Source Reference</label>
                <input
                  type="text"
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  placeholder="e.g. SHIFT-EVENING-PUMP1-4 or BOL-8849"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Authorizing Controller / Reviewer</label>
                <input
                  type="text"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Posting Narrative / Journal Description</label>
                <textarea
                  rows={2}
                  required
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Attach Source Audit Documents</label>
                <div className="border border-dashed border-gray-200 rounded-2xl p-3 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-gray-700 font-bold text-xs">{attachmentName}</span>
                    <span className="text-[10px] text-gray-400">(2.4 MB PDF scanned voucher)</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 cursor-pointer hover:underline">
                    Browse File
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Underwriting & Balance Preview */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Real-time Double-Entry Balance Cockpit */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-600" />
                Ledger Balance Cockpit
              </span>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  isBalanced
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800 animate-pulse'
                }`}
              >
                {isBalanced ? 'BALANCED' : 'OUT OF BALANCE'}
              </span>
            </div>

            {/* Total Balance Meters */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Total Debit (Dr)</div>
                <div className="text-lg font-black text-emerald-950 font-mono mt-0.5">
                  ${numDebit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Total Credit (Cr)</div>
                <div className="text-lg font-black text-blue-950 font-mono mt-0.5">
                  ${numCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Variance indicator */}
            <div className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between ${
              isBalanced ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}>
              <span>Leg Variance (Δ):</span>
              <span className="font-mono text-sm">
                ${variance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* T-Account Visual Representation */}
            <div className="p-3.5 bg-gray-900 text-white rounded-2xl space-y-2 text-xs">
              <div className="text-[10px] font-mono uppercase text-gray-400 border-b border-gray-800 pb-1.5 flex justify-between">
                <span>GAAP T-Account Audit</span>
                <span>{voucherNumber}</span>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-emerald-400">
                  <span>Dr. {debitObj?.code} - {debitObj?.name.substring(0, 20)}...</span>
                  <span>+${numDebit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-400 pl-4">
                  <span>Cr. {creditObj?.code} - {creditObj?.name.substring(0, 20)}...</span>
                  <span>-${numCredit.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 text-[10px] text-gray-400 flex items-center justify-between">
                <span>Cost Center: {costCenter}</span>
                <span className="text-emerald-400 font-bold">{fiscalPeriod}</span>
              </div>
            </div>
          </div>

          {/* Audit & Compliance Readiness Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              General Ledger Posting Audit Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Debit equals Credit exactly ($0.00 delta)', valid: isBalanced },
                { label: 'Debit Account selected from active COA', valid: !!debitAccount },
                { label: 'Credit Account selected from active COA', valid: !!creditAccount },
                { label: 'Operational source reference specified', valid: sourceRef.length > 3 },
                { label: 'Full accounting memo provided', valid: memo.length > 5 },
                { label: 'Certified financial controller assigned', valid: approvedBy.length > 3 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  {item.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className={item.valid ? 'font-medium' : 'text-gray-400 font-normal'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
