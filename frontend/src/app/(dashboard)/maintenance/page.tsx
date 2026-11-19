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
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              p === 'HIGH'
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
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              s === 'IN_PROGRESS'
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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100/70 text-orange-700 flex items-center justify-center shrink-0 shadow-xs">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Forecourt Equipment Maintenance & Safety
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Daily NFPA forecourt safety checklists, dispenser work orders, and emergency shut-off tests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/maintenance/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Work Order</span>
          </Link>
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
              className={`p-3 rounded-2xl border text-left flex items-start justify-between gap-3 transition-colors ${
                item.passed
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
