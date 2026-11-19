'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Check,
  Building2,
  CreditCard,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewShiftPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  const [formData, setFormData] = useState({
    shiftType: 'Morning' as 'Morning' | 'Afternoon' | 'Night',
    cashierName: 'Sarah Jenkins',
    cashierEmployeeId: 'EMP-8812',
    supervisorName: 'Alex Morgan (Super Admin)',
    islandAssignment: 'Island 1 & 2 (Dispensers 01-04)',
    posTerminalId: 'POS-TERM-01',
    openingFloatUsd: 500,
    openingFloatLocalSos: 12500000,
    denominations: {
      d100: 2,
      d50: 3,
      d20: 5,
      d10: 5,
    },
    // Digital Dispenser Start Totalizers (Liters)
    meterPump1Petrol: 142850.5,
    meterPump2Petrol: 119420.2,
    meterPump3Diesel: 284100.8,
    meterPump4Diesel: 231900.4,
    notes: 'Morning forecourt peak shift. ATG wet stock sync active.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const isCashierValid = formData.cashierName.trim().length > 2;
  const isFloatValid = formData.openingFloatUsd >= 50;
  const isMetersValid = formData.meterPump1Petrol > 0 && formData.meterPump3Diesel > 0;
  const isReady = isCashierValid && isFloatValid && isMetersValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Forecourt Shift Opened',
        description: `Shift SHF-${Math.floor(10000 + Math.random() * 90000)} initiated for ${formData.cashierName} on ${formData.islandAssignment}.`,
        type: 'success',
      });
      router.push('/shifts');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/shifts" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Forecourt Shifts & Handover</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">Open Forecourt Shift</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Open Forecourt Cashier & Dispenser Shift
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  Handover Interlock
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Record opening cash till float, log digital pump meter totalizers, and assign forecourt island attendants.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/shifts"
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
                  <span>Authorize & Open Shift</span>
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
          {/* Card 1: Shift & Island Assignment */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Shift Period & Forecourt Island Assignment
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Select active schedule window and assign certified forecourt attendants.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shift Timing Window *
                </label>
                <select
                  value={formData.shiftType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shiftType: e.target.value as 'Morning' | 'Afternoon' | 'Night',
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="Morning">Morning Shift (06:00 AM – 14:00 PM)</option>
                  <option value="Afternoon">Afternoon Shift (14:00 PM – 22:00 PM)</option>
                  <option value="Night">Night Logistics Shift (22:00 PM – 06:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Primary Shift Cashier *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cashierName}
                  onChange={(e) => setFormData({ ...formData, cashierName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Employee Badge ID
                </label>
                <input
                  type="text"
                  value={formData.cashierEmployeeId}
                  onChange={(e) => setFormData({ ...formData, cashierEmployeeId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Assigned Forecourt Islands & Dispensers *
                </label>
                <select
                  value={formData.islandAssignment}
                  onChange={(e) => setFormData({ ...formData, islandAssignment: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="Island 1 & 2 (Dispensers 01-04)">Island 1 & 2 (Dispensers 01-04)</option>
                  <option value="Island 3 & 4 (Heavy Transport Bay)">Island 3 & 4 (Heavy Transport Bay)</option>
                  <option value="All Forecourt Islands (Station Full)">All Forecourt Islands (Station Full)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Station Supervisor Authorizer
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.supervisorName}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Cash Till Drawer Opening Float */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Cash Till Drawer Float & Denominations
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Opening petty cash provided to cashier for forecourt customer change.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Dual Currency
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Opening Float ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="10"
                    step="10"
                    value={formData.openingFloatUsd}
                    onChange={(e) =>
                      setFormData({ ...formData, openingFloatUsd: Number(e.target.value) })
                    }
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Local Currency Float (Somali Shilling SOS)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={formData.openingFloatLocalSos}
                  onChange={(e) =>
                    setFormData({ ...formData, openingFloatLocalSos: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Digital Dispenser Meter Totalizers */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Digital Dispenser Start Totalizers (Liters Handover)
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Electronic non-resettable pump meter readings pulled directly from dispenser CPU.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Dart / Two-Wire Protocol
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-900">Dispenser #01 (Petrol 95)</span>
                  <span className="text-[10px] font-mono text-blue-600 font-bold">Island 1</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.meterPump1Petrol}
                  onChange={(e) =>
                    setFormData({ ...formData, meterPump1Petrol: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg font-mono font-black text-sm text-gray-900"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-900">Dispenser #02 (Petrol 95)</span>
                  <span className="text-[10px] font-mono text-blue-600 font-bold">Island 1</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.meterPump2Petrol}
                  onChange={(e) =>
                    setFormData({ ...formData, meterPump2Petrol: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg font-mono font-black text-sm text-gray-900"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900">Dispenser #03 (Heavy Diesel)</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Island 2</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.meterPump3Diesel}
                  onChange={(e) =>
                    setFormData({ ...formData, meterPump3Diesel: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg font-mono font-black text-sm text-gray-900"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900">Dispenser #04 (Heavy Diesel)</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Island 2</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.meterPump4Diesel}
                  onChange={(e) =>
                    setFormData({ ...formData, meterPump4Diesel: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg font-mono font-black text-sm text-gray-900"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Sticky Preview (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                SHF
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">
                  Shift Cockpit Summary
                </span>
                <h3 className="font-bold text-gray-900 text-sm">
                  {formData.shiftType} Forecourt Shift
                </h3>
                <span className="text-[11px] text-gray-400 block">
                  {formData.islandAssignment}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Assigned Cashier:</span>
                <span className="font-bold text-gray-900">{formData.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Opening Cash Float:</span>
                <span className="font-black text-emerald-700 font-mono">
                  ${formData.openingFloatUsd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Dispensers Engaged:</span>
                <span className="font-bold text-gray-800">4 Active Nozzles</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Shift Readiness Protocol
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isCashierValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isCashierValid ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isCashierValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Certified Cashier Assigned
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isFloatValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isFloatValid ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isFloatValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Cash Till Float Reconciled
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isMetersValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isMetersValid ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                  </div>
                  <span className={isMetersValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Totalizer Meters Latched
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
              <span>Authorize & Open Shift</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
