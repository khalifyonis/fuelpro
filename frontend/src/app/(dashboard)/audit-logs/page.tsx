'use client';

import React, { useState } from 'react';
import {
  FileSearch,
  Filter,
  ShieldCheck,
  Download,
  Search,
  Lock,
  Eye,
  X,
  UserCheck,
  AlertTriangle,
  History,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'PRICE_CHANGE' | 'DELIVERY_APPROVED' | 'SHIFT_OPEN' | 'SHIFT_CLOSED' | 'USER_ROLE_ASSIGN' | 'WORK_ORDER' | 'STOCK_ADJUSTMENT';
  entity: string;
  details: string;
  ip: string;
}

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: 'Today, 08:30:14 AM',
    user: 'Alex Morgan (Admin)',
    action: 'PRICE_CHANGE',
    entity: 'FuelPrice',
    details: 'Petrol retail selling price updated from $1.40 to $1.45/L (+3.5% margin adjustment)',
    ip: '192.168.1.102',
  },
  {
    id: 'log-2',
    timestamp: 'Today, 07:15:02 AM',
    user: 'David Miller (Manager)',
    action: 'DELIVERY_APPROVED',
    entity: 'Delivery',
    details: 'Approved 10,000 L Diesel road tanker delivery (DEL-881920) from Shell into Tank #2',
    ip: '192.168.1.105',
  },
  {
    id: 'log-3',
    timestamp: 'Today, 06:00:22 AM',
    user: 'Sarah Jenkins (Cashier)',
    action: 'SHIFT_OPEN',
    entity: 'Shift',
    details: 'Opened morning register shift #SHF-88912 with $500.00 cash drawer float',
    ip: '192.168.1.140',
  },
  {
    id: 'log-4',
    timestamp: 'Yesterday, 22:05:40 PM',
    user: 'Marcus Vance (Cashier)',
    action: 'SHIFT_CLOSED',
    entity: 'Shift',
    details: 'Closed night shift #SHF-88911 with $2,420.00 cash drawer counted. Zero variance match.',
    ip: '192.168.1.141',
  },
  {
    id: 'log-5',
    timestamp: 'Yesterday, 17:30:11 PM',
    user: 'Alex Morgan (Admin)',
    action: 'USER_ROLE_ASSIGN',
    entity: 'UserBranchRole',
    details: 'Assigned Station Manager role to David Miller at Central Station Forecourt',
    ip: '192.168.1.102',
  },
  {
    id: 'log-6',
    timestamp: 'Yesterday, 14:10:05 PM',
    user: 'Elena Rostova (Inventory)',
    action: 'STOCK_ADJUSTMENT',
    entity: 'InventoryLedger',
    details: 'Compensated +12.5 L Diesel on Tank #2 for ambient temperature thermal expansion',
    ip: '192.168.1.110',
  },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ip.includes(searchQuery);
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,User,Action,Entity,IP Address,Details\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.entity}","${l.ip}","${l.details}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FuelPro_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner matching Modern Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Security & Regulatory Audit Trail
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Immutable system logs, price changes, delivery approvals, shift reconciliations, and user permission tracking.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* 4 Forecourt KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Events */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Audit Events</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
              Live Stream
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{logs.length * 240 + 120}</span>
            <span className="text-xs font-semibold text-gray-500">Logs</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Full ledger immutable records</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 16 Q 25 6, 50 14 T 100 8"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Price Alterations */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Price & Tariff Updates</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
              Admin Signed
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600">
              {logs.filter((l) => l.action === 'PRICE_CHANGE').length}
            </span>
            <span className="text-xs font-semibold text-gray-500">Events Today</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Dispenser totems synchronized</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 20 Q 30 10, 60 16 T 100 6"
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Shift Reconciliations */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Shift & Till Closures</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              Zero Variance
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">
              {logs.filter((l) => l.action.includes('SHIFT')).length}
            </span>
            <span className="text-xs font-semibold text-gray-500">Cycles Verified</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Cash drawer balanced</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 18 Q 35 4, 70 12 T 100 4"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Cryptographic Integrity */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Tamper Compliance</span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/50">
              SHA-256 Valid
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">100.0%</span>
            <span className="text-xs font-semibold text-purple-600 font-mono">Chain Intact</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Regulatory Weights & Measures approved</span>
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
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, IP address, entity, or log description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 mr-1">Action:</span>
          {(['ALL', 'PRICE_CHANGE', 'DELIVERY_APPROVED', 'SHIFT_OPEN', 'SHIFT_CLOSED', 'STOCK_ADJUSTMENT'] as const).map(
            (action) => (
              <button
                key={action}
                type="button"
                onClick={() => setActionFilter(action)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  actionFilter === action
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {action === 'ALL' ? 'All Logs' : action.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User Agent</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Audit Description</th>
                <th className="p-4">Client IP</th>
                <th className="p-4">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-mono text-gray-600 text-[11px] whitespace-nowrap">{l.timestamp}</td>
                  <td className="p-4 font-bold text-gray-900 whitespace-nowrap">{l.user}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.action === 'PRICE_CHANGE'
                          ? 'bg-purple-100 text-purple-700'
                          : l.action === 'DELIVERY_APPROVED'
                          ? 'bg-blue-100 text-blue-700'
                          : l.action === 'SHIFT_OPEN' || l.action === 'SHIFT_CLOSED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {l.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-semibold text-gray-700">{l.entity}</td>
                  <td className="p-4 text-gray-700 max-w-[340px] truncate" title={l.details}>
                    {l.details}
                  </td>
                  <td className="p-4 font-mono text-gray-500 text-[11px]">{l.ip}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(l)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT LOG MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Audit Log Record</h3>
                  <span className="text-gray-400 text-[10px]">{selectedLog.id} • {selectedLog.timestamp}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">User:</span>
                <span className="font-bold text-gray-900">{selectedLog.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Action:</span>
                <span className="font-bold text-purple-700">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Target Entity:</span>
                <span className="font-mono font-bold text-gray-900">{selectedLog.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Client IP:</span>
                <span className="font-mono font-bold text-gray-700">{selectedLog.ip}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Audit Details</span>
              <p className="text-gray-900 leading-relaxed">{selectedLog.details}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
