'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  GaugeCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MoreVertical,
  X,
  Fuel,
  Wrench,
  RotateCcw,
  Activity,
  Zap,
  Power,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface ForecourtNozzle {
  id: string;
  pumpCode: string;
  label: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  meter: number;
  flowRateLpm: number;
  lastCalibrated: string;
  status: 'FUELING' | 'IDLE' | 'SUSPENDED';
}

export interface ForecourtDispenser {
  id: string;
  code: string;
  name: string;
  makeModel: string;
  island: string;
  status: 'ACTIVE' | 'MAINTENANCE';
  activity: 'Fueling' | 'Idle' | 'Standby';
  totalVolumeL: number;
  nozzles: ForecourtNozzle[];
}

const INITIAL_PUMPS: ForecourtDispenser[] = [
  {
    id: 'pump-1',
    code: 'DSP-01',
    name: 'Dispenser Island 1 (North Lane)',
    makeModel: 'Gilbarco Veeder-Root Horizon',
    island: 'Island 1',
    status: 'ACTIVE',
    activity: 'Fueling',
    totalVolumeL: 184549.2,
    nozzles: [
      {
        id: 'n1',
        pumpCode: 'DSP-01',
        label: 'Nozzle 1-A',
        product: 'Petrol',
        meter: 184549.2,
        flowRateLpm: 38.5,
        lastCalibrated: '15 Oct 2026',
        status: 'FUELING',
      },
      {
        id: 'n2',
        pumpCode: 'DSP-01',
        label: 'Nozzle 1-B',
        product: 'Diesel',
        meter: 94232.0,
        flowRateLpm: 0.0,
        lastCalibrated: '15 Oct 2026',
        status: 'IDLE',
      },
    ],
  },
  {
    id: 'pump-2',
    code: 'DSP-02',
    name: 'Dispenser Island 1 (South Lane)',
    makeModel: 'Gilbarco Veeder-Root Horizon',
    island: 'Island 1',
    status: 'ACTIVE',
    activity: 'Idle',
    totalVolumeL: 120580.0,
    nozzles: [
      {
        id: 'n3',
        pumpCode: 'DSP-02',
        label: 'Nozzle 2-A',
        product: 'Petrol',
        meter: 120580.0,
        flowRateLpm: 0.0,
        lastCalibrated: '15 Oct 2026',
        status: 'IDLE',
      },
      {
        id: 'n4',
        pumpCode: 'DSP-02',
        label: 'Nozzle 2-B',
        product: 'Diesel',
        meter: 88120.5,
        flowRateLpm: 0.0,
        lastCalibrated: '15 Oct 2026',
        status: 'IDLE',
      },
    ],
  },
  {
    id: 'pump-3',
    code: 'DSP-03',
    name: 'Dispenser Island 2 (North Lane)',
    makeModel: 'Wayne Ovation 2 Fuel Dispenser',
    island: 'Island 2',
    status: 'ACTIVE',
    activity: 'Fueling',
    totalVolumeL: 142800.0,
    nozzles: [
      {
        id: 'n5',
        pumpCode: 'DSP-03',
        label: 'Nozzle 3-A',
        product: 'Diesel',
        meter: 142800.0,
        flowRateLpm: 42.0,
        lastCalibrated: '12 Oct 2026',
        status: 'FUELING',
      },
      {
        id: 'n6',
        pumpCode: 'DSP-03',
        label: 'Nozzle 3-B',
        product: 'Kerosene',
        meter: 34115.0,
        flowRateLpm: 0.0,
        lastCalibrated: '12 Oct 2026',
        status: 'IDLE',
      },
    ],
  },
  {
    id: 'pump-4',
    code: 'DSP-04',
    name: 'Dispenser Island 2 (South Lane)',
    makeModel: 'Wayne Ovation 2 Fuel Dispenser',
    island: 'Island 2',
    status: 'ACTIVE',
    activity: 'Idle',
    totalVolumeL: 98400.0,
    nozzles: [
      {
        id: 'n7',
        pumpCode: 'DSP-04',
        label: 'Nozzle 4-A',
        product: 'Petrol',
        meter: 98400.0,
        flowRateLpm: 0.0,
        lastCalibrated: '12 Oct 2026',
        status: 'IDLE',
      },
      {
        id: 'n8',
        pumpCode: 'DSP-04',
        label: 'Nozzle 4-B',
        product: 'Diesel',
        meter: 71200.0,
        flowRateLpm: 0.0,
        lastCalibrated: '12 Oct 2026',
        status: 'IDLE',
      },
    ],
  },
];

