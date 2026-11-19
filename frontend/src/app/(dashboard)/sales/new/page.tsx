'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Receipt,
  Save,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  DollarSign,
  Gauge,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Printer,
  ShieldCheck,
  User,
  Car,
  Clock,
  Sparkles,
} from 'lucide-react';

const PRODUCTS = [
  { id: 'PMS', name: 'Petrol Unleaded 95', rate: 2.15, color: 'text-amber-600' },
  { id: 'AGO', name: 'Low Sulfur Diesel (AGO 50ppm)', rate: 2.05, color: 'text-blue-600' },
  { id: 'KER', name: 'Illuminating Kerosene', rate: 1.85, color: 'text-purple-600' },
];

export default function NewSalePage() {
  const router = useRouter();

  // Transaction identity
  const [receiptNumber, setReceiptNumber] = useState(`REC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [cashierName, setCashierName] = useState('Sarah Jenkins (Cashier #04)');
  const [pumpId, setPumpId] = useState('Pump 01');
  const [islandId, setIslandId] = useState('Island A');
  const [nozzleId, setNozzleId] = useState('NZ-01 (Petrol Unleaded 95)');

  // Product & Volume
  const [selectedProductId, setSelectedProductId] = useState('PMS');
  const [volumeLiters, setVolumeLiters] = useState('35.00');
  const [meterStart, setMeterStart] = useState('184520.10');
  
  // Payment Tender & Customer
  const [tenderMethod, setTenderMethod] = useState<'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CREDIT'>('CASH');
  const [customerType, setCustomerType] = useState<'WALK_IN' | 'FLEET'>('WALK_IN');
  const [customerName, setCustomerName] = useState('Walk-in Retail Forecourt');
  const [vehiclePlate, setVehiclePlate] = useState('SO-MOG-8821');
  const [driverPin, setDriverPin] = useState('');
  const [odometerKm, setOdometerKm] = useState('142850');

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const unitRate = selectedProduct.rate;
  const numLiters = parseFloat(volumeLiters) || 0;
  const grossTotal = numLiters * unitRate;
  const numMeterStart = parseFloat(meterStart) || 0;
  const calculatedMeterEnd = numMeterStart + numLiters;

  const handlePresetVolume = (liters: number) => {
    setVolumeLiters(liters.toFixed(2));
  };

  const handlePresetAmount = (amountDollars: number) => {
    const calcLiters = amountDollars / unitRate;
    setVolumeLiters(calcLiters.toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/sales');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/sales" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Forecourt Sales & Transactions
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Manual POS Dispatch & Sale Entry</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-blue-600" />
            Forecourt POS Manual Dispatch & Transaction Record
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Record manual forecourt fuel dispatch, corporate fleet card authorization, and tender settlement reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sales"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Complete & Print Receipt</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Dispenser & Nozzle Assignment */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Forecourt Island & Hardware Channel</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Physical dispenser pump, nozzle position, and operating attendant.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Receipt Voucher #</label>
                <input
                  type="text"
                  required
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Assigned Cashier / Attendant</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Forecourt Fuel Island</label>
                <select
                  value={islandId}
                  onChange={(e) => setIslandId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Island A">Island A (Lanes 1 & 2)</option>
                  <option value="Island B">Island B (Lanes 3 & 4)</option>
                  <option value="Island C">Island C (Lanes 5 & 6)</option>
                  <option value="Island D">Island D (HGV Truck Lane)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Electronic Dispenser (Pump)</label>
                <select
                  value={pumpId}
                  onChange={(e) => setPumpId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Pump 01">Pump 01 - Wayne Helix Dual</option>
                  <option value="Pump 02">Pump 02 - Wayne Helix Dual</option>
                  <option value="Pump 03">Pump 03 - Gilbarco Encore 700 S</option>
                  <option value="Pump 04">Pump 04 - Gilbarco Encore 700 S</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Active Hose / Nozzle Channel</label>
                <select
                  value={nozzleId}
                  onChange={(e) => setNozzleId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="NZ-01 (Petrol Unleaded 95)">NZ-01 — Petrol Unleaded 95 (Green Boot)</option>
                  <option value="NZ-02 (Low Sulfur Diesel)">NZ-02 — Low Sulfur Diesel 50ppm (Black Boot)</option>
                  <option value="NZ-03 (Illuminating Kerosene)">NZ-03 — Illuminating Kerosene (Blue Boot)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Product Grade, Liters & Totalizer Calibration */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Fuel Product Grade & Volume Dispensation</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Live price calculation, quick preset buttons, and electronic pump totalizers.
                </p>
              </div>
            </div>

            {/* Fuel Product Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRODUCTS.map((prod) => {
                const isSelected = selectedProductId === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-black text-blue-700">{prod.id}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          ${prod.rate.toFixed(2)} / L
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-900">{prod.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume Input & Presets */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Dispensed Volume (Liters)</label>
                  <div className="relative">
                    <Fuel className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={volumeLiters}
                      onChange={(e) => setVolumeLiters(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 bg-white rounded-xl font-mono font-black text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Unit Rate ($ / Liter)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      disabled
                      value={`$${unitRate.toFixed(2)}`}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 bg-gray-100/70 rounded-xl font-mono font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Gross Payable ($ USD)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      disabled
                      value={`$${grossTotal.toFixed(2)}`}
                      className="w-full pl-9 pr-3 py-2 border border-emerald-300 bg-emerald-50 rounded-xl font-mono font-black text-emerald-700 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-200/60">
                <span className="text-[11px] font-bold text-gray-500">Quick Volume Presets:</span>
                {[10, 20, 35, 50, 75, 100].map((liters) => (
                  <button
                    key={liters}
                    type="button"
                    onClick={() => handlePresetVolume(liters)}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    {liters} L
                  </button>
                ))}
                <span className="text-gray-300">|</span>
                {[20, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePresetAmount(amt)}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white border border-gray-200 rounded-lg hover:border-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Totalizer Meters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Dispenser Start Totalizer</label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={meterStart}
                    onChange={(e) => setMeterStart(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Dispenser End Totalizer (Calculated)</label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    disabled
                    value={calculatedMeterEnd.toFixed(2)}
                    className="w-full pl-9 pr-3 py-2 border border-blue-200 bg-blue-50/50 rounded-xl font-mono font-bold text-blue-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Tender Settlement & Vehicle Audit */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Payment Tender Settlement & Vehicle Audit</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Select tender method, vehicle registration plate, and fleet account verification.
                </p>
              </div>
            </div>

            {/* Tender Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: 'CASH', label: 'Cash Tender', icon: Banknote },
                { key: 'CARD', label: 'POS Debit/Credit', icon: CreditCard },
                { key: 'MOBILE_MONEY', label: 'Mobile Money (EVC/Zaad)', icon: Smartphone },
                { key: 'CREDIT', label: 'Fleet Credit A/C', icon: Building2 },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = tenderMethod === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setTenderMethod(t.key as any);
                      if (t.key === 'CREDIT') {
                        setCustomerType('FLEET');
                        setCustomerName('Somali Express Logistics Ltd');
                      } else {
                        setCustomerType('WALK_IN');
                        setCustomerName('Walk-in Retail Forecourt');
                      }
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Customer / Fleet Account Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Vehicle Registration Plate</label>
                <div className="relative">
                  <Car className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {tenderMethod === 'CREDIT' && (
                <>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Driver Fleet Keypad PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={driverPin}
                      onChange={(e) => setDriverPin(e.target.value)}
                      placeholder="****"
                      className="w-full px-3 py-2 border border-purple-200 bg-purple-50 rounded-xl font-mono text-center font-bold text-purple-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Vehicle Odometer Reading (km)</label>
                    <input
                      type="number"
                      value={odometerKm}
                      onChange={(e) => setOdometerKm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-800"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Thermal Receipt Slip Preview */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Simulated 58mm / 80mm Thermal Paper Slip */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-blue-600" />
                ESC/POS Thermal Slip
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                READY TO PRINT
              </span>
            </div>

            {/* Thermal Receipt Paper Card */}
            <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 font-mono text-gray-800 space-y-3 text-[11px] shadow-xs relative">
              <div className="text-center space-y-0.5 border-b border-dashed border-gray-300 pb-2">
                <div className="font-black text-sm tracking-widest text-gray-900">FUELPRO FORECOURT</div>
                <div className="text-[10px] text-gray-500">KM4 Roundabout Station • Mogadishu</div>
                <div className="text-[10px] text-gray-500">Tel: +252 61 555-1111 • VAT # 104-982</div>
              </div>

              <div className="space-y-1 text-[10px] text-gray-600 border-b border-dashed border-gray-300 pb-2">
                <div className="flex justify-between">
                  <span>RECEIPT:</span>
                  <span className="font-bold text-gray-900">{receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>CASHIER:</span>
                  <span className="truncate">{cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>DISPENSER:</span>
                  <span>{pumpId} / {nozzleId.substring(0, 5)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 py-1 border-b border-dashed border-gray-300 pb-2">
                <div className="font-bold text-gray-900">{selectedProduct.name}</div>
                <div className="flex justify-between text-gray-700">
                  <span>{numLiters.toFixed(2)} L @ ${unitRate.toFixed(2)}/L</span>
                  <span className="font-black text-gray-900">${grossTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="space-y-1 pt-1 border-b border-dashed border-gray-300 pb-2">
                <div className="flex justify-between text-xs font-black text-gray-900">
                  <span>TOTAL PAYABLE:</span>
                  <span className="text-base text-blue-700">${grossTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>TENDER METHOD:</span>
                  <span className="font-bold">{tenderMethod}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>VEHICLE PLATE:</span>
                  <span className="font-bold">{vehiclePlate}</span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="pt-2 text-center space-y-1">
                <div className="h-8 bg-gray-900/10 rounded flex items-center justify-center font-mono text-[9px] tracking-widest text-gray-500">
                  ||| | |||| | ||| |||| | || ||| |||| |
                </div>
                <div className="text-[9px] text-gray-400">Thank you for fueling with FuelPro!</div>
              </div>
            </div>
          </div>

          {/* Anti-Fraud Audit Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Forecourt Audit & Anti-Fraud Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Dispenser unit and nozzle mapped', valid: !!pumpId && !!nozzleId },
                { label: 'Volume verified against totalizer start', valid: numLiters > 0 && numMeterStart > 0 },
                { label: 'Product rate locked from master price totem', valid: unitRate > 0 },
                { label: 'Vehicle registration plate recorded', valid: vehiclePlate.length >= 4 },
                { label: 'Tender payment method selected', valid: !!tenderMethod },
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
