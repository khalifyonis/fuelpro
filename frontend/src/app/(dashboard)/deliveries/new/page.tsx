'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Droplet,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Fuel,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewDeliveryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  const [formData, setFormData] = useState({
    waybillNumber: 'BOL-2026-99120',
    supplier: 'Hass Petroleum Supply Ltd',
    depotTerminal: 'Mogadishu Port Terminal Terminal 2',
    product: 'Petrol' as 'Petrol' | 'Diesel' | 'Kerosene',
    targetTankCode: 'UST-01 (Main Forecourt Petrol)',
    invoiceQuantityLiters: 10000,
    truckNumber: 'TRK-9814-SO',
    haulierCompany: 'Express Tanker Haulage Ltd',
    driverName: 'Robert Vance',
    driverPhone: '+252 61 884-2211',
    sealNumberTop: 'SEAL-HATCH-8821',
    sealNumberBottom: 'SEAL-MANIFOLD-8822',
    densityObserved: 0.745,
    temperatureCelsius: 24.8,
    waterBottomTest: 'Zero Water Cut (Pass)',
    preOffloadDipMm: 1420,
    postOffloadExpectedMm: 2420,
    receivingInspector: 'Farhan Ali (Inventory Officer)',
    notes: 'Bulk road tanker offload into UST-01. Flame arrestors inspected.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBolValid = formData.waybillNumber.trim().length > 3;
  const isTruckValid = formData.truckNumber.trim().length > 3;
  const isQtyValid = formData.invoiceQuantityLiters >= 1000;
  const isReady = isBolValid && isTruckValid && isQtyValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Road Tanker Offload Authorized',
        description: `Delivery ${formData.waybillNumber} (${formData.invoiceQuantityLiters.toLocaleString()} L) recorded. Stock updated.`,
        type: 'success',
      });
      router.push('/deliveries');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/deliveries" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wet Stock Road Tanker Deliveries</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">Log Tanker Delivery</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Log Bulk Road Tanker Delivery & Offload
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  NFPA 385 Flammable Liquids Tanker Bay
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Verify bill of lading, top/bottom security seals, fuel density hydrometer tests, and physical pre/post dip reconciliation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/deliveries"
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
                  <span>Authorize Offload & Update Stock</span>
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
          {/* Card 1: Bill of Lading & Refinery Supplier */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Bill of Lading & Terminal Refinery Manifest
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Terminal consignment documentation and destination tank assignment.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bill of Lading / Waybill # *
                </label>
                <input
                  type="text"
                  required
                  value={formData.waybillNumber}
                  onChange={(e) => setFormData({ ...formData, waybillNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Fuel Product Grade *
                </label>
                <select
                  value={formData.product}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product: e.target.value as 'Petrol' | 'Diesel' | 'Kerosene',
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="Petrol">Super Unleaded Petrol 95 RON</option>
                  <option value="Diesel">Ultra-Low Sulfur Heavy Diesel</option>
                  <option value="Kerosene">Domestic & Aviation Kerosene</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Destination Storage Tank *
                </label>
                <select
                  value={formData.targetTankCode}
                  onChange={(e) => setFormData({ ...formData, targetTankCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="UST-01 (Main Forecourt Petrol)">UST-01 (Main Forecourt Petrol - 35k L)</option>
                  <option value="UST-02 (Heavy Transport Diesel)">UST-02 (Heavy Transport Diesel - 40k L)</option>
                  <option value="UST-03 (Heating Kerosene)">UST-03 (Heating Kerosene - 15k L)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Wholesale Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Invoiced Quantity (Liters) *
                </label>
                <input
                  type="number"
                  required
                  step="500"
                  value={formData.invoiceQuantityLiters}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceQuantityLiters: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Road Tanker Vehicle & Security Seals */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Road Tanker Logistics & Physical Security Seals
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Inspection of top manhole dome seals and bottom discharge manifold locks.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Tamper-Evident Seals
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tanker Plate Registration *
                </label>
                <input
                  type="text"
                  required
                  value={formData.truckNumber}
                  onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Haulier Carrier Company
                </label>
                <input
                  type="text"
                  value={formData.haulierCompany}
                  onChange={(e) => setFormData({ ...formData, haulierCompany: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Driver Full Name
                </label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Top Manhole Hatch Seal Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sealNumberTop}
                  onChange={(e) => setFormData({ ...formData, sealNumberTop: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bottom Discharge Valve Seal Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sealNumberBottom}
                  onChange={(e) => setFormData({ ...formData, sealNumberBottom: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-purple-700"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Quality Control & Density */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Quality Assurance, Hydrometer Density & Thermal Dips
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Physical pre-offload chemical paste and hydrometer testing.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Observed Density (g/cm³)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.densityObserved}
                  onChange={(e) =>
                    setFormData({ ...formData, densityObserved: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperatureCelsius}
                  onChange={(e) =>
                    setFormData({ ...formData, temperatureCelsius: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Water Finding Paste Result
                </label>
                <input
                  type="text"
                  value={formData.waterBottomTest}
                  onChange={(e) => setFormData({ ...formData, waterBottomTest: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-emerald-700"
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
                BOL
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">
                  Offload Bay Preview
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">{formData.waybillNumber}</h3>
                <span className="text-[11px] text-gray-400 block truncate">{formData.truckNumber}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Invoiced Volume:</span>
                <span className="font-black text-gray-900 font-mono">
                  {formData.invoiceQuantityLiters.toLocaleString()} L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Product Grade:</span>
                <span className="font-bold text-blue-700">{formData.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Destination:</span>
                <span className="font-bold text-gray-800">{formData.targetTankCode.split(' ')[0]}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Offload Quality Clearance
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isBolValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isBolValid ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isBolValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Bill of Lading Matched
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isTruckValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isTruckValid ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isTruckValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Security Seals Verified
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isQtyValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isQtyValid ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                  </div>
                  <span className={isQtyValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Density Hydrometer Approved
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
              <span>Authorize Offload & Update Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
