'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Clock,
  Plus,
  CheckCircle2,
  Lock,
  AlertCircle,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Check,
  X,
  CreditCard,
  Smartphone,
  Eye,
  FileText,
  ShieldCheck,
  AlertTriangle,
  MoreVertical,
  Info,
  Banknote,
  Gauge,
  UserCheck,
  Download,
  Fuel,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface ForecourtShift {
  id: string;
  shiftNumber: string;
  cashier: string;
  shiftType: 'Morning' | 'Afternoon' | 'Night';
  startTime: string;
  endTime: string;
  status: 'OPEN' | 'CLOSED';
  assignedPumps: string;
  openingCash: number;
  expectedCash: number;
  actualCash: number;
  variance: number;
  totalSales: number;
  transactions: number;
  momo: number;
  card: number;
  notes: string;
  reconciledBy: string;
}

const INITIAL_SHIFTS: ForecourtShift[] = [
  {
    id: 'sh1',
    shiftNumber: 'SHF-88912',
    cashier: 'Sarah Jenkins',
    shiftType: 'Morning',
    startTime: 'Today, 06:00 AM',
    endTime: 'In Progress (Elapsed 8h 22m)',
    status: 'OPEN',
    assignedPumps: 'Islands 1 & 2 (Pumps 01-04)',
    openingCash: 500,
    expectedCash: 1250,
    actualCash: 0,
    variance: 0,
    totalSales: 4250.8,
    transactions: 94,
    momo: 980.0,
    card: 1520.8,
    notes: 'Active morning forecourt register. All pumps operational.',
    reconciledBy: 'Pending Closure',
  },
  {
    id: 'sh2',
    shiftNumber: 'SHF-88911',
    cashier: 'Marcus Vance',
    shiftType: 'Night',
    startTime: 'Yesterday, 22:00 PM',
    endTime: 'Today, 06:00 AM',
    status: 'CLOSED',
    assignedPumps: 'Islands 1, 2, 3 (Pumps 01-06)',
    openingCash: 500,
    expectedCash: 2420,
    actualCash: 2420,
    variance: 0,
    totalSales: 7890.5,
    transactions: 165,
    momo: 1840.0,
    card: 3630.5,
    notes: 'Night shift handed over smoothly. Exact cash drawer balance.',
    reconciledBy: 'David Miller (Manager)',
  },
  {
    id: 'sh3',
    shiftNumber: 'SHF-88910',
    cashier: 'Abdi Hassan',
    shiftType: 'Afternoon',
    startTime: 'Yesterday, 14:00 PM',
    endTime: 'Yesterday, 22:00 PM',
    status: 'CLOSED',
    assignedPumps: 'Islands 1 & 2 (Pumps 01-04)',
    openingCash: 500,
    expectedCash: 1980,
    actualCash: 1970,
    variance: -10,
    totalSales: 5420.0,
    transactions: 112,
    momo: 1450.0,
    card: 1990.0,
    notes: 'Minor $10 shortage verified in till float. Accepted by supervisor.',
    reconciledBy: 'David Miller (Manager)',
  },
  {
    id: 'sh4',
    shiftNumber: 'SHF-88909',
    cashier: 'Sarah Jenkins',
    shiftType: 'Morning',
    startTime: '2 days ago, 06:00 AM',
    endTime: '2 days ago, 14:00 PM',
    status: 'CLOSED',
    assignedPumps: 'Islands 1 & 2 (Pumps 01-04)',
    openingCash: 500,
    expectedCash: 1640,
    actualCash: 1640,
    variance: 0,
    totalSales: 4890.2,
    transactions: 104,
    momo: 1120.0,
    card: 2130.2,
    notes: 'Balanced register handover.',
    reconciledBy: 'David Miller (Manager)',
  },
];

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<ForecourtShift[]>(INITIAL_SHIFTS);
  const [isOpenShiftModal, setIsOpenShiftModal] = useState(false);
  const [isCloseShiftModal, setIsCloseShiftModal] = useState(false);
  const [selectedShiftForClose, setSelectedShiftForClose] = useState<ForecourtShift | null>(null);

  // Close shift form inputs
  const [countedCash, setCountedCash] = useState('');
  const [handoverNotes, setHandoverNotes] = useState('');
  const [supervisorPin, setSupervisorPin] = useState('');

  // Start shift form inputs
  const [newShiftCashier, setNewShiftCashier] = useState('Abdi Hassan');
  const [newShiftType, setNewShiftType] = useState<'Morning' | 'Afternoon' | 'Night'>('Afternoon');
  const [openingFloat, setOpeningFloat] = useState('500');

  const activeShift = shifts.find((s) => s.status === 'OPEN');

  const handleStartShift = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ForecourtShift = {
      id: `sh-${Date.now()}`,
      shiftNumber: `SHF-${Math.floor(10000 + Math.random() * 90000)}`,
      cashier: newShiftCashier,
      shiftType: newShiftType,
      startTime: 'Just now',
      endTime: 'In Progress',
      status: 'OPEN',
      assignedPumps: 'Islands 1 & 2 (Pumps 01-04)',
      openingCash: parseFloat(openingFloat) || 500,
      expectedCash: parseFloat(openingFloat) || 500,
      actualCash: 0,
      variance: 0,
      totalSales: 0,
      transactions: 0,
      momo: 0,
      card: 0,
      notes: 'Fresh shift opened with verified float.',
      reconciledBy: 'Active Session',
    };
    setShifts([created, ...shifts]);
    setIsOpenShiftModal(false);
  };

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShiftForClose) return;

    const counted = parseFloat(countedCash) || 0;
    const variance = counted - selectedShiftForClose.expectedCash;

    setShifts(
      shifts.map((s) =>
        s.id === selectedShiftForClose.id
          ? {
              ...s,
              status: 'CLOSED',
              endTime: 'Just now (Handed Over)',
              actualCash: counted,
              variance: variance,
              notes: handoverNotes || 'Shift closed & blind counted.',
              reconciledBy: 'Supervisor Verified',
            }
          : s
      )
    );
    setIsCloseShiftModal(false);
    setSelectedShiftForClose(null);
    setCountedCash('');
  };

  // TanStack table columns
  const columns: ColumnDef<ForecourtShift>[] = [
    {
      accessorKey: 'shiftNumber',
      header: 'Shift Code',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.shiftNumber}
        </span>
      ),
    },
    {
      accessorKey: 'cashier',
      header: 'Duty Cashier',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>{row.original.cashier}</span>
        </div>
      ),
    },
    {
      accessorKey: 'shiftType',
      header: 'Shift Window',
      cell: ({ row }) => {
        const t = row.original.shiftType;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
              t === 'Morning'
                ? 'bg-amber-50 text-amber-700'
                : t === 'Afternoon'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-purple-50 text-purple-700'
            }`}
          >
            {t} Shift
          </span>
        );
      },
    },
    {
      accessorKey: 'startTime',
      header: 'Duration & Timeline',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{row.original.startTime}</span>
          <span className="text-[11px] text-gray-400">{row.original.endTime}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalSales',
      header: 'Shift Gross',
      cell: ({ row }) => (
        <span className="font-extrabold text-gray-900">${row.original.totalSales.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'expectedCash',
      header: 'Expected Cash',
      cell: ({ row }) => (
        <span className="font-bold text-gray-800">${row.original.expectedCash.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'variance',
      header: 'Cash Drawer Variance',
      cell: ({ row }) => {
        if (row.original.status === 'OPEN') {
          return <span className="text-gray-400 font-medium italic">Shift Active</span>;
        }
        const v = row.original.variance;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
              v === 0
                ? 'bg-emerald-50 text-emerald-700'
                : v < 0
                ? 'bg-red-50 text-red-700'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {v === 0 ? 'Exact Match ($0)' : v < 0 ? `-$${Math.abs(v)} Short` : `+$${v} Over`}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const isOpen = row.original.status === 'OPEN';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isOpen ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            {isOpen ? 'ACTIVE OPEN' : 'RECONCILED'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        if (row.original.status === 'OPEN') {
          return (
            <button
              onClick={() => {
                setSelectedShiftForClose(row.original);
                setIsCloseShiftModal(true);
              }}
              className="px-2.5 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors"
            >
              Handover & Close
            </button>
          );
        }
        return (
          <span className="text-gray-400 text-[11px] font-medium">
            {row.original.reconciledBy}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Quality)                     */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Clock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Cashier Shifts & Forecourt Handover
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Forecourt dispenser meter reading audit, blind cash drawer till float, and supervisor reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Shift #,Cashier,Type,Start,End,Status,Pumps,Opening Cash,Expected Cash,Actual Cash,Variance,Total Sales,Txns,Reconciled By'];
              const rows = shifts.map(
                (s) => `"${s.shiftNumber}","${s.cashier}","${s.shiftType}","${s.startTime}","${s.endTime}","${s.status}","${s.assignedPumps}",${s.openingCash},${s.expectedCash},${s.actualCash},${s.variance},${s.totalSales},${s.transactions},"${s.reconciledBy}"`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Shifts_Audit_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/shifts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Open New Shift</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT SHIFT KPI CARDS (With Sparkline Waves)                  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Duty Shift */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Current Duty Shift
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-black text-gray-900">
                  {activeShift ? activeShift.cashier : 'No Active Shift'}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Live
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                {activeShift ? `${activeShift.shiftType} Shift • ${activeShift.shiftNumber}` : 'Register Closed'}
              </span>
            </div>
          </div>
          {/* Amber Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-amber-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 24C12 24 16 12 26 12C36 12 40 20 50 14C56 9 62 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Expected Cash in Drawer */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Expected Cash Till Float
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  ${activeShift ? activeShift.expectedCash.toFixed(2) : '0.00'}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Float: $500
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Subject to blind reconciliation
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

        {/* Card 3: Shift Gross Fuel Lifted */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Shift Gross Lifted
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  ${activeShift ? activeShift.totalSales.toFixed(2) : '0.00'}
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-md">
                  {activeShift ? `${activeShift.transactions} txns` : '0 txns'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Across 4 assigned dispensers
              </span>
            </div>
          </div>
          {/* Blue Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-blue-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 18C12 18 16 26 26 22C36 18 42 8 52 8C58 8 62 14 68 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Historical Reconciliation Accuracy */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Till Variance Accuracy
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">
                  99.8%
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Pass
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Supervisor audit compliance
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

      {/* Active Shift Forecourt Cockpit */}
      {activeShift ? (
        <div className="bg-linear-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Shift Duty Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-white animate-pulse">
                  LIVE ON DUTY
                </span>
                <span className="font-mono text-xs text-blue-200">{activeShift.shiftNumber}</span>
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                {activeShift.cashier}
                <span className="text-sm font-normal text-blue-200">({activeShift.shiftType} Shift)</span>
              </h2>
              <div className="text-xs text-blue-200 flex items-center gap-4">
                <span>Clocked in: {activeShift.startTime}</span>
                <span>•</span>
                <span>Assigned: {activeShift.assignedPumps}</span>
              </div>
            </div>

            {/* Shift Tender Breakdown Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-[10px] text-blue-200 font-medium uppercase">Expected Cash Till</div>
                <div className="text-lg font-black text-white">${activeShift.expectedCash.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-300">Float: ${activeShift.openingCash}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-[10px] text-blue-200 font-medium uppercase">POS Cards</div>
                <div className="text-lg font-black text-white">${activeShift.card.toFixed(2)}</div>
                <div className="text-[10px] text-blue-200">Electronic</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-[10px] text-blue-200 font-medium uppercase">Mobile Money</div>
                <div className="text-lg font-black text-white">${activeShift.momo.toFixed(2)}</div>
                <div className="text-[10px] text-teal-300">EVC / Zaad</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-[10px] text-blue-200 font-medium uppercase">Transactions</div>
                <div className="text-lg font-black text-white">{activeShift.transactions} txns</div>
                <div className="text-[10px] text-blue-200">${activeShift.totalSales.toFixed(2)} Gross</div>
              </div>
            </div>

            {/* Handover Action Button */}
            <button
              onClick={() => {
                setSelectedShiftForClose(activeShift);
                setIsCloseShiftModal(true);
              }}
              className="self-start lg:self-center flex items-center gap-2 px-5 py-3 text-xs font-black text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-2xl transition-all shadow-lg shrink-0"
            >
              <Lock className="w-4 h-4" />
              <span>Close Shift & Blind Drop</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <h3 className="font-bold text-sm">No Active Shift Clocked In</h3>
              <p className="text-xs text-amber-700">Open a shift register to begin forecourt fueling and cash collection.</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpenShiftModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
          >
            Clock In Shift
          </button>
        </div>
      )}

      {/* Forecourt Pump Dispenser Meter Totalizer Dials (Opening vs Closing) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Dispenser Nozzle Totalizer Meters</h3>
            <p className="text-xs text-gray-500 font-medium">Mechanical/electronic counter readings for this duty shift.</p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            4 Nozzles Audited
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>Pump 01 - Nozzle 1</span>
              <span className="text-emerald-600 font-bold">Petrol</span>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Opening:</span> <span>184,200.0 L</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold">
                <span>Current:</span> <span>184,549.2 L</span>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex justify-between text-xs font-black text-blue-600">
              <span>Shift Volume:</span>
              <span>349.2 L</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>Pump 02 - Nozzle 3</span>
              <span className="text-amber-600 font-bold">Diesel</span>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Opening:</span> <span>120,220.0 L</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold">
                <span>Current:</span> <span>120,580.0 L</span>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex justify-between text-xs font-black text-blue-600">
              <span>Shift Volume:</span>
              <span>360.0 L</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>Pump 03 - Nozzle 5</span>
              <span className="text-amber-600 font-bold">Diesel</span>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Opening:</span> <span>93,850.0 L</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold">
                <span>Current:</span> <span>94,232.0 L</span>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex justify-between text-xs font-black text-blue-600">
              <span>Shift Volume:</span>
              <span>382.0 L</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>Pump 04 - Nozzle 7</span>
              <span className="text-indigo-600 font-bold">Kerosene</span>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Opening:</span> <span>34,080.0 L</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold">
                <span>Current:</span> <span>34,115.0 L</span>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex justify-between text-xs font-black text-blue-600">
              <span>Shift Volume:</span>
              <span>35.0 L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shift History & Reconciliation Ledger TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Shift Handover Audit Ledger</h2>
          <p className="text-xs text-gray-500 font-medium">
            Historical shift records with blind till counts, meter audit diffs, and supervisor sign-offs.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={shifts}
          searchPlaceholder="Search shift code, cashier, or date..."
          pageSize={10}
          emptyMessage="No shift records found."
        />
      </div>

      {/* Modal: Open Shift */}
      {isOpenShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Clock In Forecourt Shift</h3>
              </div>
              <button
                onClick={() => setIsOpenShiftModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartShift} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Duty Cashier</label>
                <input
                  type="text"
                  required
                  value={newShiftCashier}
                  onChange={(e) => setNewShiftCashier(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Shift Type</label>
                <select
                  value={newShiftType}
                  onChange={(e) => setNewShiftType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                >
                  <option value="Morning">Morning Shift (06:00 - 14:00)</option>
                  <option value="Afternoon">Afternoon Shift (14:00 - 22:00)</option>
                  <option value="Night">Night Shift (22:00 - 06:00)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Opening Cash Float ($)</label>
                <input
                  type="number"
                  required
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Standard change till float is $500.00.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpenShiftModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Start Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Blind Cash Drop & Close Shift */}
      {isCloseShiftModal && selectedShiftForClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900 text-sm">Blind Cash Drop & Handover</h3>
              </div>
              <button
                onClick={() => setIsCloseShiftModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCloseShift} className="space-y-3.5 text-xs">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                <div className="font-bold">Shift: {selectedShiftForClose.shiftNumber}</div>
                <div className="text-[11px]">Cashier: {selectedShiftForClose.cashier}</div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Actual Counted Cash Till ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Enter physical cash in drawer"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-lg text-gray-900 focus:bg-white"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Blind count: enter exact counted notes & coins without rounding.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Handover Notes</label>
                <textarea
                  rows={2}
                  placeholder="Note any dispenser issues, power outages, or float changes..."
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Supervisor PIN / Authorization</label>
                <input
                  type="password"
                  required
                  placeholder="Enter manager PIN"
                  value={supervisorPin}
                  onChange={(e) => setSupervisorPin(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCloseShiftModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Submit & Reconcile Till
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
