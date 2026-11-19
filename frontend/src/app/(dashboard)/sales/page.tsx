'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Receipt,
  Plus,
  Search,
  Download,
  Printer,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  X,
  Eye,
  Fuel,
  DollarSign,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Building2,
  Tag,
  LayoutGrid,
  Table as TableIcon,
  Gauge,
  Car,
  User,
  ShieldCheck,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface ForecourtSale {
  id: string;
  receiptNumber: string;
  time: string;
  cashier: string;
  pump: string;
  nozzle: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  litres: number;
  rate: number;
  total: number;
  method: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CREDIT';
  customer: string;
  vehiclePlate?: string;
  meterStart: number;
  meterEnd: number;
  status: 'COMPLETED' | 'REFUNDED';
}

const INITIAL_SALES: ForecourtSale[] = [
  {
    id: 's1',
    receiptNumber: 'REC-991245',
    time: '14:22 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 01',
    nozzle: 'NZ-01 (Petrol)',
    product: 'Petrol',
    litres: 29.07,
    rate: 2.15,
    total: 62.5,
    method: 'CASH',
    customer: 'Walk-in Retail Customer',
    vehiclePlate: 'SO-MOG-1022',
    meterStart: 184520.1,
    meterEnd: 184549.17,
    status: 'COMPLETED',
  },
  {
    id: 's2',
    receiptNumber: 'REC-991244',
    time: '14:15 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 03',
    nozzle: 'NZ-05 (Diesel)',
    product: 'Diesel',
    litres: 22.05,
    rate: 2.05,
    total: 45.2,
    method: 'CARD',
    customer: 'Walk-in Retail Customer',
    vehiclePlate: 'SO-MOG-9431',
    meterStart: 94210.0,
    meterEnd: 94232.05,
    status: 'COMPLETED',
  },
  {
    id: 's3',
    receiptNumber: 'REC-991243',
    time: '14:02 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 01',
    nozzle: 'NZ-01 (Petrol)',
    product: 'Petrol',
    litres: 33.53,
    rate: 2.15,
    total: 72.1,
    method: 'MOBILE_MONEY',
    customer: 'Walk-in (EVC Plus)',
    vehiclePlate: 'SO-MOG-5512',
    meterStart: 184486.57,
    meterEnd: 184520.1,
    status: 'COMPLETED',
  },
  {
    id: 's4',
    receiptNumber: 'REC-991242',
    time: '13:40 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 02',
    nozzle: 'NZ-03 (Diesel)',
    product: 'Diesel',
    litres: 80.0,
    rate: 2.05,
    total: 164.0,
    method: 'CREDIT',
    customer: 'Metro Rapid Bus Fleet',
    vehiclePlate: 'TX-8801',
    meterStart: 120500.0,
    meterEnd: 120580.0,
    status: 'COMPLETED',
  },
  {
    id: 's5',
    receiptNumber: 'REC-991241',
    time: '13:10 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 04',
    nozzle: 'NZ-07 (Kerosene)',
    product: 'Kerosene',
    litres: 15.0,
    rate: 1.85,
    total: 27.75,
    method: 'CASH',
    customer: 'Somali Energy Canister Refill',
    vehiclePlate: 'N/A',
    meterStart: 34100.0,
    meterEnd: 34115.0,
    status: 'COMPLETED',
  },
  {
    id: 's6',
    receiptNumber: 'REC-991240',
    time: '12:55 PM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 02',
    nozzle: 'NZ-04 (Petrol)',
    product: 'Petrol',
    litres: 45.12,
    rate: 2.15,
    total: 97.0,
    method: 'MOBILE_MONEY',
    customer: 'Zaad Mobile Money Customer',
    vehiclePlate: 'SO-MOG-7721',
    meterStart: 184441.45,
    meterEnd: 184486.57,
    status: 'COMPLETED',
  },
  {
    id: 's7',
    receiptNumber: 'REC-991239',
    time: '12:30 PM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 03',
    nozzle: 'NZ-05 (Diesel)',
    product: 'Diesel',
    litres: 120.0,
    rate: 2.05,
    total: 246.0,
    method: 'CREDIT',
    customer: 'Express Taxi Cooperative',
    vehiclePlate: 'TX-8802',
    meterStart: 94090.0,
    meterEnd: 94210.0,
    status: 'COMPLETED',
  },
  {
    id: 's8',
    receiptNumber: 'REC-991238',
    time: '12:05 PM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 01',
    nozzle: 'NZ-02 (Diesel)',
    product: 'Diesel',
    litres: 25.0,
    rate: 2.05,
    total: 51.25,
    method: 'CASH',
    customer: 'Private Hauler Pickup',
    vehiclePlate: 'SO-MOG-3011',
    meterStart: 94065.0,
    meterEnd: 94090.0,
    status: 'COMPLETED',
  },
  {
    id: 's9',
    receiptNumber: 'REC-991237',
    time: '11:42 AM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 04',
    nozzle: 'NZ-08 (Petrol)',
    product: 'Petrol',
    litres: 50.0,
    rate: 2.15,
    total: 107.5,
    method: 'CARD',
    customer: 'Mastercard Contactless',
    vehiclePlate: 'SO-MOG-6100',
    meterStart: 184391.45,
    meterEnd: 184441.45,
    status: 'COMPLETED',
  },
  {
    id: 's10',
    receiptNumber: 'REC-991236',
    time: '11:15 AM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 02',
    nozzle: 'NZ-03 (Diesel)',
    product: 'Diesel',
    litres: 18.5,
    rate: 2.05,
    total: 37.92,
    method: 'CASH',
    customer: 'Walk-in Generator Jerrycan',
    vehiclePlate: 'N/A',
    meterStart: 120481.5,
    meterEnd: 120500.0,
    status: 'REFUNDED',
  },
];

