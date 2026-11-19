'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Wallet,
  DollarSign,
  Receipt,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewExpensePage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  const [formData, setFormData] = useState({
    voucherNumber: 'EXP-2026-' + Math.floor(1000 + Math.random() * 9000),
    category: 'MAINTENANCE',
    stationBranch: 'Central Forecourt Hub',
    description: 'Emergency replacement of dispenser breakaway valve & nozzle swivel hose',
    vendor: 'Mogadishu Forecourt Engineering Supplies',
    amountUsd: 285.0,
    paymentMethod: 'PETTY_CASH',
    invoiceNumber: 'INV-MFES-8812',
    budgetLineCode: 'OPEX-MAINT-2026-Q4',
    submittedBy: 'Sarah Jenkins (Cashier / Shift Lead)',
    approver: 'David Miller (Station Manager)',
    notes: 'Approved under emergency forecourt equipment repair threshold.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDescValid = formData.description.trim().length > 5;
  const isVendorValid = formData.vendor.trim().length > 2;
  const isAmountValid = formData.amountUsd > 0;
  const isReady = isDescValid && isVendorValid && isAmountValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Expense Voucher Requisitioned',
        description: `Voucher ${formData.voucherNumber} for $${formData.amountUsd.toFixed(2)} submitted for manager sign-off.`,
        type: 'success',
      });
      router.push('/expenses');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/expenses" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Forecourt OPEX & Petty Cash</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">New Expense Voucher</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Wallet className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Forecourt Operating Expense (OPEX) Voucher
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  Petty Cash Approval Pipeline
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Requisition petty cash, maintenance procurement invoices, generator fuel, and station utility payments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/expenses"
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              form={formId}
              disabled={isSubmitting || !isReady}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Voucher for Sign-Off</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Senior Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (8 Cols) */}
        <form id={formId} onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Voucher Requisition & Category */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Voucher Requisition & Cost Center Allocation
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Voucher tracking number and expense categorization.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Voucher Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.voucherNumber}
                  onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Expense Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="MAINTENANCE">Equipment Maintenance & Spare Parts</option>
                  <option value="GENERATOR_FUEL">Station Generator Backup Diesel</option>
                  <option value="UTILITIES">Electricity & Municipal Water</option>
                  <option value="STAFF_MEALS">Forecourt Shift Overtime Meals</option>
                  <option value="SUPPLIES">Paper Rolls, Stationery & PPE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Station Forecourt Branch
                </label>
                <select
                  value={formData.stationBranch}
                  onChange={(e) => setFormData({ ...formData, stationBranch: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                >
                  <option value="Central Forecourt Hub">Central Forecourt Hub</option>
                  <option value="Airport Express Lane">Airport Express Lane</option>
                  <option value="Port Gate West">Port Gate West</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Detailed Purpose & Itemized Expenditure Memo *
              </label>
              <textarea
                rows={2}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Card 2: Financial Valuation & Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Financial Valuation & Disbursement Tender
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Reimbursement amount, vendor tax invoice, and disbursement tender.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Disbursement Amount ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.amountUsd}
                    onChange={(e) => setFormData({ ...formData, amountUsd: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Disbursement Tender
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="PETTY_CASH">Forecourt Cash Till Petty Cash</option>
                  <option value="BANK_TRANSFER">Corporate RTGS Bank Wire</option>
                  <option value="EVC_PLUS">EVC Plus / Zaad Mobile Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Vendor Tax Invoice / Receipt #
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Payee / Vendor Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Requisitioning Officer
                </label>
                <input
                  type="text"
                  value={formData.submittedBy}
                  onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Sticky Preview (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                ${formData.amountUsd.toFixed(0)}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-amber-600 block uppercase tracking-wider">
                  Voucher Slip
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">{formData.voucherNumber}</h3>
                <span className="text-[11px] text-gray-400 block truncate">{formData.category}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payee Vendor:</span>
                <span className="font-bold text-gray-900 truncate max-w-[150px]">{formData.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Tender:</span>
                <span className="font-bold text-gray-800">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Authorizer:</span>
                <span className="font-bold text-blue-700">{formData.approver}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Audit Clearance
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isDescValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isDescValid ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isDescValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Purpose Documented
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isVendorValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isVendorValid ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isVendorValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Payee Vendor Identified
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              form={formId}
              disabled={isSubmitting || !isReady}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Voucher for Sign-Off</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
