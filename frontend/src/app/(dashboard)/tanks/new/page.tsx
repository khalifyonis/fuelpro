'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Cylinder,
  Droplet,
  Thermometer,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  Activity,
  Layers,
  Wrench,
  Sparkles,
  Info,
  Check,
  Save,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewTankPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  // Form State
  const [formData, setFormData] = useState({
    // 1. Asset & Engineering
    code: 'UST-04',
    name: 'Forecourt North Heavy Diesel Tank 2',
    product: 'Diesel' as 'Petrol' | 'Diesel' | 'Kerosene',
    productGradeName: 'Ultra-Low Sulfur Heavy Diesel (10 ppm)',
    tankType: 'UST_DOUBLE_WALL',
    diameterMm: 2750,
    lengthMm: 8000,
    capacityLitres: 40000,
    // 2. Telemetry & ATG Probe
    atgConsoleModel: 'Veeder-Root TLS-450PLUS',
    atgProbeSerial: 'VR-MAG-88219-04',
    modbusAddress: '04',
    currentLitres: 20000,
    initialTempCelsius: 24.5,
    tempCompensationEnabled: true,
    initialWaterMm: 0,
    // 3. Safety Floors & Alarms
    safeWorkingPct: 95,
    highLevelAlarmPct: 90,
    deadstockFloorLitres: 2400,
    reorderThresholdLitres: 10000,
    waterAlarmMm: 5,
    autoShutoffInterlock: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived calculations
  const safeCapacity = Math.round((formData.capacityLitres * formData.safeWorkingPct) / 100);
  const highLevelAlarmLiters = Math.round((formData.capacityLitres * formData.highLevelAlarmPct) / 100);
  const fillPct = Math.round((formData.currentLitres / formData.capacityLitres) * 100);

  // Checklist Validation
  const isSpecComplete = formData.code.trim().length > 2 && formData.capacityLitres >= 5000;
  const isAtgComplete = formData.atgProbeSerial.trim().length > 3;
  const isSafetyComplete = formData.highLevelAlarmPct > 80 && formData.reorderThresholdLitres > 1000;
  const isReady = isSpecComplete && isAtgComplete && isSafetyComplete;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.capacityLitres) {
      toast({
        title: 'Validation Error',
        description: 'Tank asset code and nominal capacity are required.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Wet Stock Tank Commissioned',
        description: `Tank ${formData.code} (${formData.name}) has been integrated into ATG forecourt telemetry.`,
        type: 'success',
      });
      router.push('/tanks');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ===================================================================== */}
      {/* BREADCRUMB & TOP HEADER ACTION BAR                                    */}
      {/* ===================================================================== */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/tanks" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tanks & Wet Stock Telemetry</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">New UST Commissioning</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <svg className="w-6 h-6 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="6" width="18" height="12" rx="6" />
                <line x1="8" y1="6" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="18" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Commission Forecourt Wet Stock Storage Tank
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                  NFPA 30 / API 1621 Certified
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Configure double-walled containment specifications, strapping chart volumetric curve, ATG probe Modbus telemetry, and overfill horn interlocks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/tanks"
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all"
            >
              Cancel & Exit
            </Link>

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
                  <span>Commission & Interlock Tank</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2-COLUMN ENTERPRISE FORM LAYOUT                                       */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Cards (8 Cols) */}
        <form id={formId} onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Asset Engineering & Physical Specs */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Tank Physical Asset & Structural Engineering Spec
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Containment grade, geometry dimensions, and fuel product assignment.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tank Asset Code / Tag *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UST-04"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Fuel Product Grade *
                </label>
                <select
                  value={formData.product}
                  onChange={(e) => {
                    const prod = e.target.value as 'Petrol' | 'Diesel' | 'Kerosene';
                    setFormData({
                      ...formData,
                      product: prod,
                      productGradeName:
                        prod === 'Petrol'
                          ? 'Super Unleaded Petrol 95 RON'
                          : prod === 'Diesel'
                          ? 'Ultra-Low Sulfur Heavy Diesel (10 ppm)'
                          : 'Aviation & Domestic Kerosene (Paraffin)',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="Petrol">Super Unleaded Petrol 95 RON</option>
                  <option value="Diesel">Ultra-Low Sulfur Heavy Diesel (10 ppm)</option>
                  <option value="Kerosene">Domestic & Aviation Kerosene</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Containment Specification
                </label>
                <select
                  value={formData.tankType}
                  onChange={(e) => setFormData({ ...formData, tankType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 cursor-pointer"
                >
                  <option value="UST_DOUBLE_WALL">UST Double-Wall Fiberglass (UL 1316)</option>
                  <option value="UST_COMPOSITE">Composite Jacketed Steel (UL 58)</option>
                  <option value="AST_BUNDED">Aboveground Self-Bunded AST (UL 142)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Descriptive Asset Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Forecourt North Heavy Diesel Underground Tank 2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nominal Gross Capacity (L) *
                </label>
                <input
                  type="number"
                  required
                  min="5000"
                  step="1000"
                  value={formData.capacityLitres}
                  onChange={(e) => setFormData({ ...formData, capacityLitres: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
                {/* Presets */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-gray-400 font-bold">Presets:</span>
                  {[20000, 35000, 40000, 60000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, capacityLitres: preset })}
                      className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold cursor-pointer"
                    >
                      {(preset / 1000).toFixed(0)}k L
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Internal Shell Diameter (mm)
                </label>
                <input
                  type="number"
                  value={formData.diameterMm}
                  onChange={(e) => setFormData({ ...formData, diameterMm: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Cylinder Length (mm)
                </label>
                <input
                  type="number"
                  value={formData.lengthMm}
                  onChange={(e) => setFormData({ ...formData, lengthMm: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Card 2: ATG Probe & Telemetry */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    ATG Probe & Automated Wet Stock Telemetry
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Magnetostrictive probe serial, Modbus RS-485 interface and temperature compensation.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Continuous Inventory
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ATG Console Interface
                </label>
                <select
                  value={formData.atgConsoleModel}
                  onChange={(e) => setFormData({ ...formData, atgConsoleModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                >
                  <option value="Veeder-Root TLS-450PLUS">Veeder-Root TLS-450PLUS</option>
                  <option value="Dover ProGauge MagLink">Dover DFS ProGauge MagLink</option>
                  <option value="Franklin Fueling Colibri">Franklin Fueling Colibri Console</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ATG Probe Serial Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VR-MAG-88219-04"
                  value={formData.atgProbeSerial}
                  onChange={(e) => setFormData({ ...formData, atgProbeSerial: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-purple-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  RS-485 Modbus Address
                </label>
                <input
                  type="text"
                  value={formData.modbusAddress}
                  onChange={(e) => setFormData({ ...formData, modbusAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Initial Fuel Level Stock (Liters)
                </label>
                <input
                  type="number"
                  value={formData.currentLitres}
                  onChange={(e) => setFormData({ ...formData, currentLitres: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Baseline Fuel Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.initialTempCelsius}
                  onChange={(e) => setFormData({ ...formData, initialTempCelsius: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.tempCompensationEnabled}
                  onChange={(e) => setFormData({ ...formData, tempCompensationEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="text-xs font-bold text-purple-950 block">
                    Automatic Temperature Volume Compensation (ASTM Table 54B / 15°C Normalized)
                  </span>
                  <span className="text-[11px] text-purple-700 block mt-0.5">
                    Compensates thermal fuel expansion/contraction for precision custody transfer reconciliation.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Card 3: Safety Floors & Overfill Alarms */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Overfill Prevention Alarms & Safety Interlocks
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    NFPA 30 high-level horn thresholds, road tanker shutoff interlocks and water alarms.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  High-Level Overfill Warning ({formData.highLevelAlarmPct}%)
                </label>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="font-mono font-black text-rose-700 text-sm block">
                    {highLevelAlarmLiters.toLocaleString()} L
                  </span>
                  <span className="text-[10px] text-rose-600 block mt-0.5">
                    Triggers forecourt optical strobe & 110dB audible warning horn.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Low Stock Reorder Trigger
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.reorderThresholdLitres}
                    onChange={(e) => setFormData({ ...formData, reorderThresholdLitres: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-amber-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Automatically generates wholesale bulk purchase order requisition.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoShutoffInterlock}
                  onChange={(e) => setFormData({ ...formData, autoShutoffInterlock: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-blue-950 block">
                    Automated Solenoid Offload Valve Closure at 95% Safe Working Limit
                  </span>
                  <span className="text-[11px] text-blue-700 block mt-0.5">
                    Interlocks road tanker offload bay to prevent catastrophic forecourt environmental spills.
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
                  Live Asset Preview
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {formData.name}
                </h3>
                <span className="text-[11px] text-gray-400 block truncate">
                  {formData.productGradeName}
                </span>
              </div>
            </div>

            {/* 3D Horizontal Cylindrical Tank Graphic */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
              <div className="relative w-48 h-24 flex items-center justify-center">
                <svg className="w-full h-full drop-shadow-md" viewBox="0 0 140 70" fill="none">
                  <rect x="25" y="52" width="12" height="12" rx="2" fill="#64748b" />
                  <rect x="103" y="52" width="12" height="12" rx="2" fill="#64748b" />
                  <rect x="15" y="10" width="110" height="45" rx="22.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="62" y="5" width="16" height="6" rx="2" fill="#64748b" />
                  <rect
                    x="20"
                    y={50 - (35 * fillPct) / 100}
                    width="100"
                    height={(35 * fillPct) / 100}
                    rx="10"
                    fill={formData.product === 'Petrol' ? '#2563eb' : formData.product === 'Diesel' ? '#10b981' : '#f59e0b'}
                    opacity="0.85"
                  />
                </svg>
                <span className="absolute text-xs font-black text-gray-700 bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {fillPct}% Full
                </span>
              </div>

              <div className="w-full mt-3 pt-3 border-t border-slate-200/70 flex justify-between text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block font-bold">Current Stock</span>
                  <span className="font-black text-gray-900 text-sm">
                    {formData.currentLitres.toLocaleString()} L
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] block font-bold">Gross Capacity</span>
                  <span className="font-bold text-gray-700 text-xs">
                    {formData.capacityLitres.toLocaleString()} L
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Commissioning Readiness Audit
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSpecComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isSpecComplete ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isSpecComplete ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Tank Geometry & UL Code
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isAtgComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isAtgComplete ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isAtgComplete ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    ATG Magnetostrictive Probe
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSafetyComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isSafetyComplete ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                  </div>
                  <span className={isSafetyComplete ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Overfill Alarm & Interlocks
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                form={formId}
                disabled={isSubmitting || !isReady}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Commission & Interlock Tank</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
