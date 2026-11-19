'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Gauge,
  Save,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Fuel,
  ShieldCheck,
  Scale,
  Sparkles,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';

const PUMPS = [
  { code: 'PUMP-01', name: 'Forecourt Pump 1 (Gilbarco Advantage Dual)' },
  { code: 'PUMP-02', name: 'Forecourt Pump 2 (Gilbarco Advantage Dual)' },
  { code: 'PUMP-03', name: 'Forecourt Pump 3 (Wayne Helix Multi-Grade)' },
  { code: 'PUMP-04', name: 'Forecourt Pump 4 (Wayne Helix Multi-Grade)' },
  { code: 'PUMP-05', name: 'HGV Satellite Mast (Tokheim High-Speed 120LPM)' },
];

const PRODUCTS = [
  { id: 'Petrol', name: 'Petrol Super 95', color: 'bg-emerald-500', boot: 'Green' },
  { id: 'Diesel', name: 'Diesel (AGO 50ppm ULSD)', color: 'bg-gray-800', boot: 'Black' },
  { id: 'Kerosene', name: 'Illuminating Kerosene', color: 'bg-blue-600', boot: 'Blue' },
];

export default function NewNozzlePage() {
  const router = useRouter();

  // Nozzle identity
  const [pumpCode, setPumpCode] = useState('PUMP-01');
  const [nozzleNumber, setNozzleNumber] = useState('1');
  const [fuelProduct, setFuelProduct] = useState<'Petrol' | 'Diesel' | 'Kerosene'>('Petrol');
  const [customLabel, setCustomLabel] = useState('Nozzle 1-A (Petrol Super 95)');

  // Weights & Measures Calibration
  const [totalizerReading, setTotalizerReading] = useState('152400.00');
  const [mechanicalTotalizer, setMechanicalTotalizer] = useState('152400');
  const [flowRateLpm, setFlowRateLpm] = useState('38.5');
  const [wmSealId, setWmSealId] = useState('W&M-SEAL-2026-9812');
  const [calibrationDate, setCalibrationDate] = useState(new Date().toISOString().split('T')[0]);

  // Safety & Hardware
  const [breakawayModel, setBreakawayModel] = useState('OPW 66V Reconnectable Breakaway 3/4"');
  const [maxCutoffLiters, setMaxCutoffLiters] = useState('200');
  const [status, setStatus] = useState<'ACTIVE' | 'MAINTENANCE'>('ACTIVE');

  const selectedPump = PUMPS.find((p) => p.code === pumpCode) || PUMPS[0];
  const selectedProd = PRODUCTS.find((p) => p.id === fuelProduct) || PRODUCTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/nozzles');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/nozzles" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Dispenser Nozzles & Totalizers
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Commission Dispenser Nozzle Channel</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <Gauge className="w-6 h-6 text-blue-600" />
            Dispenser Hydraulic Channel & Weights & Measures Calibration
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Commission forecourt dispenser nozzle channels, log official electronic totalizers, and register Weights & Measures verification seals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/nozzles"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Commission Nozzle Channel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Dispenser & Nozzle Identity */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Physical Dispenser & Hydraulic Nozzle Channel</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Select parent dispenser unit, hydraulic channel slot, and dedicated fuel product.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Parent Dispenser Pump Unit</label>
                <select
                  value={pumpCode}
                  onChange={(e) => {
                    setPumpCode(e.target.value);
                    setCustomLabel(`Nozzle ${e.target.value.replace('PUMP-', '')}-A (${selectedProd.name})`);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {PUMPS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Hydraulic Channel Index</label>
                <select
                  value={nozzleNumber}
                  onChange={(e) => setNozzleNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="1">Channel 1 (Side A - Inner)</option>
                  <option value="2">Channel 2 (Side A - Outer)</option>
                  <option value="3">Channel 3 (Side B - Inner)</option>
                  <option value="4">Channel 4 (Side B - Outer)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Dedicated Fuel Grade</label>
                <select
                  value={fuelProduct}
                  onChange={(e) => {
                    const prod = e.target.value as any;
                    setFuelProduct(prod);
                    const pObj = PRODUCTS.find((x) => x.id === prod);
                    if (pObj) {
                      setCustomLabel(`Nozzle ${pumpCode.replace('PUMP-', '')}-A (${pObj.name})`);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.boot} Boot)
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Nozzle Forecourt Tag / Label</label>
                <input
                  type="text"
                  required
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Weights & Measures Calibration */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Weights & Measures Calibration & Meter Totalizers</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Official lifetime non-resettable electronic totalizer, mechanical register, and lead tamper seal ID.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Electronic Lifetime Totalizer (L)</label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={totalizerReading}
                    onChange={(e) => setTotalizerReading(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mechanical Roller Totalizer (L)</label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    required
                    value={mechanicalTotalizer}
                    onChange={(e) => setMechanicalTotalizer(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Rated Flow Velocity (LPM)</label>
                <div className="relative">
                  <Activity className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={flowRateLpm}
                    onChange={(e) => setFlowRateLpm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Weights & Measures Lead Seal #</label>
                <div className="relative">
                  <Scale className="w-4 h-4 text-amber-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={wmSealId}
                    onChange={(e) => setWmSealId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Latest Calibration Date</label>
                <input
                  type="date"
                  required
                  value={calibrationDate}
                  onChange={(e) => setCalibrationDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Commissioning Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ACTIVE">ACTIVE — Certified for Forecourt Sale</option>
                  <option value="MAINTENANCE">MAINTENANCE — Tagged Out (LOTO)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Breakaway Valve & Safety Submersible Relays */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Emergency Shear Coupling & Safety Interlocks</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  NFPA safety reconnectable breakaway valve, hose anti-whip retractor, and preset maximum cutoffs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Emergency Breakaway Valve Spec</label>
                <input
                  type="text"
                  required
                  value={breakawayModel}
                  onChange={(e) => setBreakawayModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Max Auto-Cutoff Dispense Limit (Liters)</label>
                <input
                  type="number"
                  required
                  value={maxCutoffLiters}
                  onChange={(e) => setMaxCutoffLiters(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-800"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Nozzle Cradle Simulator */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Virtual Nozzle Cradle Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-600" />
                Nozzle Cradle Simulator
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {status}
              </span>
            </div>

            {/* Cradle Graphical Simulation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 text-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-white/20 font-mono text-xs font-bold text-blue-200">
                  {pumpCode} • CH #{nozzleNumber}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {flowRateLpm} LPM RATED
                </span>
              </div>

              <div>
                <div className="text-sm font-black text-white">{customLabel}</div>
                <div className="text-xs text-blue-300 mt-0.5 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5" />
                  <span>{fuelProduct} ({selectedProd.boot} Scuff Boot)</span>
                </div>
              </div>

              {/* Digital LCD Dispenser Display */}
              <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-center font-mono">
                <div className="text-[9px] uppercase text-gray-400 tracking-wider">LIFETIME ELECTRONIC TOTALIZER</div>
                <div className="text-xl font-black text-emerald-400 tracking-widest mt-0.5">
                  {parseFloat(totalizerReading || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })} L
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-gray-400 font-mono">
                <span>W&M Seal:</span>
                <span className="text-white font-bold">{wmSealId}</span>
              </div>
            </div>
          </div>

          {/* Weights & Measures Calibration Readiness Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Weights & Measures Compliance Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Parent dispenser pump unit assigned', valid: !!pumpCode },
                { label: 'Electronic lifetime totalizer recorded', valid: parseFloat(totalizerReading) > 0 },
                { label: 'Mechanical drum counter synchronized', valid: parseFloat(mechanicalTotalizer) > 0 },
                { label: 'Flow velocity within forecourt limits (30-120 LPM)', valid: parseFloat(flowRateLpm) >= 20 },
                { label: 'Official W&M lead calibration seal registered', valid: wmSealId.length >= 6 },
                { label: 'NFPA breakaway valve installed', valid: breakawayModel.length > 5 },
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
