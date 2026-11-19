'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gauge,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  Edit2,
  X,
  Droplet,
  Sliders,
  Download,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Nozzle {
  id: string;
  nozzleNumber: number;
  label: string;
  pumpCode: string;
  pumpName: string;
  fuelProduct: 'Petrol' | 'Diesel' | 'Kerosene';
  totalizerReadingL: number;
  flowRateLpm: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'CALIBRATION_DUE';
  lastCalibratedDate: string;
}

const INITIAL_NOZZLES: Nozzle[] = [
  {
    id: 'noz-1',
    nozzleNumber: 1,
    label: 'Nozzle 1-A (Petrol Super 95)',
    pumpCode: 'PUMP-01',
    pumpName: 'Forecourt Pump 1 (Gilbarco Advantage)',
    fuelProduct: 'Petrol',
    totalizerReadingL: 148920.45,
    flowRateLpm: 38.5,
    status: 'ACTIVE',
    lastCalibratedDate: 'Oct 15, 2026',
  },
  {
    id: 'noz-2',
    nozzleNumber: 2,
    label: 'Nozzle 1-B (Diesel ULSD)',
    pumpCode: 'PUMP-01',
    pumpName: 'Forecourt Pump 1 (Gilbarco Advantage)',
    fuelProduct: 'Diesel',
    totalizerReadingL: 198210.12,
    flowRateLpm: 42.0,
    status: 'ACTIVE',
    lastCalibratedDate: 'Oct 15, 2026',
  },
  {
    id: 'noz-3',
    nozzleNumber: 1,
    label: 'Nozzle 2-A (Petrol Super 95)',
    pumpCode: 'PUMP-02',
    pumpName: 'Forecourt Pump 2 (Gilbarco Advantage)',
    fuelProduct: 'Petrol',
    totalizerReadingL: 132104.8,
    flowRateLpm: 39.0,
    status: 'ACTIVE',
    lastCalibratedDate: 'Oct 15, 2026',
  },
  {
    id: 'noz-4',
    nozzleNumber: 2,
    label: 'Nozzle 2-B (Diesel ULSD)',
    pumpCode: 'PUMP-02',
    pumpName: 'Forecourt Pump 2 (Gilbarco Advantage)',
    fuelProduct: 'Diesel',
    totalizerReadingL: 175402.5,
    flowRateLpm: 41.5,
    status: 'ACTIVE',
    lastCalibratedDate: 'Oct 15, 2026',
  },
  {
    id: 'noz-5',
    nozzleNumber: 1,
    label: 'Nozzle 3-A (Kerosene)',
    pumpCode: 'PUMP-03',
    pumpName: 'Forecourt Pump 3 (Wayne Ovation)',
    fuelProduct: 'Kerosene',
    totalizerReadingL: 45210.9,
    flowRateLpm: 35.0,
    status: 'CALIBRATION_DUE',
    lastCalibratedDate: 'May 10, 2026',
  },
];

