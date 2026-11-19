'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Building2,
  Plus,
  GaugeCircle,
  Cylinder,
  DollarSign,
  MapPin,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  X,
  ArrowRight,
  Info,
  MoreVertical,
  Activity,
  Fuel,
  Users,
  Download,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface StationBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  status: 'ACTIVE' | 'MAINTENANCE';
  pumps: number;
  tanks: number;
  monthlySales: number;
  manager: string;
}

const INITIAL_BRANCHES: StationBranch[] = [
  {
    id: 'br-1',
    code: 'BR-CENTRAL',
    name: 'Central Station Forecourt',
    address: '450 Downtown Avenue, KM4 Roundabout',
    city: 'Mogadishu',
    phone: '+252 61 555-1111',
    status: 'ACTIVE',
    pumps: 8,
    tanks: 4,
    monthlySales: 88400,
    manager: 'David Miller',
  },
  {
    id: 'br-2',
    code: 'BR-NORTH',
    name: 'North Highway Service Station',
    address: '12 Airport Expressway North',
    city: 'Mogadishu',
    phone: '+252 61 555-2222',
    status: 'ACTIVE',
    pumps: 6,
    tanks: 3,
    monthlySales: 64200,
    manager: 'Ahmed Malik',
  },
  {
    id: 'br-3',
    code: 'BR-EAST',
    name: 'East Port Commercial Station',
    address: '88 Harbor Industrial Corridor',
    city: 'Mogadishu',
    phone: '+252 61 555-3333',
    status: 'ACTIVE',
    pumps: 6,
    tanks: 3,
    monthlySales: 79800,
    manager: 'Ibrahim Warsame',
  },
  {
    id: 'br-4',
    code: 'BR-WEST',
    name: 'West Ring Road Travel Plaza',
    address: '250 Orbital Ring Road Exit 4',
    city: 'Mogadishu',
    phone: '+252 61 555-4444',
    status: 'ACTIVE',
    pumps: 4,
    tanks: 2,
    monthlySales: 48600,
    manager: 'Hassan Nur',
  },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<StationBranch[]>(INITIAL_BRANCHES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newCode, setNewCode] = useState('BR-SOUTH');
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('+252 61 555-');
  const [newManager, setNewManager] = useState('');
  const [newPumps, setNewPumps] = useState('4');
  const [newTanks, setNewTanks] = useState('2');

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StationBranch = {
      id: `br-${Date.now()}`,
      code: newCode,
      name: newName || 'New Station Forecourt',
      address: newAddress || 'Main Road',
      city: 'Mogadishu',
      phone: newPhone,
      status: 'ACTIVE',
      pumps: parseInt(newPumps) || 4,
      tanks: parseInt(newTanks) || 2,
      monthlySales: 0,
      manager: newManager || 'Assigned Manager',
    };
    setBranches([...branches, created]);
    setIsAddModalOpen(false);
  };

  // TanStack columns
  const columns: ColumnDef<StationBranch>[] = [
    {
      accessorKey: 'code',
      header: 'Station Code',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Forecourt Station Title',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.original.name}</span>
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {row.original.address}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'pumps',
      header: 'Dispensers',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-800 flex items-center gap-1">
          <GaugeCircle className="w-3.5 h-3.5 text-blue-600" />
          {row.original.pumps} Pumps
        </span>
      ),
    },
    {
      accessorKey: 'tanks',
      header: 'Underground Tanks',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-800 flex items-center gap-1">
          <Cylinder className="w-3.5 h-3.5 text-emerald-600" />
          {row.original.tanks} USTs
        </span>
      ),
    },
    {
      accessorKey: 'monthlySales',
      header: 'Monthly Throughput ($)',
      cell: ({ row }) => (
        <span className="font-extrabold text-gray-900 font-mono text-sm">
          ${row.original.monthlySales.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'manager',
      header: 'Station Manager',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{row.original.manager}</span>
          <span className="text-[11px] text-gray-400">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Operating State',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          24/7 ACTIVE
        </span>
      ),
    },
  ];

  const totalPumpsNetwork = branches.reduce((acc, b) => acc + b.pumps, 0);
  const totalTanksNetwork = branches.reduce((acc, b) => acc + b.tanks, 0);
  const totalMonthlySalesNetwork = branches.reduce((acc, b) => acc + b.monthlySales, 0);

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Standard)             */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Fuel Station Branches & Multi-Site Network
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Enterprise management of central forecourt stations, regional travel plazas, and hardware assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Station Code,Station Name,Address,City,Phone,Status,Dispensers,UST Tanks,Monthly Sales ($),Manager'];
              const rows = branches.map(
                (b) => `"${b.code}","${b.name}","${b.address}","${b.city}","${b.phone}","${b.status}",${b.pumps},${b.tanks},${b.monthlySales},"${b.manager}"`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Station_Branches_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/branches/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register Station Branch</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT NETWORK KPI CARDS (With Sparkline Waves)               */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Operating Station Forecourts */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Operating Stations
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{branches.length} Sites</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Active 24/7
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Mogadishu & Highway plazas
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

        {/* Card 2: Network Dispensers Total */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <GaugeCircle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Network Dispensers
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{totalPumpsNetwork} Pumps</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md">
                  Online
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Multi-nozzle forecourt bays
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

        {/* Card 3: Network UST Storage Tanks */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Cylinder className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Underground Tanks
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{totalTanksNetwork} Tanks</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                  Veeder-Root
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Double-wall fiberglass storage
              </span>
            </div>
          </div>
          {/* Amber Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-amber-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 18C12 18 16 26 26 22C36 18 42 8 52 8C58 8 62 14 68 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Network Combined Sales */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Network Monthly Sales
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  ${totalMonthlySalesNetwork.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  +18.3%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Consolidated throughput
              </span>
            </div>
          </div>
          {/* Emerald Wave Graphic */}
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

      {/* Multi-Site Forecourt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {b.code}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  Active 24/7
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-sm mt-1">{b.name}</h3>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 mb-4 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{b.address}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs">
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-gray-400 font-medium">Dispensers</div>
                  <div className="font-bold text-gray-800">{b.pumps} Pumps</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-gray-400 font-medium">UST Storage</div>
                  <div className="font-bold text-gray-800">{b.tanks} Tanks</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-gray-400">Station Manager</div>
                <div className="font-bold text-gray-800">{b.manager}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400">Monthly Sales</div>
                <div className="font-bold font-mono text-gray-900">${(b.monthlySales / 1000).toFixed(1)}k</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Station Network Asset Directory</h2>
          <p className="text-xs text-gray-500 font-medium">
            Forecourt physical locations, equipment allocation, and retail performance.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={branches}
          searchPlaceholder="Search branch code, station title, or city..."
          pageSize={10}
          emptyMessage="No station branches registered."
        />
      </div>

      {/* Modal: Register Station */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Register Station Branch</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    defaultValue="Mogadishu"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Station Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Mogadishu Travel Plaza"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street / Highway junction"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dispenser Pumps</label>
                  <input
                    type="number"
                    required
                    value={newPumps}
                    onChange={(e) => setNewPumps(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">UST Tanks</label>
                  <input
                    type="number"
                    required
                    value={newTanks}
                    onChange={(e) => setNewTanks(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Station Manager Name</label>
                <input
                  type="text"
                  required
                  placeholder="Manager name"
                  value={newManager}
                  onChange={(e) => setNewManager(e.target.value)}
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
                  Register Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
