'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  GaugeCircle,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Activity,
  Zap,
  Check,
  Building2,
  Plus,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewPumpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  const [formData, setFormData] = useState({
    code: 'DSP-05',
    name: 'Forecourt Island 3 High-Flow Diesel Bay',
    brandModel: 'Wayne Helix 6000 Wide Body',
    protocol: 'Wayne Dart (Two-Wire Current Loop)',
    island: 'Island 3',
    currentLoopAddress: '05',
    weightsSealNumber: 'WM-SO-2026-8812',
    pulserRatio: '100 Pulses / Liter',
    vaporRecovery: true,
    emergencyShearValveCheck: true,
    stpPumpRelay: 'STP-DIESEL-BAY-02',
    nozzles: [
      { id: 'n1', label: 'Nozzle 1A', product: 'Diesel', highFlow: true, initialMeter: 0 },
      { id: 'n2', label: 'Nozzle 1B', product: 'Diesel', highFlow: true, initialMeter: 0 },
      { id: 'n3', label: 'Nozzle 2A', product: 'Petrol', highFlow: false, initialMeter: 0 },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCodeValid = formData.code.trim().length > 2;
  const isSealValid = formData.weightsSealNumber.trim().length > 3;
  const isNozzlesValid = formData.nozzles.length > 0;
  const isReady = isCodeValid && isSealValid && isNozzlesValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Forecourt Dispenser Commissioned',
        description: `Dispenser ${formData.code} on ${formData.island} has been integrated into Forecourt Automation Controller.`,
        type: 'success',
      });
      router.push('/pumps');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/pumps" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dispensers & Nozzle Automation</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">Commission Dispenser</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <GaugeCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Commission Forecourt Electronic Dispenser
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                  IFSF-LON / Dart Protocol
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Configure forecourt dispenser electronics, multi-nozzle hydraulic mappings, Weights & Measures calibration seals, and shear interlocks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/pumps"
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
                  <span>Commission & Bind Dispenser</span>
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
          {/* Card 1: Hardware & Forecourt Controller Spec */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Dispenser Hardware & Forecourt Interface Protocol
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Electronic head communication loop with DOMS / Wayne / Gilbarco controller.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Dispenser Asset Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Brand & Model Series *
                </label>
                <select
                  value={formData.brandModel}
                  onChange={(e) => setFormData({ ...formData, brandModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="Wayne Helix 6000 Wide Body">Wayne Helix 6000 Wide Body</option>
                  <option value="Gilbarco Veeder-Root Horizon">Gilbarco Veeder-Root Horizon</option>
                  <option value="Tatsuno Sunny-GL Multi-Product">Tatsuno Sunny-GL Multi-Product</option>
                  <option value="Tokheim Quantium 510">Tokheim Quantium 510</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Forecourt Island Location *
                </label>
                <select
                  value={formData.island}
                  onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="Island 1">Island 1 (North Main Lane)</option>
                  <option value="Island 2">Island 2 (South Main Lane)</option>
                  <option value="Island 3">Island 3 (Commercial Heavy Haulier Bay)</option>
                  <option value="Island 4">Island 4 (High-Speed Diesel Canopy)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Descriptive Forecourt Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Controller Interface Protocol
                </label>
                <select
                  value={formData.protocol}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Wayne Dart (Two-Wire Current Loop)">Wayne Dart (Two-Wire Current Loop)</option>
                  <option value="Gilbarco 2-Wire Protocol">Gilbarco 2-Wire Protocol</option>
                  <option value="IFSF-LON Over IP Ethernet">IFSF-LON Over IP Ethernet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Channel Loop Address
                </label>
                <input
                  type="text"
                  value={formData.currentLoopAddress}
                  onChange={(e) => setFormData({ ...formData, currentLoopAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Metrology & Weights and Measures */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Metrology Calibration & Weights & Measures Seal
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Official calibration seal, electronic pulser ratio and compliance audit lock.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Legal Metrology Lock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Weights & Measures Seal ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WM-SO-2026-8812"
                  value={formData.weightsSealNumber}
                  onChange={(e) => setFormData({ ...formData, weightsSealNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Optical Pulser Ratio
                </label>
                <input
                  type="text"
                  value={formData.pulserRatio}
                  onChange={(e) => setFormData({ ...formData, pulserRatio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Safety Interlocks */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Safety Shutoff Interlocks & Environmental Protections
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Automatic shear valve interlock and Submersible Turbine Pump (STP) relay assignment.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emergencyShearValveCheck}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyShearValveCheck: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-bold text-blue-950 block">
                    Under-Dispenser Impact Shear Valve Tested & Latched
                  </span>
                  <span className="text-[11px] text-blue-700 block mt-0.5">
                    Automatically seals fuel supply pipes in the event of vehicle forecourt impact.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* Right Sticky Preview (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                {formData.code}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">
                  Live Dispenser Status
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">{formData.name}</h3>
                <span className="text-[11px] text-gray-400 block truncate">{formData.brandModel}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Island Bay:</span>
                <span className="font-bold text-gray-900">{formData.island}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Protocol:</span>
                <span className="font-bold text-gray-800">{formData.protocol.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Weights Seal:</span>
                <span className="font-mono font-bold text-emerald-700">{formData.weightsSealNumber}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Commissioning Readiness
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isCodeValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isCodeValid ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isCodeValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Asset Code & Loop Address
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSealValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isSealValid ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isSealValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Legal Metrology Seal
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isNozzlesValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isNozzlesValid ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                  </div>
                  <span className={isNozzlesValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Nozzles Hydration Configured
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
              <span>Commission & Bind Dispenser</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
