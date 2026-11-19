'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  Clock,
  Sparkles,
  Lock,
  Radio,
  FileText,
  Save,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  // Form State
  const [formData, setFormData] = useState({
    // 1. Legal Entity
    legalName: '',
    tradingName: '',
    category: 'Corporate Fleet',
    taxId: '',
    registrationNumber: '',
    incorporationDate: '2020-05-15',
    // 2. Contact
    contactPerson: '',
    roleTitle: 'Fleet Operations Director',
    phone: '',
    secondaryPhone: '',
    billingEmail: '',
    operationsEmail: '',
    billingAddress: '',
    city: 'Mogadishu',
    postalCode: '25201',
    // 3. Credit & Underwriting
    creditLimit: 25000,
    paymentTerms: 'Net 30 Days',
    dailySpendCap: 2500,
    monthlyLitersQuota: 30000,
    overlimitLockout: true,
    autoSuspendOverdue: true,
    // 4. Fuel & Pricing
    pricingScheme: 'Fleet Wholesale (-$0.05/L)',
    authorizedGrades: ['Petrol', 'Diesel'] as ('Petrol' | 'Diesel' | 'Kerosene')[],
    authorizedBranches: ['Central Station', 'Airport Express', 'Port Gate West'],
    // 5. Forecourt Security
    pinRequired: true,
    odometerPrompt: true,
    maxLitersPerTransaction: 150,
    fuelingHoursWindow: 'ALL_HOURS',
    rfidMasterTag: 'RFID-CORP-MASTER-' + Math.floor(1000 + Math.random() * 9000),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived initials
  const initials = formData.legalName
    ? formData.legalName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'CU';

  // Checklist Validation
  const isProfileComplete = formData.legalName.trim().length > 2 && formData.taxId.trim().length > 2;
  const isContactComplete = formData.contactPerson.trim().length > 2 && formData.billingEmail.includes('@');
  const isCreditComplete = Number(formData.creditLimit) >= 1000;
  const isFuelComplete = formData.authorizedGrades.length > 0;
  const isReadyForSubmission = isProfileComplete && isContactComplete && isCreditComplete && isFuelComplete;

  const handleGradeToggle = (grade: 'Petrol' | 'Diesel' | 'Kerosene') => {
    if (formData.authorizedGrades.includes(grade)) {
      if (formData.authorizedGrades.length > 1) {
        setFormData({
          ...formData,
          authorizedGrades: formData.authorizedGrades.filter((g) => g !== grade),
        });
      }
    } else {
      setFormData({
        ...formData,
        authorizedGrades: [...formData.authorizedGrades, grade],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.legalName || !formData.billingEmail) {
      toast({
        title: 'Validation Error',
        description: 'Please provide the legal company name and official billing email.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Customer Account Commissioned',
        description: `Corporate account for ${formData.legalName} ($${formData.creditLimit.toLocaleString()} credit) has been commissioned.`,
        type: 'success',
      });
      router.push('/customers');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ===================================================================== */}
      {/* BREADCRUMB & SENIOR SYSTEM TOP HEADER                                 */}
      {/* ===================================================================== */}
      <div className="flex flex-col gap-2">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/customers" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customers & Corporate Fleets</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">New Account Enrollment</span>
        </div>

        {/* Action Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Enroll Corporate Customer & Fleet Account
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  Draft Registration
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Configure corporate legal identification, risk underwriting credit line, contract fuel pricing, and forecourt nozzle interlocks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/customers"
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all"
            >
              Cancel & Exit
            </Link>

            <button
              type="button"
              onClick={() => {
                toast({
                  title: 'Draft Saved',
                  description: 'Corporate registration draft has been cached locally.',
                  type: 'info',
                });
              }}
              className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              type="submit"
              form={formId}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Commission Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN 2-COLUMN ENTERPRISE FORM LAYOUT                                  */}
      {/* Left: 70% Detailed Form Cards | Right: 30% Sticky Underwriting Preview */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =================================================================== */}
        {/* LEFT COLUMN: MULTI-CARD ENTERPRISE FORM (8 Cols)                    */}
        {/* =================================================================== */}
        <form id={formId} onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* ----------------------------------------------------------------- */}
          {/* SECTION 1: LEGAL ENTITY & COMMERCIAL PROFILE                      */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Legal Entity & Corporate Commercial Identity
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Registered corporate details, commercial registration and tax classification.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Required for Forecourt Invoicing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Legal Entity / Registered Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Rapid Logistics Ltd"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Trading Name / Brand DBA (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro Express Freight"
                  value={formData.tradingName}
                  onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Entity Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                >
                  <option value="Corporate Fleet">Corporate Fleet (Commercial)</option>
                  <option value="Logistics / Heavy Haulier">Logistics / Heavy Haulier</option>
                  <option value="Government / Public Agency">Government / Public Agency</option>
                  <option value="Commercial Taxi">Commercial Taxi / Shuttle Fleet</option>
                  <option value="VIP Retail">VIP High-Volume Retail Account</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tax / VAT Registration ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SO-VAT-884920"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Commercial Registry No. (CRN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MOG-CRN-2023-11"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 2: PRIMARY BILLING & OPERATIONAL CONTACTS                 */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Primary Billing & Forecourt Operations Contacts
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Key designated officers authorized to sign off on invoices and fuel quotas.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Primary Authorized Representative *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Corporate Role / Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Director of Fleet Logistics"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Official Billing / Invoicing Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. accounts.payable@company.so"
                  value={formData.billingEmail}
                  onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Direct Contact Mobile Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+252 61 555-7788"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Registered Physical Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Airport Road, Sector 4, Wadajir District"
                  value={formData.billingAddress}
                  onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City / Forecourt Hub
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 3: FORECOURT CREDIT FACILITY & UNDERWRITING               */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Forecourt Credit Facility & Underwriting Rules
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Revolving credit line limit, repayment terms, and automated nozzle interlock triggers.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Multi-Currency Escrow
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Approved Credit Line ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-gray-400 font-bold">Presets:</span>
                  {[10000, 25000, 50000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, creditLimit: preset })}
                      className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      ${(preset / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Settlement Payment Terms *
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                >
                  <option value="Pre-paid">Pre-paid Escrow Deposit (Zero Risk)</option>
                  <option value="Net 7 Days">Net 7 Days (Weekly Invoicing)</option>
                  <option value="Net 15 Days">Net 15 Days (Semi-Monthly)</option>
                  <option value="Net 30 Days">Net 30 Days (Standard Enterprise)</option>
                  <option value="Net 60 Days">Net 60 Days (Government Tier)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Daily Forecourt Spend Cap ($ USD)
                </label>
                <input
                  type="number"
                  value={formData.dailySpendCap}
                  onChange={(e) => setFormData({ ...formData, dailySpendCap: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Monthly Volume Quota (Liters Allocation)
                </label>
                <input
                  type="number"
                  value={formData.monthlyLitersQuota}
                  onChange={(e) => setFormData({ ...formData, monthlyLitersQuota: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>
            </div>

            {/* Overlimit Automated Rule Card */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.overlimitLockout}
                  onChange={(e) => setFormData({ ...formData, overlimitLockout: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    Automatic Forecourt Dispenser Lockout on 100% Credit Breach
                  </span>
                  <span className="text-[11px] text-amber-700 block mt-0.5">
                    When outstanding fuel draws reach the approved facility limit, pump nozzles will automatically reject RFID tags until remittance is posted.
                  </span>
                </div>
              </label>

              <div className="border-t border-amber-200/60 pt-2.5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoSuspendOverdue}
                    onChange={(e) => setFormData({ ...formData, autoSuspendOverdue: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Auto-Suspend Fleet Cards When Invoices are 7+ Days Past Due
                    </span>
                    <span className="text-[11px] text-amber-700 block mt-0.5">
                      Sends automated SMS notification to fleet director 48 hours prior to nozzle lockout.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 4: CONTRACT FUEL PRICING & GRADE AUTHORIZATIONS           */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Contract Fuel Pricing & Grade Authorizations
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Custom discounts off roadside totem LED price and allowed forecourt products.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contract Pricing Index / Formula *
              </label>
              <select
                value={formData.pricingScheme}
                onChange={(e) => setFormData({ ...formData, pricingScheme: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="Standard Retail">Standard Roadside Totem Retail (Zero Discount)</option>
                <option value="Fleet Wholesale (-$0.05/L)">Fleet Wholesale (-$0.05 / Liter Fixed Discount)</option>
                <option value="Bulk Contractor (-$0.08/L)">Bulk Heavy Logistics (-$0.08 / Liter Fixed Discount)</option>
                <option value="Cost + 4%">Refinery Landed Cost + 4% Flat Forecourt Margin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Authorized Forecourt Fuel Products *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { grade: 'Petrol' as const, name: 'Super Unleaded Petrol 95', color: 'blue' },
                  { grade: 'Diesel' as const, name: 'Ultra-Low Sulfur Heavy Diesel', color: 'emerald' },
                  { grade: 'Kerosene' as const, name: 'Domestic & Aviation Kerosene', color: 'amber' },
                ].map((item) => {
                  const isChecked = formData.authorizedGrades.includes(item.grade);
                  return (
                    <button
                      key={item.grade}
                      type="button"
                      onClick={() => handleGradeToggle(item.grade)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{item.grade}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 5: FORECOURT SECURITY & DISPENSER TELEMETRY               */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Forecourt Dispenser Security & Anti-Fraud Interlocks
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Driver PIN authorization, odometer mileage tracking, and RFID tag bindings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pinRequired}
                  onChange={(e) => setFormData({ ...formData, pinRequired: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-bold text-blue-950 block">
                    Require 4-Digit Driver Keypad PIN at Dispenser
                  </span>
                  <span className="text-[11px] text-blue-700 block mt-0.5">
                    Nozzle will not unholster until driver verifies PIN on forecourt terminal.
                  </span>
                </div>
              </label>

              <div className="border-t border-blue-200/60 pt-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.odometerPrompt}
                    onChange={(e) => setFormData({ ...formData, odometerPrompt: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-blue-950 block">
                      Mandatory Odometer Mileage Prompt at Pump
                    </span>
                    <span className="text-[11px] text-blue-700 block mt-0.5">
                      Ensures automated calculation of fleet fuel economy (km/L) and flags odometer rollbacks.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Max Volume Per Fill (Liters)
                </label>
                <input
                  type="number"
                  value={formData.maxLitersPerTransaction}
                  onChange={(e) =>
                    setFormData({ ...formData, maxLitersPerTransaction: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Master Fleet RFID Keyfob / Card Tag UID
                </label>
                <input
                  type="text"
                  value={formData.rfidMasterTag}
                  onChange={(e) => setFormData({ ...formData, rfidMasterTag: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-purple-700"
                />
              </div>
            </div>
          </div>
        </form>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: STICKY UNDERWRITING SUMMARY & AUDIT CARD (4 Cols)     */}
        {/* =================================================================== */}
        <div className="lg:col-span-4 sticky top-6 space-y-5">
          {/* Main Account Underwriting Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div
                className={`w-11 h-11 rounded-2xl ${
                  formData.legalName ? 'bg-blue-600' : 'bg-gray-300'
                } text-white font-black text-sm flex items-center justify-center shadow-xs transition-colors`}
              >
                {initials}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">
                  Live Preview
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {formData.legalName || 'Enter Company Name...'}
                </h3>
                <span className="text-[11px] text-gray-400 block truncate">
                  {formData.category}
                </span>
              </div>
            </div>

            {/* Financial Exposure Preview */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Approved Credit:</span>
                <span className="font-black text-gray-900 text-sm">
                  ${Number(formData.creditLimit).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Daily Spend Cap:</span>
                <span className="font-bold text-gray-800">
                  ${Number(formData.dailySpendCap).toLocaleString()} / day
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Monthly Quota:</span>
                <span className="font-mono font-bold text-gray-800">
                  {Number(formData.monthlyLitersQuota).toLocaleString()} L
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Pricing Scheme:</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {formData.pricingScheme}
                </span>
              </div>
            </div>

            {/* Selected Products */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Authorized Forecourt Grades
              </span>
              <div className="flex flex-wrap gap-1.5">
                {formData.authorizedGrades.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200/60"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Validation & Compliance Checklist */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Enrollment Readiness Audit
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isProfileComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isProfileComplete ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isProfileComplete ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Legal Entity & Tax ID
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isContactComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isContactComplete ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isContactComplete ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Billing Contact & Email
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isCreditComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCreditComplete ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                  </div>
                  <span className={isCreditComplete ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Approved Credit Facility
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isFuelComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isFuelComplete ? <Check className="w-3 h-3 stroke-[3]" /> : '4'}
                  </div>
                  <span className={isFuelComplete ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Fuel Grades & Pricing Index
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Primary Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                form={formId}
                disabled={isSubmitting || !isReadyForSubmission}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Commission Account</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Forecourt Compliance Seal Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">Forecourt Regulatory Compliance</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Account enrollments adhere to API RP 1621 and NFPA 30 fuel dispensing safety standards with automated ATG interlock verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
