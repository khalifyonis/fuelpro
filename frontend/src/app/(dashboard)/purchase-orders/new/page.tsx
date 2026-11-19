'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingCart,
  Save,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Fuel,
  DollarSign,
  Truck,
  Cylinder,
  Calendar,
  ShieldCheck,
  Sparkles,
  FileText,
  User,
} from 'lucide-react';

const SUPPLIERS = [
  { id: 'SUP-TE', name: 'TotalEnergies Global Supply', depot: 'Port Logistics Terminal, Berth 4' },
  { id: 'SUP-SH', name: 'Shell Commercial Distribution', depot: 'Refinery Highway, Sector 9' },
  { id: 'SUP-HASS', name: 'Hass Petroleum Distribution', depot: 'Coastal Marine Terminal, Berth 2' },
  { id: 'SUP-MMB', name: 'Mogadishu Marine Bunkering Ltd', depot: 'Deepwater Fuel Jetty' },
];

const PRODUCTS = [
  { id: 'Petrol', name: 'Petrol Unleaded 95', defaultPrice: 1.15, defaultTank: 'TK-01 (Main Petrol)' },
  { id: 'Diesel', name: 'Low Sulfur Diesel (AGO 50ppm)', defaultPrice: 1.12, defaultTank: 'TK-02 (Central Diesel)' },
  { id: 'Kerosene', name: 'Illuminating Kerosene', defaultPrice: 0.98, defaultTank: 'TK-03 (Bulk Kerosene)' },
];