export default function PumpsPage() {
  const [pumps, setPumps] = useState<ForecourtDispenser[]>(INITIAL_PUMPS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPumpCode, setNewPumpCode] = useState('DSP-05');
  const [newPumpIsland, setNewPumpIsland] = useState('Island 3');
  const [newPumpMake, setNewPumpMake] = useState('Gilbarco Veeder-Root Horizon');

  // Flatten all nozzles for TanStack table
  const allNozzles: ForecourtNozzle[] = React.useMemo(() => {
    return pumps.flatMap((p) => p.nozzles);
  }, [pumps]);

  const handleAddPump = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ForecourtDispenser = {
      id: `p-${Date.now()}`,
      code: newPumpCode,
      name: `Dispenser ${newPumpIsland}`,
      makeModel: newPumpMake,
      island: newPumpIsland,
      status: 'ACTIVE',
      activity: 'Idle',
      totalVolumeL: 0,
      nozzles: [
        {
          id: `n-${Date.now()}-1`,
          pumpCode: newPumpCode,
          label: `${newPumpCode}-A`,
          product: 'Petrol',
          meter: 0,
          flowRateLpm: 0,
          lastCalibrated: 'Today (New)',
          status: 'IDLE',
        },
        {
          id: `n-${Date.now()}-2`,
          pumpCode: newPumpCode,
          label: `${newPumpCode}-B`,
          product: 'Diesel',
          meter: 0,
          flowRateLpm: 0,
          lastCalibrated: 'Today (New)',
          status: 'IDLE',
        },
      ],
    };
    setPumps([...pumps, created]);
    setIsAddModalOpen(false);
  };

  // TanStack table columns for Nozzles & Meters
  const nozzleColumns: ColumnDef<ForecourtNozzle>[] = [
    {
      accessorKey: 'label',
      header: 'Nozzle Unit',
      cell: ({ row }) => (
        <span className="font-bold text-gray-900 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          {row.original.label}
        </span>
      ),
    },
    {
      accessorKey: 'pumpCode',
      header: 'Dispenser Unit',
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.pumpCode}
        </span>
      ),
    },
    {
      accessorKey: 'product',
      header: 'Fuel Product',
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
      accessorKey: 'meter',
      header: 'Cumulative Totalizer',
      cell: ({ row }) => (
        <span className="font-extrabold font-mono text-gray-900 text-sm">
          {row.original.meter.toLocaleString(undefined, { minimumFractionDigits: 1 })}{' '}
          <span className="text-[10px] text-gray-400 font-sans font-normal">L</span>
        </span>
      ),
    },
    {
      accessorKey: 'flowRateLpm',
      header: 'Flow Rate Telemetry',
      cell: ({ row }) => {
        const rate = row.original.flowRateLpm;
        return (
          <span
            className={`font-semibold ${
              rate > 0 ? 'text-emerald-600 font-black animate-pulse' : 'text-gray-400'
            }`}
          >
            {rate > 0 ? `${rate} L/min (Active Flow)` : '0.0 L/min (Standby)'}
          </span>
        );
      },
    },
    {
      accessorKey: 'lastCalibrated',
      header: 'Weights & Measures Seal',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-gray-600 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{row.original.lastCalibrated}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'State',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              s === 'FUELING'
                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                : s === 'IDLE'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                s === 'FUELING' ? 'bg-emerald-500' : s === 'IDLE' ? 'bg-blue-500' : 'bg-red-500'
              }`}
            />
            {s}
          </span>
        );
      },
    },
  ];

  const totalNozzlesCount = pumps.reduce((acc, p) => acc + p.nozzles.length, 0);
  const activeNozzlesCount = pumps.reduce((acc, p) => acc + p.nozzles.filter((n) => n.status === 'FUELING').length, 0);
  const totalVolumeAllPumps = pumps.reduce((acc, p) => acc + p.totalVolumeL, 0);

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Standard)             */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
            <GaugeCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Forecourt Dispenser Pumps & Nozzles
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Real-time dispenser hardware status, fuel flow telemetry, and weights & measures meter totalizers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/nozzles"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-purple-600" />
            <span>Nozzles Calibration</span>
          </Link>

          <Link
            href="/pumps/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Dispenser</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT DISPENSER KPI CARDS (With Sparkline Waves)             */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Dispensers */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <GaugeCircle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Operating Dispensers
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{pumps.length} Units</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  100% Online
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Across 2 forecourt islands
              </span>
            </div>
          </div>
          {/* Sky Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-sky-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 24C12 24 16 12 26 12C36 12 40 20 50 14C56 9 62 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Calibrated Nozzles */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Dispenser Nozzles
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{totalNozzlesCount} Nozzles</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  {activeNozzlesCount} Fueling
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Weights & Measures sealed
              </span>
            </div>
          </div>
          {/* Purple Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-purple-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 20C10 20 18 6 28 6C38 6 44 24 54 18C60 14 64 6 68 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Cumulative Throughput */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Cumulative Throughput
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  {totalVolumeAllPumps.toLocaleString()} <span className="text-xs font-normal text-gray-400">L</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Active
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Non-resettable electronic meters
              </span>
            </div>
          </div>
          {/* Emerald Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 18C12 18 16 26 26 22C36 18 42 8 52 8C58 8 62 14 68 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Hardware Health & Interlocks */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                NFPA Shear Valves
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">100% Armed</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Normal
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Emergency shutoffs operational
              </span>
            </div>
          </div>
          {/* Green Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 70 30" fill="none">
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

      {/* Forecourt Island Dispensers Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pumps.map((pump) => {
          const isFueling = pump.activity === 'Fueling';
          return (
            <div
              key={pump.id}
              className={`bg-white rounded-3xl border ${
                isFueling ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-gray-100'
              } p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                      {pump.code}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">{pump.island}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isFueling
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isFueling ? 'bg-emerald-500' : 'bg-gray-400'}`}
                    />
                    {pump.activity}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-sm">{pump.name}</h3>
                <div className="text-[11px] text-gray-400 font-medium mb-4">{pump.makeModel}</div>

                {/* Nozzles Container */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Equipped Nozzles
                  </div>
                  {pump.nozzles.map((nz) => (
                    <div
                      key={nz.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Fuel
                          className={`w-3.5 h-3.5 ${
                            nz.product === 'Petrol'
                              ? 'text-emerald-600'
                              : nz.product === 'Diesel'
                              ? 'text-amber-600'
                              : 'text-indigo-600'
                          }`}
                        />
                        <div>
                          <div className="font-bold text-gray-800">{nz.label}</div>
                          <div className="text-[10px] text-gray-400">{nz.product}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-gray-900">{nz.meter.toFixed(1)} L</div>
                        <div
                          className={`text-[10px] font-semibold ${
                            nz.status === 'FUELING' ? 'text-emerald-600' : 'text-gray-400'
                          }`}
                        >
                          {nz.flowRateLpm > 0 ? `${nz.flowRateLpm} L/m` : 'Idle'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispenser Lifetime Totalizer Footer */}
              <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Throughput:</span>
                <span className="font-extrabold text-gray-900 font-mono">
                  {pump.totalVolumeL.toLocaleString()} L
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nozzle Totalizer & Weights & Measures Calibration TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Nozzle Totalizers & Meter Calibration Audits</h2>
          <p className="text-xs text-gray-500 font-medium">
            Forecourt dispenser meter readings, calibration seals, and flow rate sensors.
          </p>
        </div>

        <DataTable
          columns={nozzleColumns}
          data={allNozzles}
          searchPlaceholder="Search nozzle, dispenser, or fuel grade..."
          pageSize={10}
          emptyMessage="No dispenser nozzles recorded."
        />
      </div>

      {/* Modal: Add Dispenser */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <GaugeCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Enroll Forecourt Dispenser</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPump} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Dispenser Code</label>
                <input
                  type="text"
                  required
                  value={newPumpCode}
                  onChange={(e) => setNewPumpCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Island Assignment</label>
                <select
                  value={newPumpIsland}
                  onChange={(e) => setNewPumpIsland(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                >
                  <option value="Island 1">Island 1 (Front Canopy)</option>
                  <option value="Island 2">Island 2 (Mid Canopy)</option>
                  <option value="Island 3">Island 3 (Commercial HGV)</option>
                  <option value="Island 4">Island 4 (Motorcycle Bay)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Make & Hardware Model</label>
                <input
                  type="text"
                  required
                  value={newPumpMake}
                  onChange={(e) => setNewPumpMake(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save Dispenser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
