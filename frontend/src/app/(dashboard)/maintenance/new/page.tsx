'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewMaintenancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  const [formData, setFormData] = useState({
    orderNumber: 'WO-2026-' + Math.floor(1000 + Math.random() * 9000),
    equipment: 'Dispenser Pump 02 (Island 1)',
    equipmentTag: 'DSP-02-NOZZLE-B',
    type: 'CORRECTIVE',
    priority: 'HIGH',
    description: 'Replace cracked hose swivel joint and recalibrate electronic flow meter pulser',
    assignedTo: 'Mogadishu Petroleum Equipment Technicians',
    technicianPhone: '+252 61 771-4433',
    lotoProtocol: true,
    zoneHazardClearance: 'Zone 1 (Vapor Hazardous)',
    estimatedCostUsd: 320.0,
    scheduledDate: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEquipValid = formData.equipment.trim().length > 3;
  const isDescValid = formData.description.trim().length > 5;
  const isTechValid = formData.assignedTo.trim().length > 2;
  const isReady = isEquipValid && isDescValid && isTechValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Work Order Dispatched',
        description: `Order ${formData.orderNumber} for ${formData.equipment} assigned to ${formData.assignedTo}.`,
        type: 'success',
      });
      router.push('/maintenance');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/maintenance" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Forecourt Maintenance & Inspections</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">New Work Order</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Wrench className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Forecourt Equipment Maintenance Work Order
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
                  NFPA 30 LOTO Interlock
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Dispatch certified petroleum technicians, assign Lockout/Tagout (LOTO) isolation, and log equipment spare parts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/maintenance"
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
                  <span>Dispatch & Authorize Work Order</span>
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
          {/* Card 1: Equipment Asset & Diagnostic */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Forecourt Equipment Asset & Fault Diagnostics
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Target forecourt equipment asset tag and failure severity.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Work Order # *
                </label>
                <input
                  type="text"
                  required
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Maintenance Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="CORRECTIVE">Corrective Emergency Repair</option>
                  <option value="PREVENTIVE">Routine Preventive Maintenance</option>
                  <option value="CALIBRATION">Weights & Measures Flow Calibration</option>
                  <option value="SAFETY">NFPA 30 Fire & Safety Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Priority Urgency
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-rose-700"
                >
                  <option value="HIGH">CRITICAL / HIGH (Immediate Forecourt Lockout)</option>
                  <option value="MEDIUM">MEDIUM (Schedule within 48h)</option>
                  <option value="LOW">LOW (Routine Monthly Check)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Target Equipment Asset *
                </label>
                <select
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="Dispenser Pump 01 (Island 1)">Dispenser Pump 01 (Island 1)</option>
                  <option value="Dispenser Pump 02 (Island 1)">Dispenser Pump 02 (Island 1)</option>
                  <option value="Submersible Turbine Pump STP-DIESEL">Submersible Turbine Pump STP-DIESEL</option>
                  <option value="Veeder-Root TLS-450 ATG Console">Veeder-Root TLS-450 ATG Console</option>
                  <option value="Emergency Stop ESD Master Push-button">Emergency Stop ESD Master Push-button</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Equipment Hardware Tag
                </label>
                <input
                  type="text"
                  value={formData.equipmentTag}
                  onChange={(e) => setFormData({ ...formData, equipmentTag: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Detailed Scope of Work & Component Malfunction *
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

          {/* Card 2: LOTO & Hazardous Clearance */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Hazardous Vapor Zone & Lockout/Tagout (LOTO)
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    NFPA electrical power isolation and vapor atmospheric safety clearance.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Safety Isolation
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.lotoProtocol}
                  onChange={(e) => setFormData({ ...formData, lotoProtocol: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    Electrical Breaker Locked & Tagged Out (LOTO Padlock Active)
                  </span>
                  <span className="text-[11px] text-amber-700 block mt-0.5">
                    Circuit breaker disengaged to prevent accidental electrocution or spark ignition during fuel line maintenance.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Card 3: Engineering Technician & Cost */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Certified Service Engineering & Parts Cost
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Authorized petroleum service contractor and procurement estimate.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contractor / Certified Technician *
                </label>
                <input
                  type="text"
                  required
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Estimated Repair Cost ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="10"
                    value={formData.estimatedCostUsd}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedCostUsd: Number(e.target.value) })
                    }
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Right Sticky Preview (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                WO
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-rose-600 block uppercase tracking-wider">
                  Work Order Ticket
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">{formData.orderNumber}</h3>
                <span className="text-[11px] text-gray-400 block truncate">{formData.equipment}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Urgency:</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  {formData.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Technician:</span>
                <span className="font-bold text-gray-900 truncate max-w-[150px]">{formData.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Est. Cost:</span>
                <span className="font-mono font-bold text-gray-800">${formData.estimatedCostUsd.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Safety Clearance Audit
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isEquipValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isEquipValid ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isEquipValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Asset Tag Verified
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isTechValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isTechValid ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isTechValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Technician Clearances
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
              <span>Dispatch & Authorize Work Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