export default function NozzlesPage() {
  const [nozzles, setNozzles] = useState<Nozzle[]>(INITIAL_NOZZLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editNozzle, setEditNozzle] = useState<Nozzle | null>(null);

  // Form State
  const [form, setForm] = useState({
    pumpCode: 'PUMP-01',
    label: '',
    fuelProduct: 'Petrol' as 'Petrol' | 'Diesel' | 'Kerosene',
    totalizerReadingL: 0,
    flowRateLpm: 40.0,
  });

  const handleCreateNozzle = (e: React.FormEvent) => {
    e.preventDefault();
    const newNoz: Nozzle = {
      id: `noz-${Date.now()}`,
      nozzleNumber: nozzles.filter((n) => n.pumpCode === form.pumpCode).length + 1,
      label: form.label || `Nozzle ${form.fuelProduct}`,
      pumpCode: form.pumpCode,
      pumpName: `Forecourt ${form.pumpCode}`,
      fuelProduct: form.fuelProduct,
      totalizerReadingL: Number(form.totalizerReadingL),
      flowRateLpm: Number(form.flowRateLpm),
      status: 'ACTIVE',
      lastCalibratedDate: 'Today',
    };

    setNozzles((prev) => [...prev, newNoz]);
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setNozzles((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: n.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE',
            }
          : n
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Decommission this nozzle meter?')) {
      setNozzles((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const filteredNozzles = nozzles.filter((n) => {
    const matchesSearch =
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.pumpCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.fuelProduct.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = productFilter === 'ALL' || n.fuelProduct === productFilter;
    return matchesSearch && matchesProduct;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner matching Modern Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Dispenser Nozzles & Totalizer Meters
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Forecourt electronic totalizers, Weights & Measures verification, meter calibration audits, and flow rate performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = 'ID,Label,Pump Code,Fuel Product,Totalizer (L),Flow Rate (LPM),Status,Last Calibrated\n';
              const rows = nozzles
                .map((n) => `"${n.id}","${n.label}","${n.pumpCode}","${n.fuelProduct}",${n.totalizerReadingL},${n.flowRateLpm},"${n.status}","${n.lastCalibratedDate}"`)
                .join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Nozzles_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/nozzles/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dispenser Nozzle</span>
          </Link>
        </div>
      </div>

      {/* 4 Forecourt KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Nozzles */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active Nozzles</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              100% Online
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">
              {nozzles.filter((n) => n.status === 'ACTIVE').length}
            </span>
            <span className="text-xs font-semibold text-gray-500">Nozzles</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Live dispensing enabled</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 16 Q 25 6, 50 14 T 100 4"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Cumulative Meter Volume */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Cumulative Volume</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
              Totalizer Sum
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-600">
              {Math.round(nozzles.reduce((acc, n) => acc + n.totalizerReadingL, 0)).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">Litres</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Lifetime forecourt throughput</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 20 Q 30 10, 60 16 T 100 6"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Average Flow Rate */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Average Flow Rate</span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/50">
              Nominal Velocity
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">39.2</span>
            <span className="text-xs font-semibold text-gray-500">L / min</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Forecourt dispenser speed</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 14 Q 30 22, 60 10 T 100 4"
                fill="none"
                stroke="#9333ea"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Calibration Status */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Weights & Measures</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
              Audit Pending
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600">
              {nozzles.filter((n) => n.status === 'CALIBRATION_DUE').length}
            </span>
            <span className="text-xs font-semibold text-gray-500">Nozzle Due</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Scheduled verification audit</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 18 Q 25 22, 50 14 T 100 8"
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by label, pump code, or fuel product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-500 mr-1">Product:</span>
          {(['ALL', 'Petrol', 'Diesel', 'Kerosene'] as const).map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setProductFilter(grade)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                productFilter === grade
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Nozzles Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Nozzle Label</th>
                <th className="p-4">Parent Pump</th>
                <th className="p-4">Fuel Product</th>
                <th className="p-4">Electronic Meter (L)</th>
                <th className="p-4">Flow Rate</th>
                <th className="p-4">Last Calibrated</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNozzles.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{n.label}</td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-blue-700 block">{n.pumpCode}</span>
                    <span className="text-[11px] text-gray-400">{n.pumpName}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        n.fuelProduct === 'Petrol'
                          ? 'bg-blue-100 text-blue-700'
                          : n.fuelProduct === 'Diesel'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {n.fuelProduct}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-black text-gray-900 text-sm">
                    {n.totalizerReadingL.toLocaleString()} L
                  </td>
                  <td className="p-4 text-gray-700 font-medium">{n.flowRateLpm} L/min</td>
                  <td className="p-4 text-gray-500">{n.lastCalibratedDate}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        n.status === 'ACTIVE'
                          ? 'success'
                          : n.status === 'CALIBRATION_DUE'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {n.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(n.id)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[11px]"
                      >
                        {n.status === 'ACTIVE' ? 'Set Maint.' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(n.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD NOZZLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Gauge className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Add Dispenser Nozzle</h3>
                  <p className="text-xs text-gray-500">Configure new physical nozzle on forecourt pump</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNozzle} className="mt-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Parent Pump *
                </label>
                <select
                  value={form.pumpCode}
                  onChange={(e) => setForm({ ...form, pumpCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white"
                >
                  <option value="PUMP-01">Pump 01 (Central)</option>
                  <option value="PUMP-02">Pump 02 (Central)</option>
                  <option value="PUMP-03">Pump 03 (Central)</option>
                  <option value="PUMP-04">Pump 04 (Central)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Fuel Product Grade *
                </label>
                <select
                  value={form.fuelProduct}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fuelProduct: e.target.value as 'Petrol' | 'Diesel' | 'Kerosene',
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white"
                >
                  <option value="Petrol">Petrol (Super 95)</option>
                  <option value="Diesel">Diesel (ULSD 50ppm)</option>
                  <option value="Kerosene">Kerosene</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nozzle Display Label
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Nozzle 1-A (Petrol)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Initial Totalizer (L) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.totalizerReadingL}
                    onChange={(e) =>
                      setForm({ ...form, totalizerReadingL: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Flow Rate (L/min)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.flowRateLpm}
                    onChange={(e) => setForm({ ...form, flowRateLpm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Configure Nozzle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
