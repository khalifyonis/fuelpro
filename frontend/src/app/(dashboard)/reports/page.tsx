'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  DollarSign,
  Fuel,
  ArrowRight,
  Info,
  MoreVertical,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  PieChart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface ProductReportRow {
  id: string;
  label: string;
  litres: number;
  revenue: number;
  cost: number;
  margin: number;
  marginPct: number;
  txns: number;
  sharePct: number;
}

const PRODUCT_REPORTS: ProductReportRow[] = [
  {
    id: 'pr-1',
    label: 'Super Unleaded Petrol (PMS 95)',
    litres: 64200,
    revenue: 138030.0,
    cost: 115560.0,
    margin: 22470.0,
    marginPct: 16.3,
    txns: 1240,
    sharePct: 57.1,
  },
  {
    id: 'pr-2',
    label: 'Ultra-Low Sulfur Diesel (AGO 50ppm)',
    litres: 38150,
    revenue: 78207.5,
    cost: 64855.0,
    margin: 13352.5,
    marginPct: 17.1,
    txns: 890,
    sharePct: 33.9,
  },
  {
    id: 'pr-3',
    label: 'Illuminating Kerosene (IK)',
    litres: 10080,
    revenue: 15120.0,
    cost: 12096.0,
    margin: 3024.0,
    marginPct: 20.0,
    txns: 310,
    sharePct: 9.0,
  },
];

const HOURLY_PEAK_VOLUME = [
  { hour: '06:00', volume: 1850 },
  { hour: '07:00', volume: 4200 },
  { hour: '08:00', volume: 6800 },
  { hour: '09:00', volume: 5400 },
  { hour: '10:00', volume: 3100 },
  { hour: '11:00', volume: 2900 },
  { hour: '12:00', volume: 3800 },
  { hour: '13:00', volume: 4100 },
  { hour: '14:00', volume: 3200 },
  { hour: '15:00', volume: 3600 },
  { hour: '16:00', volume: 5900 },
  { hour: '17:00', volume: 7800 },
  { hour: '18:00', volume: 7200 },
  { hour: '19:00', volume: 5100 },
  { hour: '20:00', volume: 3400 },
  { hour: '21:00', volume: 2100 },
];

export default function ReportsPage() {
  const [data] = useState<ProductReportRow[]>(PRODUCT_REPORTS);
  const [period, setPeriod] = useState('Month to Date');

  // TanStack columns
  const columns: ColumnDef<ProductReportRow>[] = [
    {
      accessorKey: 'label',
      header: 'Fuel Grade Category',
      cell: ({ row }) => (
        <span className="font-bold text-gray-900 flex items-center gap-1.5">
          <Fuel className="w-3.5 h-3.5 text-blue-600" />
          {row.original.label}
        </span>
      ),
    },
    {
      accessorKey: 'litres',
      header: 'Throughput Volume',
      cell: ({ row }) => (
        <span className="font-bold text-gray-900 font-mono">
          {row.original.litres.toLocaleString()} <span className="text-[10px] text-gray-400">L</span>
        </span>
      ),
    },
    {
      accessorKey: 'sharePct',
      header: 'Station Volume Share',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${row.original.sharePct}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-700">{row.original.sharePct}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'revenue',
      header: 'Gross Retail Revenue',
      cell: ({ row }) => (
        <span className="font-extrabold text-sm text-gray-900 font-mono">
          ${row.original.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: 'cost',
      header: 'COGS Wholesale Cost',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-600 font-mono">
          ${row.original.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: 'margin',
      header: 'Gross Margin ($)',
      cell: ({ row }) => (
        <span className="font-bold text-emerald-600 font-mono">
          +${row.original.margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: 'marginPct',
      header: 'Margin %',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700">
          {row.original.marginPct}%
        </span>
      ),
    },
    {
      accessorKey: 'txns',
      header: 'Transactions',
      cell: ({ row }) => <span className="font-bold text-gray-800">{row.original.txns} txns</span>,
    },
  ];

  const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const totalLitres = data.reduce((acc, d) => acc + d.litres, 0);
  const totalMargin = data.reduce((acc, d) => acc + d.margin, 0);
  const avgMarginPct = (totalMargin / Math.max(1, totalRevenue)) * 100;

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Standard)             */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <BarChart3 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Forecourt Analytics & Business Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Hourly volume peak heatmaps, gross retail margins, and dispenser throughput breakdown.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Fuel Grade,Throughput Volume (L),Volume Share %,Gross Revenue ($),Wholesale COGS ($),Gross Margin ($),Margin %,Transactions'];
              const rows = data.map(
                (d) => `"${d.label}",${d.litres},${d.sharePct}%,${d.revenue},${d.cost},${d.margin},${d.marginPct}%,${d.txns}`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="Today">Today (Realtime)</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Month to Date">Month to Date</option>
            <option value="Year to Date">Year to Date</option>
          </select>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT ANALYTICS KPI CARDS (With Sparkline Waves)             */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Retail Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Gross Retail Revenue
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  +16.4%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Across all fuel grades MTD
              </span>
            </div>
          </div>
          {/* Blue Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-blue-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 24C12 24 16 12 26 12C36 12 40 20 50 14C56 9 62 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Liters Throughput */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Liters Throughput
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  {totalLitres.toLocaleString()} <span className="text-xs font-normal text-gray-400">L</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Active
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                57.1% Super 95 Petrol
              </span>
            </div>
          </div>
          {/* Emerald Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 20C10 20 18 6 28 6C38 6 44 24 54 18C60 14 64 6 68 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Net Gross Margin $ */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Gross Forecourt Margin
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-emerald-600 font-mono">
                  +${totalMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Profitable
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                After wholesale COGS
              </span>
            </div>
          </div>
          {/* Purple Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-purple-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 18C12 18 16 26 26 22C36 18 42 8 52 8C58 8 62 14 68 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Weighted Margin % */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Weighted Return Margin
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  {avgMarginPct.toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Target: 15%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                2,440 total transactions
              </span>
            </div>
          </div>
          {/* Amber Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-amber-500" viewBox="0 0 70 30" fill="none">
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

      {/* Hourly Forecourt Fueling Peak Volume Chart */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Hourly Forecourt Peak Fueling Volume (Liters)</h3>
            <p className="text-xs text-gray-500 font-medium">
              Identifies rush hours (Morning 07:00-09:00 & Evening 16:00-19:00) for cashier shift staffing.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            Peak: 7,800 L @ 17:00 PM
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={HOURLY_PEAK_VOLUME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(val: any) => [`${val.toLocaleString()} Liters`, 'Dispensed Volume']}
              />
              <Bar dataKey="volume" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TanStack Table: Fuel Grade Breakdown & Margins */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Product Profit Margins & Volume Contribution</h2>
          <p className="text-xs text-gray-500 font-medium">
            Forecourt revenue breakdown by grade with cost of goods sold and net gross profit.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search fuel grade..."
          pageSize={10}
          emptyMessage="No report rows generated."
        />
      </div>
    </div>
  );
}
