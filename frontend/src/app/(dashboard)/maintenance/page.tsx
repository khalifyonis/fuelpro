'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MoreVertical,
  X,
  Gauge,
  Flame,
  ShieldCheck,
  CheckSquare,
  Square,
  Clock,
  Sparkles,
  ShieldAlert,
  Download,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface WorkOrder {
  id: string;
  orderNumber: string;
  equipment: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'SAFETY';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  assignedTo: string;
  scheduledDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

const INITIAL_ORDERS: WorkOrder[] = [
  {
    id: 'wo-1',
    orderNumber: 'WO-8812',
    equipment: 'Dispenser Pump 02 (Nozzle 2-B)',
    type: 'CORRECTIVE',
    priority: 'HIGH',
    description: 'Replace worn breakaway valve & slow hose retractor spring',
    assignedTo: 'Forecourt Tech Team',
    scheduledDate: 'Today',
    status: 'IN_PROGRESS',
  },
  {
    id: 'wo-2',
    orderNumber: 'WO-8811',
    equipment: 'UST-01 Automatic Tank Gauge Probe',
    type: 'CALIBRATION',
    priority: 'MEDIUM',
    description: 'Quarterly weights & measures electronic volume calibration',
    assignedTo: 'Apex Petroleum Techs',
    scheduledDate: 'Nov 20, 2026',
    status: 'OPEN',
  },
  {
    id: 'wo-3',
    orderNumber: 'WO-8810',
    equipment: 'Main Canopy High-Bay LED Lights',
    type: 'PREVENTIVE',
    priority: 'LOW',
    description: 'Replaced ballast and two 150W explosion-proof LED fixtures',
    assignedTo: 'Local Electrician',
    scheduledDate: 'Nov 14, 2026',
    status: 'COMPLETED',
  },
  {
    id: 'wo-4',
    orderNumber: 'WO-8809',
    equipment: 'Underground Sump Sensor 3',
    type: 'SAFETY',
    priority: 'HIGH',
    description: 'Annual hydrostatic spill containment testing & seal certification',
    assignedTo: 'Environmental Safety Audit',
    scheduledDate: 'Nov 10, 2026',
    status: 'COMPLETED',
  },
];

interface SafetyItem {
  id: string;
  label: string;
  category: string;
  passed: boolean;
}

const INITIAL_SAFETY: SafetyItem[] = [
  { id: 'sc-1', label: 'Canopy Emergency Stop (ESD) push buttons tested & operational', category: 'Emergency', passed: true },
  { id: 'sc-2', label: 'Dry chemical powder fire extinguishers pressure gauges in green zone', category: 'Fire Safety', passed: true },
  { id: 'sc-3', label: 'Ground earthing bonding clamp resistance verified below 10 Ohms', category: 'Electrical', passed: true },
  { id: 'sc-4', label: 'Forecourt sand buckets dry & hydrocarbon absorbent spill kit stocked', category: 'Spill Control', passed: true },
  { id: 'sc-5', label: 'Dispenser nozzle automatic shutoff trip tested on splash check', category: 'Dispensers', passed: true },
  { id: 'sc-6', label: 'Vapor recovery stage II vacuum suction pump functioning', category: 'Environmental', passed: false },
];

export default function MaintenancePage() {
  const [orders, setOrders] = useState<WorkOrder[]>(INITIAL_ORDERS);
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>(INITIAL_SAFETY);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Form states
  const [newEquipment, setNewEquipment] = useState('Dispenser Pump 01');
  const [newType, setNewType] = useState<WorkOrder['type']>('CORRECTIVE');
  const [newPriority, setNewPriority] = useState<WorkOrder['priority']>('HIGH');
  const [newDesc, setNewDesc] = useState('');
  const [newAssigned, setNewAssigned] = useState('Forecourt Tech Team');

  const handleToggleSafety = (id: string) => {
    setSafetyItems(
      safetyItems.map((item) =>
        item.id === id ? { ...item, passed: !item.passed } : item
      )
    );
  };

  const passedCount = safetyItems.filter((i) => i.passed).length;
  const complianceScore = Math.round((passedCount / safetyItems.length) * 100);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const created: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      equipment: newEquipment,
      type: newType,
      priority: newPriority,
      description: newDesc,
      assignedTo: newAssigned,
      scheduledDate: 'Today (Immediate)',
      status: 'OPEN',
    };
    setOrders([created, ...orders]);
    setIsOrderModalOpen(false);
    setNewDesc('');
  };

  // TanStack columns
  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Work Order #',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.orderNumber}
        </span>
      ),
    },
    {
      accessorKey: 'equipment',
      header: 'Equipment Asset Tag',
      cell: ({ row }) => (
        <span className="font-bold text-gray-900">{row.original.equipment}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Maintenance Class',
      cell: ({ row }) => (
        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const p = row.original.priority;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${p === 'HIGH'
              ? 'bg-red-50 text-red-700'
              : p === 'MEDIUM'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-blue-50 text-blue-700'
              }`}
          >
            {p}
          </span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Fault Narrative / Action Required',
      cell: ({ row }) => <span className="text-gray-700 text-xs font-medium">{row.original.description}</span>,
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned Crew',
      cell: ({ row }) => <span className="text-gray-600 text-xs">{row.original.assignedTo}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Order State',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${s === 'IN_PROGRESS'
              ? 'bg-amber-100 text-amber-800 animate-pulse'
              : s === 'COMPLETED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-blue-50 text-blue-700'
              }`}
          >
            {s.replace('_', ' ')}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Architecture)          */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Wrench className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Forecourt Equipment Maintenance & Safety
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Daily NFPA forecourt safety checklists, dispenser work orders, and emergency shut-off tests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Order #,Equipment,Type,Priority,Description,Assigned To,Scheduled,Status'];
              const rows = orders.map(
                (o) => `"${o.orderNumber}","${o.equipment}","${o.type}","${o.priority}","${o.description}","${o.assignedTo}","${o.scheduledDate}","${o.status}"`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Maintenance_WorkOrders_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/maintenance/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Work Order</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT SAFETY & MAINTENANCE KPI CARDS (With Sparkline Waves)  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Safety Compliance Score */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Daily Safety Compliance
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{complianceScore}%</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  {passedCount}/{safetyItems.length} Passed
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                NFPA 30A Forecourt Safety
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

        {/* Card 2: Open Work Orders */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Active Work Orders
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{orders.filter((o) => o.status !== 'COMPLETED').length} Active</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                  In Progress
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Dispensers & ATG probe tickets
              </span>
            </div>
          </div>
          {/* Orange Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-orange-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 20C10 20 18 6 28 6C38 6 44 24 54 18C60 14 64 6 68 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: ESD Emergency Shutoffs */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Emergency Shutoff (ESD)
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">100% Tested</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Armed
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Cashier & forecourt buttons operational
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

        {/* Card 4: Weights & Measures Calibration Status */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Weights & Measures Seals
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">Valid</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md">
                  Quarterly
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Next calibration in 42 days
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

      {/* Daily Forecourt Safety Compliance Cockpit */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Daily Forecourt Safety Inspection Checklist</h3>
              <p className="text-xs text-gray-500 font-medium">
                Mandatory health, safety, and fire compliance verification before opening shifts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Compliance Score</div>
              <div className="text-lg font-black text-gray-900">{complianceScore}% Passed</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xs font-black text-emerald-700">
              {passedCount}/{safetyItems.length}
            </div>
          </div>
        </div>

        {/* Safety checklist item grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {safetyItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggleSafety(item.id)}
              className={`p-3 rounded-2xl border text-left flex items-start justify-between gap-3 transition-colors ${item.passed
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                : 'bg-red-50/50 border-red-200 text-red-950'
                }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-gray-600 border border-gray-100">
                  {item.category}
                </span>
                <div className="text-xs font-semibold leading-snug">{item.label}</div>
              </div>
              <div className="shrink-0 mt-0.5">
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Work Orders TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Equipment Work Orders & Corrective Maintenance</h2>
          <p className="text-xs text-gray-500 font-medium">
            Active technician tickets for dispensers, submersible turbine pumps (STP), and forecourt lighting.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          searchPlaceholder="Search work order #, equipment, or fault..."
          pageSize={10}
          emptyMessage="No equipment work orders recorded."
        />
      </div>

      {/* Modal: Create Work Order */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900 text-sm">Issue Maintenance Work Order</h3>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Equipment Asset Tag</label>
                <input
                  type="text"
                  required
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Order Class</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="CORRECTIVE">Corrective Repair</option>
                    <option value="PREVENTIVE">Preventive Maintenance</option>
                    <option value="CALIBRATION">Weights & Calibration</option>
                    <option value="SAFETY">Safety Audit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="HIGH">High (Immediate)</option>
                    <option value="MEDIUM">Medium (Scheduled)</option>
                    <option value="LOW">Low (Routine)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fault Description & Scope</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe failure symptoms, leaking nozzle, calibration error..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Technician / Crew</label>
                <input
                  type="text"
                  required
                  value={newAssigned}
                  onChange={(e) => setNewAssigned(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