export default function SalesPage() {
  const [sales] = useState<ForecourtSale[]>(INITIAL_SALES);
  const [selectedProduct, setSelectedProduct] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedPump, setSelectedPump] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'SPLIT' | 'TABLE'>('SPLIT');
  const [selectedSale, setSelectedSale] = useState<ForecourtSale | null>(INITIAL_SALES[0]);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Compute live aggregates
  const totalVolume = useMemo(() => sales.reduce((acc, s) => acc + s.litres, 0), [sales]);
  const totalRevenue = useMemo(
    () => sales.filter((s) => s.status === 'COMPLETED').reduce((acc, s) => acc + s.total, 0),
    [sales]
  );
  const avgTicket = totalRevenue / Math.max(1, sales.filter((s) => s.status === 'COMPLETED').length);

  const tenderCounts = useMemo(() => {
    return {
      ALL: sales.length,
      CASH: sales.filter((s) => s.method === 'CASH').length,
      CARD: sales.filter((s) => s.method === 'CARD').length,
      MOBILE_MONEY: sales.filter((s) => s.method === 'MOBILE_MONEY').length,
      CREDIT: sales.filter((s) => s.method === 'CREDIT').length,
    };
  }, [sales]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return sales.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.receiptNumber.toLowerCase().includes(q) ||
        s.customer.toLowerCase().includes(q) ||
        (s.vehiclePlate && s.vehiclePlate.toLowerCase().includes(q)) ||
        s.cashier.toLowerCase().includes(q);

      const matchesProduct = selectedProduct === 'ALL' || s.product === selectedProduct;
      const matchesMethod = selectedMethod === 'ALL' || s.method === selectedMethod;
      const matchesPump = selectedPump === 'ALL' || s.pump === selectedPump;

      return matchesSearch && matchesProduct && matchesMethod && matchesPump;
    });
  }, [sales, searchQuery, selectedProduct, selectedMethod, selectedPump]);

  const handleExportCsv = () => {
    const headers = [
      'Receipt #,Timestamp,Cashier,Dispenser,Nozzle,Product,Liters,Rate/L,Total ($),Tender,Customer,Plate,Meter Start,Meter End,Status',
    ];
    const rows = filteredData.map(
      (s) =>
        `"${s.receiptNumber}","${s.time}","${s.cashier}","${s.pump}","${s.nozzle}","${s.product}",${s.litres},${s.rate},${s.total},"${s.method}","${s.customer}","${s.vehiclePlate || 'N/A'}",${s.meterStart},${s.meterEnd},"${s.status}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FuelPro_Sales_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // TanStack columns
  const columns: ColumnDef<ForecourtSale>[] = [
    {
      accessorKey: 'receiptNumber',
      header: 'Receipt #',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs">
          {row.original.receiptNumber}
        </span>
      ),
    },
    {
      accessorKey: 'time',
      header: 'Timestamp',
      cell: ({ row }) => <span className="text-gray-600 font-medium text-xs">{row.original.time}</span>,
    },
    {
      accessorKey: 'pump',
      header: 'Dispenser & Nozzle',
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold text-gray-900">{row.original.pump}</span>
          <span className="text-[10px] text-gray-400 font-mono">{row.original.nozzle}</span>
        </div>
      ),
    },
    {
      accessorKey: 'product',
      header: 'Fuel Grade',
      cell: ({ row }) => {
        const p = row.original.product;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              p === 'Petrol'
                ? 'bg-amber-100 text-amber-800'
                : p === 'Diesel'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            <Fuel className="w-3 h-3" />
            {p}
          </span>
        );
      },
    },
    {
      accessorKey: 'litres',
      header: 'Volume (L)',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-gray-900 text-xs">
          {row.original.litres.toFixed(2)} <span className="text-[10px] text-gray-400 font-normal">L</span>
        </span>
      ),
    },
    {
      accessorKey: 'rate',
      header: 'Rate / L',
      cell: ({ row }) => (
        <span className="text-gray-600 font-mono text-xs font-semibold">
          ${row.original.rate.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'total',
      header: 'Gross Total',
      cell: ({ row }) => (
        <span className="font-mono font-black text-sm text-gray-900">
          ${row.original.total.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'method',
      header: 'Tender Method',
      cell: ({ row }) => {
        const m = row.original.method;
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-gray-50 border border-gray-200 text-gray-700">
            {m === 'CASH' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
            {m === 'CARD' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
            {m === 'MOBILE_MONEY' && <Smartphone className="w-3.5 h-3.5 text-teal-600" />}
            {m === 'CREDIT' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
            {m.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      accessorKey: 'customer',
      header: 'Customer / Vehicle',
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-gray-800 truncate max-w-[140px]">{row.original.customer}</span>
          <span className="text-[10px] text-gray-400 font-mono">{row.original.vehiclePlate || 'Walk-in'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const isComp = row.original.status === 'COMPLETED';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isComp ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isComp ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedSale(row.original);
            setIsReceiptModalOpen(true);
          }}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          title="Print 80mm ESC/POS Thermal Receipt"
        >
          <Printer className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Architecture)          */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Receipt className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Forecourt Sales & Transactions
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Enterprise real-time forecourt transaction audit ledger, tender settlement reconciliation, and 80mm thermal receipts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('SPLIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'SPLIT'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Split Cockpit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Transaction Ledger</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/sales/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Sale Dispatch</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT KPI CARDS (With Sparkline Waves like Customers)         */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Gross Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Today&apos;s Gross Revenue
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  <span>↑</span> 14.8%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Across all pump islands
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

        {/* Card 2: Forecourt Throughput */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Forecourt Throughput
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  {totalVolume.toFixed(1)} <span className="text-xs font-semibold text-gray-400">L</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Active
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Total wet stock dispensed
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

        {/* Card 3: Average Ticket Size */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Average Basket Ticket
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  ${avgTicket.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md">
                  {sales.length} txns
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Per vehicle fueling event
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

        {/* Card 4: Tender Settlement Health */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Cash vs Digital Tenders
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">
                  {Math.round((tenderCounts.CASH / sales.length) * 100)}% <span className="text-xs text-gray-400">Cash</span>
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-md">
                  {Math.round(((sales.length - tenderCounts.CASH) / sales.length) * 100)}% Digital
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                POS Cards & EVC Plus Settled
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

      {/* ===================================================================== */}
      {/* 3. MULTI-FACETED FILTER & SEARCH STRIP                                */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search receipt #, customer, vehicle plate, or cashier..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tender Filter Pills */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs">
            {[
              { key: 'ALL', label: 'All Tenders', count: tenderCounts.ALL },
              { key: 'CASH', label: 'Cash', count: tenderCounts.CASH },
              { key: 'CARD', label: 'Card', count: tenderCounts.CARD },
              { key: 'MOBILE_MONEY', label: 'Mobile', count: tenderCounts.MOBILE_MONEY },
              { key: 'CREDIT', label: 'Fleet Credit', count: tenderCounts.CREDIT },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedMethod(t.key)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  selectedMethod === t.key
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{t.label}</span>
                <span className="text-[10px] font-semibold text-gray-400">({t.count})</span>
              </button>
            ))}
          </div>

          {/* Product Selector */}
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          >
            <option value="ALL">All Fuel Grades</option>
            <option value="Petrol">Petrol (Super 95)</option>
            <option value="Diesel">Diesel (AGO 50ppm)</option>
            <option value="Kerosene">Kerosene</option>
          </select>

          {/* Pump Selector */}
          <select
            value={selectedPump}
            onChange={(e) => setSelectedPump(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          >
            <option value="ALL">All Dispensers</option>
            <option value="Pump 01">Pump 01</option>
            <option value="Pump 02">Pump 02</option>
            <option value="Pump 03">Pump 03</option>
            <option value="Pump 04">Pump 04</option>
          </select>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. VIEW MODE 1: SPLIT COCKPIT (Matches Customers Cockpit Quality)      */}
      {/* ===================================================================== */}
      {viewMode === 'SPLIT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Transaction Feed Cards */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <span>Showing {filteredData.length} Recent Fueling Dispatches</span>
              <span>Click any transaction to inspect thermal voucher</span>
            </div>

            <div className="space-y-2.5">
              {filteredData.map((s) => {
                const isSelected = selectedSale?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSale(s)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-blue-50/40 border-blue-600 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          s.product === 'Petrol'
                            ? 'bg-amber-100/70 text-amber-700'
                            : s.product === 'Diesel'
                            ? 'bg-blue-100/70 text-blue-700'
                            : 'bg-purple-100/70 text-purple-700'
                        }`}
                      >
                        <Fuel className="w-5 h-5" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.2 rounded-md">
                            {s.receiptNumber}
                          </span>
                          <span className="text-xs font-bold text-gray-900">{s.customer}</span>
                          {s.vehiclePlate && s.vehiclePlate !== 'N/A' && (
                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                              {s.vehiclePlate}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2">
                          <span className="font-semibold">{s.pump}</span>
                          <span>•</span>
                          <span>{s.nozzle}</span>
                          <span>•</span>
                          <span>{s.time}</span>
                          <span>•</span>
                          <span className="text-gray-400">by {s.cashier}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-black text-sm text-gray-900">
                        ${s.total.toFixed(2)}
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-gray-500">
                        {s.litres.toFixed(2)} L @ ${s.rate.toFixed(2)}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-md mt-1 ${
                          s.method === 'CASH'
                            ? 'bg-emerald-50 text-emerald-700'
                            : s.method === 'CARD'
                            ? 'bg-blue-50 text-blue-700'
                            : s.method === 'MOBILE_MONEY'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {s.method.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredData.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs">
                  No sales transactions matched your filter parameters.
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Cols: Sticky ESC/POS Thermal Paper Receipt Cockpit */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
            {selectedSale ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-blue-600" />
                    80mm Thermal Receipt Telemetry
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>

                {/* Simulated ESC/POS Thermal Paper */}
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 font-mono text-gray-800 space-y-3 text-[11px] shadow-2xs">
                  {/* Forecourt Header */}
                  <div className="text-center space-y-0.5 border-b border-dashed border-gray-300 pb-3">
                    <div className="font-black text-sm tracking-widest text-gray-900">FUELPRO ENERGY FORECOURT</div>
                    <div className="text-[10px] text-gray-500">KM4 Roundabout Central • Mogadishu</div>
                    <div className="text-[10px] text-gray-500">Tel: +252 61 555-1111 • Tax ID: SO-992-104</div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1 text-[10px] text-gray-600 border-b border-dashed border-gray-300 pb-3">
                    <div className="flex justify-between">
                      <span>VOUCHER:</span>
                      <span className="font-bold text-gray-900">{selectedSale.receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DATE/TIME:</span>
                      <span>{selectedSale.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>OPERATOR:</span>
                      <span className="font-semibold text-gray-900">{selectedSale.cashier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DISPENSER / NOZZLE:</span>
                      <span className="font-semibold text-gray-900">{selectedSale.pump} • {selectedSale.nozzle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CUSTOMER:</span>
                      <span className="font-semibold text-gray-900 truncate max-w-[150px]">{selectedSale.customer}</span>
                    </div>
                    {selectedSale.vehiclePlate && (
                      <div className="flex justify-between">
                        <span>VEHICLE REG:</span>
                        <span className="font-bold text-blue-700">{selectedSale.vehiclePlate}</span>
                      </div>
                    )}
                  </div>

                  {/* Fuel Grade & Liters */}
                  <div className="space-y-1.5 py-1 border-b border-dashed border-gray-300 pb-3">
                    <div className="font-bold text-gray-900 text-xs flex justify-between">
                      <span>{selectedSale.product} Unleaded / AGO</span>
                      <span>${selectedSale.rate.toFixed(2)}/L</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-xs">
                      <span>Volume Lifted:</span>
                      <span className="font-black">{selectedSale.litres.toFixed(2)} Liters</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Starting Totalizer:</span>
                      <span>{selectedSale.meterStart.toFixed(2)} L</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Ending Totalizer:</span>
                      <span>{selectedSale.meterEnd.toFixed(2)} L</span>
                    </div>
                  </div>

                  {/* Total & Tender */}
                  <div className="space-y-1 pt-1 border-b border-dashed border-gray-300 pb-3">
                    <div className="flex justify-between text-xs font-black text-gray-900">
                      <span>NET AMOUNT:</span>
                      <span className="text-base text-blue-700">${selectedSale.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600">
                      <span>TENDER METHOD:</span>
                      <span className="font-bold uppercase text-gray-900">{selectedSale.method}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-emerald-700 font-bold">
                      <span>SETTLEMENT STATUS:</span>
                      <span>{selectedSale.status} (VERIFIED)</span>
                    </div>
                  </div>

                  {/* Barcode Strip */}
                  <div className="pt-2 text-center space-y-1">
                    <div className="h-8 bg-gray-900/10 rounded flex items-center justify-center font-mono text-[9px] tracking-widest text-gray-500">
                      ||| | |||| | ||| |||| | || ||| |||| |
                    </div>
                    <div className="text-[9px] text-gray-400">Electronic Custody Transfer Verified</div>
                  </div>
                </div>

                {/* Anti-Fraud Telemetry Strip */}
                <div className="p-3 bg-gray-50 rounded-2xl text-[11px] text-gray-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Weights & Measures Verification</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Flowmeter pulse calibration verified against Veeder-Root electronic custody transfer log.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center text-gray-400 text-xs">
                Select a sale transaction to inspect thermal voucher telemetry.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. VIEW MODE 2: MASTER AUDIT LEDGER (TanStack Full Width)              */}
      {/* ===================================================================== */}
      {viewMode === 'TABLE' && (
        <div className="space-y-3">
          <DataTable
            columns={columns}
            data={filteredData}
            searchPlaceholder="Filter transactions in master ledger..."
            onExportCsv={handleExportCsv}
            pageSize={10}
            emptyMessage="No sales transactions matched your filter criteria."
          />
        </div>
      )}

      {/* Modal: Receipt Pop-up (when clicking print from table) */}
      {isReceiptModalOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-bold text-gray-900 text-sm">ESC/POS Slip</span>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 font-mono text-xs space-y-2">
              <div className="text-center font-bold text-gray-900">{selectedSale.receiptNumber}</div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-black text-blue-700">${selectedSale.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Volume:</span>
                <span>{selectedSale.litres} L</span>
              </div>
              <div className="flex justify-between">
                <span>Tender:</span>
                <span>{selectedSale.method}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsReceiptModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
