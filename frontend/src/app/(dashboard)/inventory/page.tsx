'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Package,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MoreVertical,
  X,
  Droplet,
  Fuel,
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  Activity,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface WetStockLedgerItem {
  id: string;
  date: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  tankCode: string;
  type: 'DELIVERY' | 'SALE' | 'ADJUSTMENT' | 'DIP_RECONCILIATION';
  quantity: number;
  balance: number;
  reference: string;
  officer: string;
  notes: string;
}

const INITIAL_LEDGER: WetStockLedgerItem[] = [
  {
    id: 'led-1',
    date: 'Today, 15:15 PM',
    product: 'Diesel',
    tankCode: 'UST-02',
    type: 'DELIVERY',
    quantity: 10000,
    balance: 28800,
    reference: 'DEL-881920',
    officer: 'Farhan Ali (Inventory)',
    notes: 'Hass Petroleum road tanker offload into UST-02',
  },
  {
    id: 'led-2',
    date: 'Today, 14:45 PM',
    product: 'Petrol',
    tankCode: 'UST-01',
    type: 'SALE',
    quantity: -45.0,
    balance: 29750,
    reference: 'REC-991244',
    officer: 'Sarah Jenkins',
    notes: 'Dispenser Pump 01 forecourt retail sales',
  },
  {
    id: 'led-3',
    date: 'Today, 12:10 PM',
    product: 'Petrol',
    tankCode: 'UST-01',
    type: 'SALE',
    quantity: -65.5,
    balance: 29795,
    reference: 'REC-991240',
    officer: 'Sarah Jenkins',
    notes: 'Metro Rapid fleet refuel',
  },
  {
    id: 'led-4',
    date: 'Today, 10:20 AM',
    product: 'Petrol',
    tankCode: 'UST-01',
    type: 'DELIVERY',
    quantity: 11980,
    balance: 29860.5,
    reference: 'DEL-881918',
    officer: 'Farhan Ali (Inventory)',
    notes: 'TotalEnergies intake (-20L transit temperature shrinkage)',
  },
  {
    id: 'led-5',
    date: 'Today, 06:30 AM',
    product: 'Petrol',
    tankCode: 'UST-01',
    type: 'DIP_RECONCILIATION',
    quantity: -30.0,
    balance: 17910.5,
    reference: 'DIP-2026-01',
    officer: 'Farhan Ali (Inventory)',
    notes: 'Morning soundings physical dip tape reconciliation',
  },
  {
    id: 'led-6',
    date: 'Yesterday, 18:00 PM',
    product: 'Kerosene',
    tankCode: 'UST-03',
    type: 'SALE',
    quantity: -50.0,
    balance: 3750,
    reference: 'REC-991230',
    officer: 'Abdi Hassan',
    notes: 'Canister refill sale',
  },
];

