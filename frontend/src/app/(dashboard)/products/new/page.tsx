'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Fuel,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Radio,
  Tag,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formId = useId();

  const [formData, setFormData] = useState({
    code: 'PETROL-98-VPOWER',
    name: 'Super Premium Unleaded Petrol 98 RON',
    category: 'Liquid Fuel (Retail Grade)',
    unit: 'Litre',
    octaneRating: '98 RON',
    densityAt15C: 0.755,
    refineryLandedCost: 1.85,
    portWharfageTariff: 0.05,
    governmentExciseTax: 0.12,
    transportFreight: 0.04,
    sellingPrice: 2.35,
    totemLedColor: 'GREEN',
    totemChannelCode: 'TOTEM-LINE-04',
    effectiveDate: new Date().toISOString().split('T')[0] + ' 00:01 AM',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computations
  const totalCost =
    formData.refineryLandedCost +
    formData.portWharfageTariff +
    formData.governmentExciseTax +
    formData.transportFreight;
  const netMargin = formData.sellingPrice - totalCost;
  const marginPct = totalCost > 0 ? ((netMargin / formData.sellingPrice) * 100).toFixed(1) : '0';

  const isCodeValid = formData.code.trim().length > 3;
  const isNameValid = formData.name.trim().length > 3;
  const isPriceValid = formData.sellingPrice > totalCost;
  const isReady = isCodeValid && isNameValid && isPriceValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Fuel Product Commissioned',
        description: `${formData.name} set at $${formData.sellingPrice.toFixed(2)}/L. Totem pylon updated.`,
        type: 'success',
      });
      router.push('/products');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/products" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Fuel Products & Totem Pricing</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">New Fuel Grade</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-gray-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Fuel className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Commission Fuel Product Grade & Price Scheme
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  Roadside Totem Sync
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Define chemical fuel specification, refinery CIF landed cost breakdown, government tax tariffs, and roadside LED totem pylon broadcasts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/products"
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
                  <span>Authorize & Broadcast Price</span>
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
          {/* Card 1: Product Grade & Chemical Spec */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Product Specification & Chemical Metrology
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Product code, octane rating, and laboratory density at 15°C.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product SKU / Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-600 uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Commercial Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Octane / Cetane Rating
                </label>
                <input
                  type="text"
                  value={formData.octaneRating}
                  onChange={(e) => setFormData({ ...formData, octaneRating: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reference Density at 15°C (g/cm³)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.densityAt15C}
                  onChange={(e) => setFormData({ ...formData, densityAt15C: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Inventory Unit
                </label>
                <input
                  type="text"
                  readOnly
                  value="Litre (L)"
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Refinery Landed Cost & Tax Tariffs */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Refinery Landed Cost & Government Tariff Breakdown
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Itemized cost structure per liter before forecourt retail markup.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Refinery CIF Formula
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Refinery CIF Cost ($/L) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.refineryLandedCost}
                  onChange={(e) =>
                    setFormData({ ...formData, refineryLandedCost: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Port Wharfage ($/L)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.portWharfageTariff}
                  onChange={(e) =>
                    setFormData({ ...formData, portWharfageTariff: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Excise Tax ($/L)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.governmentExciseTax}
                  onChange={(e) =>
                    setFormData({ ...formData, governmentExciseTax: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Haulage Freight ($/L)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.transportFreight}
                  onChange={(e) =>
                    setFormData({ ...formData, transportFreight: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-gray-600">Total Landed Base Cost:</span>
              <span className="font-mono font-black text-gray-900 text-sm">
                ${totalCost.toFixed(2)} / Litre
              </span>
            </div>
          </div>

          {/* Card 3: Retail Price & Totem Pylon Broadcast */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Forecourt Retail Selling Price & Margin Index
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Roadside LED totem price and gross forecourt margin.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Roadside Totem Selling Price ($ USD / Litre) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-lg font-black text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Totem LED Digit Color
                </label>
                <select
                  value={formData.totemLedColor}
                  onChange={(e) => setFormData({ ...formData, totemLedColor: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="GREEN">High-Intensity Emerald Green LED</option>
                  <option value="AMBER">High-Intensity Amber Yellow LED</option>
                  <option value="RED">High-Intensity Crimson Red LED</option>
                  <option value="WHITE">Ultra-Bright White LED</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Right Sticky Preview (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                ${formData.sellingPrice.toFixed(2)}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider">
                  Totem Price Pylon
                </span>
                <h3 className="font-bold text-gray-900 text-sm truncate">{formData.name}</h3>
                <span className="text-[11px] text-gray-400 block truncate">{formData.code}</span>
              </div>
            </div>

            {/* Glowing Digital Totem Digit Simulator */}
            <div className="bg-black rounded-2xl p-4 border-2 border-gray-800 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-1">
                ROADSIDE LED TOTEM DISPLAY
              </span>
              <div className="font-mono text-3xl font-black tracking-widest text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
                ${formData.sellingPrice.toFixed(2)}
              </div>
              <span className="text-[10px] font-mono text-emerald-300/80 mt-1">
                {formData.name.split(' ')[0]} {formData.octaneRating}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Landed Cost:</span>
                <span className="font-mono font-bold text-gray-700">${totalCost.toFixed(2)} / L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Net Forecourt Margin:</span>
                <span className="font-mono font-black text-emerald-700">+${netMargin.toFixed(2)} / L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Gross Margin %:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                  {marginPct}%
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Price Approval Audit
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isCodeValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isCodeValid ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <span className={isCodeValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Valid Product SKU Code
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isPriceValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {isPriceValid ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <span className={isPriceValid ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    Positive Margin Verified
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
              <span>Authorize & Broadcast Price</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
