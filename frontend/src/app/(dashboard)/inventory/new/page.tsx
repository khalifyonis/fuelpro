'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Save,
  CheckCircle2,
  AlertTriangle,
  Cylinder,
  Scale,
  Gauge,
  Thermometer,
  Droplet,
  Fuel,
  ShieldCheck,
  User,
  Calendar,
  Sparkles,
  ArrowRightLeft,
  Activity,
} from 'lucide-react';

const TANKS = [
  { id: 'UST-01', name: 'UST-01 — Petrol Unleaded 95 (45,000L)', product: 'Petrol', capacity: 45000, bookStock: 29750 },
  { id: 'UST-02', name: 'UST-02 — Low Sulfur Diesel AGO (45,000L)', product: 'Diesel', capacity: 45000, bookStock: 28800 },
  { id: 'UST-03', name: 'UST-03 — Premium V-Power 98 (30,000L)', product: 'Petrol', capacity: 30000, bookStock: 18450 },
  { id: 'UST-04', name: 'UST-04 — Illuminating Kerosene (20,000L)', product: 'Kerosene', capacity: 20000, bookStock: 12100 },
];

export default function NewInventoryAdjustmentPage() {
  const router = useRouter();

  // Tank selection
  const [selectedTankId, setSelectedTankId] = useState('UST-01');
  const [reconciliationDate, setReconciliationDate] = useState(new Date().toISOString().split('T')[0]);
  const [officerName, setOfficerName] = useState('Farhan Ali (Wet Stock Specialist)');
  const [method, setMethod] = useState<'ATG_PROBE' | 'MANUAL_DIP'>('ATG_PROBE');

  // Mass-Balance Fields
  const activeTank = TANKS.find((t) => t.id === selectedTankId) || TANKS[0];
  const [openingStock, setOpeningStock] = useState(activeTank.bookStock.toString());
  const [deliveriesIn, setDeliveriesIn] = useState('0');
  const [dispenserSales, setDispenserSales] = useState('4250.50');
  const [physicalDip, setPhysicalDip] = useState((activeTank.bookStock - 4250.5 - 12.0).toFixed(1));

  // Environmental and water
  const [waterBottomMm, setWaterBottomMm] = useState('12');
  const [fuelTempC, setFuelTempC] = useState('24.2');
  const [fuelDensity, setFuelDensity] = useState('0.742');
  const [varianceReason, setVarianceReason] = useState('NORMAL_THERMAL');
  const [notes, setNotes] = useState('Daily shift mass-balance reconciliation. ATG probe reading confirmed with manual brass dip stick.');

  // Mass-balance calculations
  const numOpening = parseFloat(openingStock) || 0;
  const numDeliveries = parseFloat(deliveriesIn) || 0;
  const numSales = parseFloat(dispenserSales) || 0;
  const expectedBook = numOpening + numDeliveries - numSales;
  const numPhysical = parseFloat(physicalDip) || 0;
  const varianceLiters = numPhysical - expectedBook;
  const variancePct = expectedBook > 0 ? (varianceLiters / expectedBook) * 100 : 0;
  const isLoss = varianceLiters < 0;
  const isWithinTolerance = Math.abs(variancePct) <= 0.25;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/inventory');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/inventory" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Wet Stock Inventory
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Mass-Balance & Physical Dip Reconciliation</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-blue-600" />
            Wet Stock Mass-Balance Reconciliation & Physical Dip
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Daily EPA/ASTM forecourt mass-balance reconciliation (Opening + Deliveries - Meter Sales vs Physical ATG Dip Probe).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Commit Reconciliation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Tank & Audit Header */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Underground Tank & Physical Audit Method</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Select underground storage tank (UST) and dip measurement methodology.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Target Underground Storage Tank</label>
                <div className="relative">
                  <Cylinder className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                  <select
                    value={selectedTankId}
                    onChange={(e) => {
                      setSelectedTankId(e.target.value);
                      const t = TANKS.find((x) => x.id === e.target.value);
                      if (t) {
                        setOpeningStock(t.bookStock.toString());
                        setPhysicalDip((t.bookStock - 4250.5 - 12.0).toFixed(1));
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {TANKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Reconciliation Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={reconciliationDate}
                    onChange={(e) => setReconciliationDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Inventory Officer</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Measurement Capture Source</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('ATG_PROBE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      method === 'ATG_PROBE'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Veeder-Root TLS-450PLUS Probe (Automated)
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('MANUAL_DIP')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      method === 'MANUAL_DIP'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Manual Calibrated Brass Dip Stick (Dual Sign-off)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Mass-Balance Equation */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Continuous Mass-Balance Volumetric Equation</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Opening Book + Tanker Deliveries - Dispenser Meter Sales = Expected Book Stock.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Opening Book Stock</span>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={openingStock}
                  onChange={(e) => setOpeningStock(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 bg-white rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[10px] text-gray-400">Previous shift closing</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700">(+) Deliveries In</span>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={deliveriesIn}
                  onChange={(e) => setDeliveriesIn(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-emerald-300 bg-white rounded-xl font-mono font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-[10px] text-emerald-600">Road tanker BOL intake</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-700">(-) Meter Sales Out</span>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={dispenserSales}
                  onChange={(e) => setDispenserSales(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-blue-300 bg-white rounded-xl font-mono font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[10px] text-blue-600">Dispenser totalizers</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-900 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">(=) Expected Book</span>
                <div className="font-mono font-black text-lg text-emerald-400 pt-1">
                  {expectedBook.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L
                </div>
                <span className="text-[10px] text-gray-400">Theoretical balance</span>
              </div>
            </div>

            {/* Physical Actual Dip */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Physical Measured Tank Dip (Probe / Gauge)
                </span>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                  Active ATG Feed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Physical Wet Stock Volume (Liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={physicalDip}
                    onChange={(e) => setPhysicalDip(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 bg-white rounded-xl font-mono font-black text-purple-900 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Water Bottom (mm)</label>
                  <div className="relative">
                    <Droplet className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      required
                      value={waterBottomMm}
                      onChange={(e) => setWaterBottomMm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-purple-200 bg-white rounded-xl font-mono text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Fuel Temperature (°C)</label>
                  <div className="relative">
                    <Thermometer className="w-4 h-4 text-amber-500 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={fuelTempC}
                      onChange={(e) => setFuelTempC(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-purple-200 bg-white rounded-xl font-mono text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Loss/Gain Narrative & Justification */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Forecourt Loss / Gain Classification & Root Cause</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Document variance cause according to international forecourt inventory standards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Variance Cause Classification</label>
                <select
                  value={varianceReason}
                  onChange={(e) => setVarianceReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="NORMAL_THERMAL">Normal Thermal Expansion / Contraction</option>
                  <option value="EVAPORATION">Atmospheric Breathing & Vent Evaporation</option>
                  <option value="METER_DRIFT">Dispenser Flowmeter Calibration Drift</option>
                  <option value="LINE_LEAK">Secondary Containment Pipe Leak (Alert Hazmat)</option>
                  <option value="DELIVERY_SHORTAGE">Delivery Offload Shortage / BOL Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Laboratory Density (kg/m³)</label>
                <input
                  type="text"
                  value={fuelDensity}
                  onChange={(e) => setFuelDensity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Reconciliation Notes & Investigation Narrative</label>
                <textarea
                  rows={2}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Mass-Balance Preview & Compliance Checklist */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Variance Cockpit Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-600" />
                Variance Cockpit
              </span>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  isWithinTolerance
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800 animate-pulse'
                }`}
              >
                {isWithinTolerance ? 'WITHIN TOLERANCE' : 'EXCESSIVE VARIANCE'}
              </span>
            </div>

            {/* Net Variance Meter */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Net Volumetric Variance</div>
              <div
                className={`text-2xl font-black font-mono ${
                  varianceLiters >= 0 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {varianceLiters > 0 ? `+${varianceLiters.toFixed(1)}` : varianceLiters.toFixed(1)} L
              </div>
              <div className="text-xs font-bold text-gray-600">
                Variance Percentage: <span className="font-mono">{variancePct.toFixed(3)}%</span>
              </div>
              <div className="text-[10px] text-gray-400">EPA Standard Tolerance: ±0.25%</div>
            </div>

            {/* Tank Liquid Fill Simulation */}
            <div className="p-4 rounded-2xl bg-gray-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-300">{activeTank.name.substring(0, 16)}</span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  {((numPhysical / activeTank.capacity) * 100).toFixed(1)}% Full
                </span>
              </div>

              {/* Progress bar representing tank */}
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden p-0.5 border border-gray-700">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, (numPhysical / activeTank.capacity) * 100))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 pt-1 font-mono">
                <span>Water Bottom: {waterBottomMm} mm</span>
                <span>Temp: {fuelTempC}°C</span>
              </div>
            </div>
          </div>

          {/* EPA Loss/Gain Readiness Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Wet Stock Regulatory Compliance Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Underground tank selected from active roster', valid: !!selectedTankId },
                { label: 'Opening book stock loaded from previous closing', valid: numOpening > 0 },
                { label: 'Dispenser totalizer sales verified', valid: numSales >= 0 },
                { label: 'Physical dip recorded from calibrated probe', valid: numPhysical > 0 },
                { label: 'Water bottom within safe floor (< 25 mm)', valid: parseInt(waterBottomMm) < 25 },
                { label: 'Variance within allowable threshold (±0.25%)', valid: isWithinTolerance },
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