export default function InventoryPage() {
  const [ledger, setLedger] = useState<WetStockLedgerItem[]>(INITIAL_LEDGER);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Form states
  const [adjTank, setAdjTank] = useState('UST-01');
  const [adjProduct, setAdjProduct] = useState<'Petrol' | 'Diesel' | 'Kerosene'>('Petrol');
  const [adjQty, setAdjQty] = useState('');
  const [adjNotes, setAdjNotes] = useState('');

  const handlePostAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(adjQty) || 0;
    const lastItem = ledger.find((l) => l.tankCode === adjTank) || ledger[0];
    const newBal = (lastItem?.balance || 25000) + qty;

    const created: WetStockLedgerItem = {
      id: `led-${Date.now()}`,
      date: 'Just now',
      product: adjProduct,
      tankCode: adjTank,
      type: 'ADJUSTMENT',
      quantity: qty,
      balance: newBal,
      reference: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      officer: 'Active Inventory Officer',
      notes: adjNotes || 'Manual dip variance adjustment',
    };
    setLedger([created, ...ledger]);
    setIsAdjustModalOpen(false);
    setAdjQty('');
    setAdjNotes('');
  };

  // TanStack columns
  const columns: ColumnDef<WetStockLedgerItem>[] = [
    {
      accessorKey: 'reference',
      header: 'Audit Ref #',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Posting Time',
      cell: ({ row }) => <span className="font-semibold text-gray-800">{row.original.date}</span>,
    },
    {
      accessorKey: 'tankCode',
      header: 'Storage Tank',
      cell: ({ row }) => (
        <span className="font-bold text-gray-800 font-mono">{row.original.tankCode}</span>
      ),
    },
    {
      accessorKey: 'product',
      header: 'Fuel Grade',
      cell: ({ row }) => {
        const prod = row.original.product;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              prod === 'Petrol'
                ? 'bg-emerald-50 text-emerald-700'
                : prod === 'Diesel'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            <Fuel className="w-3 h-3" />
            {prod}
          </span>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Movement Type',
      cell: ({ row }) => {
        const t = row.original.type;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
              t === 'DELIVERY'
                ? 'bg-emerald-50 text-emerald-700'
                : t === 'SALE'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {t.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      accessorKey: 'quantity',
      header: 'Volume In / Out',
      cell: ({ row }) => {
        const q = row.original.quantity;
        return (
          <span
            className={`font-extrabold font-mono text-sm ${
              q > 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {q > 0 ? `+${q.toLocaleString()}` : q.toLocaleString()} L
          </span>
        );
      },
    },
    {
      accessorKey: 'balance',
      header: 'Closing Book Balance',
      cell: ({ row }) => (
        <span className="font-extrabold font-mono text-gray-900 text-sm">
          {row.original.balance.toLocaleString()} L
        </span>
      ),
    },
    {
      accessorKey: 'officer',
      header: 'Logged Officer',
      cell: ({ row }) => <span className="text-gray-600 text-xs">{row.original.officer}</span>,
    },
    {
      accessorKey: 'notes',
      header: 'Movement Narrative',
      cell: ({ row }) => (
        <span className="text-gray-500 text-xs truncate max-w-[200px] block">{row.original.notes}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center shrink-0 shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Wet Stock Inventory & Loss/Gain Ledger
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Continuous wet stock mass-balance reconciliation, evaporation loss audit, and book stock ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/inventory/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post Stock Adjustment</span>
          </Link>
        </div>
      </div>

      {/* Mass-Balance Reconciliation Strip */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Forecourt Wet Stock Mass-Balance (Today)</h3>
            <p className="text-xs text-gray-500 font-medium">Opening Stock + Deliveries - Meter Sales = Expected vs Dip Physical.</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Variance: -0.08% (Normal Tolerance)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-gray-50 p-3 rounded-2xl">
            <div className="text-[11px] font-semibold text-gray-400 uppercase">Opening Book</div>
            <div className="font-mono text-base font-black text-gray-900 mt-1">50,420 L</div>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-2xl">
            <div className="text-[11px] font-semibold text-emerald-700 uppercase">Deliveries (+)</div>
            <div className="font-mono text-base font-black text-emerald-800 mt-1">+21,980 L</div>
          </div>
          <div className="bg-blue-50/70 p-3 rounded-2xl">
            <div className="text-[11px] font-semibold text-blue-700 uppercase">Pump Dispensed (-)</div>
            <div className="font-mono text-base font-black text-blue-800 mt-1">-10,020 L</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl">
            <div className="text-[11px] font-semibold text-gray-400 uppercase">Expected Closing</div>
            <div className="font-mono text-base font-black text-gray-900 mt-1">62,380 L</div>
          </div>
          <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-sm">
            <div className="text-[11px] font-semibold text-gray-400 uppercase">Physical Dip Total</div>
            <div className="font-mono text-base font-black text-emerald-400 mt-1">62,330 L</div>
            <div className="text-[10px] text-gray-300">-50 L (-0.08%)</div>
          </div>
        </div>
      </div>

      {/* TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Underground Wet Stock Movement Ledger</h2>
          <p className="text-xs text-gray-500 font-medium">
            Granular transaction history across deliveries, dispenser sales, and physical dip soundings.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={ledger}
          searchPlaceholder="Search audit ref #, tank code, or movement..."
          pageSize={10}
          emptyMessage="No wet stock ledger items recorded."
        />
      </div>

      {/* Modal: Post Stock Adjustment */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Post Wet Stock Adjustment</h3>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostAdjustment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Storage Tank</label>
                  <select
                    value={adjTank}
                    onChange={(e) => setAdjTank(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="UST-01">UST-01 (Petrol Main)</option>
                    <option value="UST-02">UST-02 (Diesel Heavy)</option>
                    <option value="UST-03">UST-03 (Kerosene)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fuel Grade</label>
                  <select
                    value={adjProduct}
                    onChange={(e) => setAdjProduct(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Kerosene">Kerosene</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Adjustment Volume (L)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. -25 for shortage, +30 for gain"
                  value={adjQty}
                  onChange={(e) => setAdjQty(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Audit Justification / Narrative</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Reason: Temperature shrinkage, dip calibration adjustment..."
                  value={adjNotes}
                  onChange={(e) => setAdjNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white text-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Post Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
