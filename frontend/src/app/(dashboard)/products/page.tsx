'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Fuel,
  Plus,
  Edit2,
  TrendingUp,
  History,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  X,
  ArrowRight,
  Info,
  Radio,
  Tag,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface FuelProduct {
  id: string;
  code: string;
  name: string;
  unit: string;
  sellingPrice: number;
  costPrice: number;
  margin: number;
  marginPct: number;
  status: 'ACTIVE' | 'INACTIVE';
  effectiveDate: string;
  tanksCount: number;
  nozzlesCount: number;
}

const INITIAL_PRODUCTS: FuelProduct[] = [
  {
    id: 'p1',
    code: 'PETROL-95',
    name: 'Super Unleaded Petrol (PMS 95)',
    unit: 'Litre',
    sellingPrice: 2.15,
    costPrice: 1.82,
    margin: 0.33,
    marginPct: 15.3,
    status: 'ACTIVE',
    effectiveDate: 'Jan 01, 2026',
    tanksCount: 2,
    nozzlesCount: 8,
  },
  {
    id: 'p2',
    code: 'DIESEL-AGO',
    name: 'Ultra-Low Sulfur Diesel (AGO 50ppm)',
    unit: 'Litre',
    sellingPrice: 2.05,
    costPrice: 1.74,
    margin: 0.31,
    marginPct: 15.1,
    status: 'ACTIVE',
    effectiveDate: 'Dec 15, 2025',
    tanksCount: 1,
    nozzlesCount: 6,
  },
  {
    id: 'p3',
    code: 'KEROSENE-IK',
    name: 'Illuminating Kerosene (IK)',
    unit: 'Litre',
    sellingPrice: 1.85,
    costPrice: 1.55,
    margin: 0.3,
    marginPct: 16.2,
    status: 'ACTIVE',
    effectiveDate: 'Nov 20, 2025',
    tanksCount: 1,
    nozzlesCount: 2,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<FuelProduct[]>(INITIAL_PRODUCTS);
  const [isPriceChangeOpen, setIsPriceChangeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FuelProduct | null>(null);
  const [newSellingPrice, setNewSellingPrice] = useState('');
  const [newCostPrice, setNewCostPrice] = useState('');

  const openPriceModal = (p: FuelProduct) => {
    setSelectedProduct(p);
    setNewSellingPrice(p.sellingPrice.toFixed(2));
    setNewCostPrice(p.costPrice.toFixed(2));
    setIsPriceChangeOpen(true);
  };

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const sell = parseFloat(newSellingPrice) || selectedProduct.sellingPrice;
    const cost = parseFloat(newCostPrice) || selectedProduct.costPrice;
    const margin = sell - cost;
    const marginPct = (margin / sell) * 100;

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              sellingPrice: sell,
              costPrice: cost,
              margin: margin,
              marginPct: Math.round(marginPct * 10) / 10,
              effectiveDate: 'Just now (Broadcasted)',
            }
          : p
      )
    );
    setIsPriceChangeOpen(false);
  };

  // TanStack table columns
  const columns: ColumnDef<FuelProduct>[] = [
    {
      accessorKey: 'code',
      header: 'Product SKU',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Fuel Grade Name',
      cell: ({ row }) => {
        const isPetrol = row.original.name.includes('Petrol');
        const isDiesel = row.original.name.includes('Diesel');
        return (
          <div className="flex items-center gap-2">
            <Fuel
              className={`w-4 h-4 ${
                isPetrol ? 'text-emerald-600' : isDiesel ? 'text-amber-600' : 'text-indigo-600'
              }`}
            />
            <span className="font-bold text-gray-900">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'sellingPrice',
      header: 'Pump Retail Price',
      cell: ({ row }) => (
        <span className="font-extrabold text-base text-gray-900 font-mono">
          ${row.original.sellingPrice.toFixed(2)}
          <span className="text-[10px] text-gray-400 font-normal font-sans"> / L</span>
        </span>
      ),
    },
    {
      accessorKey: 'costPrice',
      header: 'Terminal Cost',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-600 font-mono">
          ${row.original.costPrice.toFixed(2)} / L
        </span>
      ),
    },
    {
      accessorKey: 'margin',
      header: 'Gross Margin / L',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-emerald-600 font-mono">
            +${row.original.margin.toFixed(2)}
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            {row.original.marginPct}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'effectiveDate',
      header: 'Last Broadcast',
      cell: ({ row }) => <span className="text-gray-500 text-xs">{row.original.effectiveDate}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Pylon Status',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ACTIVE ON PUMPS
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <button
          onClick={() => openPriceModal(row.original)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition-colors shadow-2xs"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Adjust Price</span>
        </button>
      ),
    },
  ];

  const avgMarginPct = products.reduce((acc, p) => acc + p.marginPct, 0) / Math.max(1, products.length);
  const totalNozzlesServing = products.reduce((acc, p) => acc + p.nozzlesCount, 0);

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Standard)             */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Fuel className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Fuel Products & Forecourt Retail Pricing
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Roadside electronic LED totem pylon simulation, gross profit margins, and pump price broadcasting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Product Code,Product Name,Unit,Selling Price,Cost Price,Unit Margin ($),Margin %,Tanks,Nozzles,Status,Effective Date'];
              const rows = products.map(
                (p) => `"${p.code}","${p.name}","${p.unit}",${p.sellingPrice},${p.costPrice},${p.margin},${p.marginPct}%,${p.tanksCount},${p.nozzlesCount},"${p.status}","${p.effectiveDate}"`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Products_Catalog_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Fuel Grade</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT PRICING & MARGIN KPI CARDS (With Sparkline Waves)      */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Benchmark Petrol Rate */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Super 95 Petrol Rate
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">$2.15 / L</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Active
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Margin: +$0.33 / L (15.3%)
              </span>
            </div>
          </div>
          {/* Emerald Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 24C12 24 16 12 26 12C36 12 40 20 50 14C56 9 62 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Benchmark Diesel Rate */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Diesel (AGO 50ppm) Rate
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">$2.05 / L</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                  Active
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Margin: +$0.31 / L (15.1%)
              </span>
            </div>
          </div>
          {/* Amber Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-amber-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 20C10 20 18 6 28 6C38 6 44 24 54 18C60 14 64 6 68 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Average Product Margin % */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Weighted Retail Margin
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-emerald-600 font-mono">
                  {avgMarginPct.toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Healthy
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Above wholesale target floor
              </span>
            </div>
          </div>
          {/* Indigo Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-indigo-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 18C12 18 16 26 26 22C36 18 42 8 52 8C58 8 62 14 68 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Nozzles & Tanks Broadcast */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Totem & Pump Sync
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{totalNozzlesServing} Nozzles</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Broadcasted
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Synchronized with roadside totem
              </span>
            </div>
          </div>
          {/* Purple Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-purple-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 10C14 10 20 22 30 20C40 18 46 6 56 6C62 6 64 12 68 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Roadside Electronic LED Totem Price Pylon Simulator */}
      <div className="bg-gray-950 rounded-3xl p-6 text-white shadow-xl border border-gray-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-600 text-white tracking-widest uppercase">
                ROADSIDE LED TOTEM PYLON
              </span>
              <span className="text-xs text-gray-400 font-mono">Central Forecourt Totem #1</span>
            </div>
            <h2 className="text-xl font-black text-white">FUELPRO FORECOURT TOTEM SIGN</h2>
            <p className="text-xs text-gray-400">
              High-visibility roadside LED display updated in real-time when prices are broadcasted.
            </p>
          </div>

          {/* LED Price Digits Simulation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Petrol */}
            <div className="bg-black/80 rounded-2xl p-4 border border-emerald-500/30 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <div>
                <div className="text-[11px] font-black text-emerald-400 tracking-wider">SUPER 95</div>
                <div className="text-[10px] text-gray-500">PETROL (PMS)</div>
              </div>
              <div className="font-mono text-3xl font-black text-emerald-400 tracking-wider drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                ${products.find((p) => p.code === 'PETROL-95')?.sellingPrice.toFixed(2) || '2.15'}
              </div>
            </div>

            {/* Diesel */}
            <div className="bg-black/80 rounded-2xl p-4 border border-amber-500/30 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <div>
                <div className="text-[11px] font-black text-amber-400 tracking-wider">DIESEL AGO</div>
                <div className="text-[10px] text-gray-500">LOW SULFUR</div>
              </div>
              <div className="font-mono text-3xl font-black text-amber-400 tracking-wider drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                ${products.find((p) => p.code === 'DIESEL-AGO')?.sellingPrice.toFixed(2) || '2.05'}
              </div>
            </div>

            {/* Kerosene */}
            <div className="bg-black/80 rounded-2xl p-4 border border-sky-500/30 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <div>
                <div className="text-[11px] font-black text-sky-400 tracking-wider">KEROSENE</div>
                <div className="text-[10px] text-gray-500">ILLUMINATING</div>
              </div>
              <div className="font-mono text-3xl font-black text-sky-400 tracking-wider drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
                ${products.find((p) => p.code === 'KEROSENE-IK')?.sellingPrice.toFixed(2) || '1.85'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Products & Retail Margins TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Fuel Grade Catalog & Unit Margin Ledger</h2>
          <p className="text-xs text-gray-500 font-medium">
            Forecourt pricing matrix, terminal cost of goods, and gross margins per liter.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={products}
          searchPlaceholder="Search product SKU or fuel grade..."
          pageSize={10}
          emptyMessage="No fuel products found."
        />
      </div>

      {/* Modal: Adjust Price & Broadcast */}
      {isPriceChangeOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Broadcast Forecourt Price Change</h3>
              </div>
              <button
                onClick={() => setIsPriceChangeOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePrice} className="space-y-3.5 text-xs">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-900">
                <div className="font-bold">{selectedProduct.name}</div>
                <div className="text-[11px] text-blue-700">SKU: {selectedProduct.code}</div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">New Pump Retail Price ($ / L)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newSellingPrice}
                  onChange={(e) => setNewSellingPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-lg text-gray-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Terminal Wholesale Cost ($ / L)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newCostPrice}
                  onChange={(e) => setNewCostPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>New Gross Margin:</span>
                  <span className="font-bold text-emerald-600">
                    +$
                    {(
                      (parseFloat(newSellingPrice) || 0) - (parseFloat(newCostPrice) || 0)
                    ).toFixed(2)}{' '}
                    / L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price Distribution:</span>
                  <span className="text-gray-700 font-semibold">Instantly sent to POS & Totem sign</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPriceChangeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Broadcast New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