export default function NewPurchaseOrderPage() {
  const router = useRouter();

  // PO Header
  const [poNumber, setPoNumber] = useState(`PO-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [supplierId, setSupplierId] = useState('SUP-SH');

  // Product and Volume
  const [productType, setProductType] = useState<'Petrol' | 'Diesel' | 'Kerosene'>('Diesel');
  const [quantityLitres, setQuantityLitres] = useState('25000');
  const [pricePerLitre, setPricePerLitre] = useState('1.12');
  const [destinationTank, setDestinationTank] = useState('TK-02 (Central Diesel)');

  // Hauler & Logistics
  const [haulerName, setHaulerName] = useState('Somali Fuel Express Logistics');
  const [truckPlate, setTruckPlate] = useState('TRK-SOM-9921');
  const [driverName, setDriverName] = useState('Guled Abdi Warsame');
  const [driverLicense, setDriverLicense] = useState('HAZ-DRV-7741');
  const [notes, setNotes] = useState('Road tanker delivery dispatched under Veeder-Root electronic custody transfer.');

  const numQty = parseFloat(quantityLitres) || 0;
  const numRate = parseFloat(pricePerLitre) || 0;
  const totalCost = numQty * numRate;

  const activeSupplier = SUPPLIERS.find((s) => s.id === supplierId) || SUPPLIERS[0];

  const handlePresetVolume = (liters: number) => {
    setQuantityLitres(liters.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/purchase-orders');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/purchase-orders" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Purchase Orders & Procurement
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Issue Bulk Fuel Purchase Order</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            Wholesale Bulk Tanker Procurement Requisition
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Issue contractual purchase orders for multi-compartment road tankers, verify destination tank ullage, and lock landed pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/purchase-orders"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Issue Purchase Order</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Requisition Identification & Wholesale Vendor */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Purchase Order Identification & Vendor Contract</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  PO sequence, expected intake delivery date, and contracted terminal supplier.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Purchase Order (PO) #</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Order Requisition Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Expected Bay Arrival Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-blue-200 bg-blue-50/30 rounded-xl font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Contracted Wholesale Supplier</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {SUPPLIERS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.depot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Loading Gantry Depot</label>
                <input
                  type="text"
                  disabled
                  value={activeSupplier.depot}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-gray-600 font-medium truncate"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Fuel Grade, Volume & Destination Tank */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Fuel Grade, Bulk Volume & Landed Financial Valuation</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Select product grade, road tanker volume, and destination underground storage tank.
                </p>
              </div>
            </div>

            {/* Fuel Product Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRODUCTS.map((prod) => {
                const isSelected = productType === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setProductType(prod.id as any);
                      setPricePerLitre(prod.defaultPrice.toString());
                      setDestinationTank(prod.defaultTank);
                    }}
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
                          ${prod.defaultPrice.toFixed(2)} / L
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-900">{prod.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume Input & Road Tanker Presets */}
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Procurement Volume (Liters)</label>
                  <div className="relative">
                    <Fuel className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="500"
                      min="1000"
                      required
                      value={quantityLitres}
                      onChange={(e) => setQuantityLitres(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 bg-white rounded-xl font-mono font-black text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Wholesale Landed Rate ($ / L)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={pricePerLitre}
                      onChange={(e) => setPricePerLitre(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 bg-white rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Total Procurement Cost ($ USD)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      disabled
                      value={`$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      className="w-full pl-9 pr-3 py-2 border border-emerald-300 bg-emerald-50 rounded-xl font-mono font-black text-emerald-700 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Road Tanker Capacity Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-200/60">
                <span className="text-[11px] font-bold text-gray-500">Standard Road Tanker Presets:</span>
                {[
                  { label: 'Single Axle (10,000L)', val: 10000 },
                  { label: 'Double Axle (15,000L)', val: 15000 },
                  { label: 'Triple Axle (25,000L)', val: 25000 },
                  { label: 'Super B-Train (35,000L)', val: 35000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => handlePresetVolume(preset.val)}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination UST Tank */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Destination Underground Tank (UST)</label>
                <div className="relative">
                  <Cylinder className="w-4 h-4 text-purple-600 absolute left-3 top-2.5" />
                  <select
                    value={destinationTank}
                    onChange={(e) => setDestinationTank(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="TK-01 (Main Petrol)">TK-01 — Petrol Unleaded 95 (45,000L Cap)</option>
                    <option value="TK-02 (Central Diesel)">TK-02 — Low Sulfur Diesel AGO (45,000L Cap)</option>
                    <option value="TK-03 (Bulk Kerosene)">TK-03 — Illuminating Kerosene (20,000L Cap)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Destination Offload Bay</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="BAY-01">Bay 1 (High-Speed Camlock Offload Manifold)</option>
                  <option value="BAY-02">Bay 2 (Gravity Offload Sump)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Logistics Hauler & Road Tanker Verification */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Logistics Hauler & Road Tanker Verification</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Truck registration plate, commercial hazmat driver credentials, and requisition instructions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Petroleum Hauler Logistics Partner</label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={haulerName}
                    onChange={(e) => setHaulerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Road Tanker Registration Rig Plate</label>
                <input
                  type="text"
                  required
                  value={truckPlate}
                  onChange={(e) => setTruckPlate(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Authorized Certified Hazmat Driver</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Commercial Hazmat License ID</label>
                <input
                  type="text"
                  required
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Special Offload & Testing Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Tanker Manifest Preview */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Purchase Order Manifest Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                Procurement Manifest
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                PENDING INTAKE
              </span>
            </div>

            {/* Manifest Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-blue-300 px-2 py-0.5 rounded bg-white/10">
                  {poNumber}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  CONFIRMED
                </span>
              </div>

              <div>
                <div className="text-xs text-gray-400">Supplier:</div>
                <div className="font-black text-sm text-white truncate">{activeSupplier.name}</div>
                <div className="text-[11px] text-blue-200 mt-0.5">{destinationTank}</div>
              </div>

              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-gray-400">Order Volume</div>
                  <div className="text-base font-black text-white font-mono">
                    {numQty.toLocaleString()} L
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400">Total Landed ($)</div>
                  <div className="text-base font-black text-emerald-400 font-mono">
                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics info strip */}
            <div className="p-3 bg-gray-50 rounded-2xl text-[11px] text-gray-600 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Hauler Rig:</span>
                <span className="font-bold text-gray-900">{truckPlate}</span>
              </div>
              <div className="flex justify-between">
                <span>Driver:</span>
                <span>{driverName}</span>
              </div>
              <div className="flex justify-between">
                <span>ETA:</span>
                <span className="text-blue-600 font-bold">{expectedDate}</span>
              </div>
            </div>
          </div>

          {/* Underwriting Readiness Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Procurement Underwriting Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'PO requisition sequence generated', valid: poNumber.length >= 6 },
                { label: 'Contracted terminal supplier verified', valid: !!supplierId },
                { label: 'Volume complies with road tanker compartment specs', valid: numQty >= 5000 },
                { label: 'Landed wholesale price locked', valid: numRate > 0 },
                { label: 'Destination tank selected', valid: !!destinationTank },
                { label: 'Hauler registration & driver license recorded', valid: truckPlate.length >= 4 && driverLicense.length >= 4 },
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
