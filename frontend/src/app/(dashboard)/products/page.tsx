'use client';

import React, { useState } from 'react';
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Fuel Products & Forecourt Retail Pricing
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Roadside electronic LED totem pylon simulation, gross profit margins, and pump price broadcasting.
            </p>
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
