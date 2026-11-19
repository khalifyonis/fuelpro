'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Truck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Search,
  Filter,
  Check,
  X,
  Droplet,
  Clock,
  Eye,
  MoreVertical,
  ArrowRight,
  Info,
  Shield,
  Layers,
  Fuel,
  Download,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface TankerDelivery {
  id: string;
  deliveryNumber: string;
  supplier: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  targetTankCode: string;
  date: string;
  truckNumber: string;
  driverName: string;
  sealNumber: string;
  expectedQuantity: number;
  receivedQuantity: number;
  variance: number;
  preDipMm: number;
  postDipMm: number;
  temperatureC: number;
  density: number;
  status: 'APPROVED' | 'OFFLOADING' | 'PENDING_INSPECTION' | 'REJECTED';
  verifiedBy: string;
}

const INITIAL_DELIVERIES: TankerDelivery[] = [
  {
    id: 'd1',
    deliveryNumber: 'DEL-881920',
    supplier: 'Hass Petroleum Supply',
    product: 'Diesel',
    targetTankCode: 'UST-02',
    date: 'Today, 14:15 PM',
    truckNumber: 'TRK-9812-NY',
    driverName: 'Robert Vance',
    sealNumber: 'SEAL-99214-B',
    expectedQuantity: 10000,
    receivedQuantity: 10000,
    variance: 0,
    preDipMm: 1120,
    postDipMm: 1980,
    temperatureC: 24.5,
    density: 0.835,
    status: 'OFFLOADING',
    verifiedBy: 'Farhan Ali (Inventory)',
  },
  {
    id: 'd2',
    deliveryNumber: 'DEL-881918',
    supplier: 'TotalEnergies Distribution',
    product: 'Petrol',
    targetTankCode: 'UST-01',
    date: 'Nov 16, 2026',
    truckNumber: 'TRK-4421-NJ',
    driverName: 'Ahmed Malik',
    sealNumber: 'SEAL-04188-A',
    expectedQuantity: 12000,
    receivedQuantity: 11980,
    variance: -20,
    preDipMm: 1650,
    postDipMm: 2420,
    temperatureC: 25.0,
    density: 0.742,
    status: 'APPROVED',
    verifiedBy: 'Elena Rostova',
  },
  {
    id: 'd3',
    deliveryNumber: 'DEL-881915',
    supplier: 'Somali Fuel Importers Ltd',
    product: 'Kerosene',
    targetTankCode: 'UST-03',
    date: 'Nov 14, 2026',
    truckNumber: 'TRK-1102-PA',
    driverName: 'Mustafa Hassan',
    sealNumber: 'SEAL-77123-C',
    expectedQuantity: 5000,
    receivedQuantity: 5000,
    variance: 0,
    preDipMm: 410,
    postDipMm: 620,
    temperatureC: 23.8,
    density: 0.81,
    status: 'APPROVED',
    verifiedBy: 'Farhan Ali (Inventory)',
  },
  {
    id: 'd4',
    deliveryNumber: 'DEL-881912',
    supplier: 'Hass Petroleum Supply',
    product: 'Petrol',
    targetTankCode: 'UST-01',
    date: 'Nov 12, 2026',
    truckNumber: 'TRK-8840-NY',
    driverName: 'John Kiptoo',
    sealNumber: 'SEAL-22901-D',
    expectedQuantity: 15000,
    receivedQuantity: 14960,
    variance: -40,
    preDipMm: 1200,
    postDipMm: 2550,
    temperatureC: 26.2,
    density: 0.745,
    status: 'APPROVED',
    verifiedBy: 'Elena Rostova',
  },
];

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<TankerDelivery[]>(INITIAL_DELIVERIES);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  // Modal form states
  const [newSupplier, setNewSupplier] = useState('Hass Petroleum Supply');
  const [newProduct, setNewProduct] = useState<'Petrol' | 'Diesel' | 'Kerosene'>('Diesel');
  const [newTargetTank, setNewTargetTank] = useState('UST-02');
  const [newTruckNumber, setNewTruckNumber] = useState('TRK-5520-SO');
  const [newDriver, setNewDriver] = useState('Ali Noor');
  const [newSeal, setNewSeal] = useState('SEAL-88910-X');
  const [newQuantity, setNewQuantity] = useState('10000');

  const handleCreateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(newQuantity) || 10000;
    const created: TankerDelivery = {
      id: `d-${Date.now()}`,
      deliveryNumber: `DEL-${Math.floor(100000 + Math.random() * 900000)}`,
      supplier: newSupplier,
      product: newProduct,
      targetTankCode: newTargetTank,
      date: 'Just now',
      truckNumber: newTruckNumber,
      driverName: newDriver,
      sealNumber: newSeal,
      expectedQuantity: qty,
      receivedQuantity: qty,
      variance: 0,
      preDipMm: 1100,
      postDipMm: 1800,
      temperatureC: 24.5,
      density: 0.835,
      status: 'OFFLOADING',
      verifiedBy: 'Active User (Session)',
    };
    setDeliveries([created, ...deliveries]);
    setIsReceiveModalOpen(false);
  };

  // TanStack columns
  const columns: ColumnDef<TankerDelivery>[] = [
    {
      accessorKey: 'deliveryNumber',
      header: 'Waybill / BOL',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {row.original.deliveryNumber}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Offload Timestamp',
      cell: ({ row }) => <span className="font-semibold text-gray-800">{row.original.date}</span>,
    },
    {
      accessorKey: 'supplier',
      header: 'Fuel Transporter / Terminal',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.original.supplier}</span>
          <span className="text-[11px] text-gray-400 font-mono">
            {row.original.truckNumber} • {row.original.driverName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'product',
      header: 'Grade & Target',
      cell: ({ row }) => {
        const prod = row.original.product;
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${prod === 'Petrol'
                ? 'bg-emerald-50 text-emerald-700'
                : prod === 'Diesel'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-indigo-50 text-indigo-700'
                }`}
            >
              <Fuel className="w-3 h-3" />
              {prod}
            </span>
            <span className="font-mono text-xs font-bold text-gray-500">
              → {row.original.targetTankCode}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'expectedQuantity',
      header: 'BOL Invoice Liters',
      cell: ({ row }) => (
        <span className="font-bold text-gray-700 font-mono">
          {row.original.expectedQuantity.toLocaleString()} L
        </span>
      ),
    },
    {
      accessorKey: 'receivedQuantity',
      header: 'Offloaded Dip Liters',
      cell: ({ row }) => (
        <span className="font-extrabold text-gray-900 font-mono">
          {row.original.receivedQuantity.toLocaleString()} L
        </span>
      ),
    },
    {
      accessorKey: 'variance',
      header: 'Transit Loss / Gain',
      cell: ({ row }) => {
        const v = row.original.variance;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-mono ${v === 0
              ? 'bg-gray-100 text-gray-600'
              : v > 0
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
              }`}
          >
            {v === 0 ? 'Exact (0 L)' : `${v} L`}
          </span>
        );
      },
    },
    {
      accessorKey: 'sealNumber',
      header: 'Tamper Seal',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-emerald-700 font-mono text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{row.original.sealNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${s === 'OFFLOADING'
              ? 'bg-amber-100 text-amber-800 animate-pulse'
              : s === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${s === 'OFFLOADING' ? 'bg-amber-500' : s === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
            />
            {s}
          </span>
        );
      },
    },
  ];

  const totalOffloadedLiters = deliveries.reduce((acc, d) => acc + d.receivedQuantity, 0);
  const totalVarianceLiters = deliveries.reduce((acc, d) => acc + d.variance, 0);

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Matches Customers & Tanks Visual Architecture)          */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Truck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Road Tanker Deliveries & Offload Bay
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Chamber compartment reconciliation, bill of lading dip variance, and tamper seal verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const headers = ['Delivery #,Supplier,Product,Target Tank,Date,Truck Plate,Driver,Seal #,Expected (L),Received (L),Variance (L),Pre-Dip (mm),Post-Dip (mm),Temp (C),Density,Status,Verified By'];
              const rows = deliveries.map(
                (d) => `"${d.deliveryNumber}","${d.supplier}","${d.product}","${d.targetTankCode}","${d.date}","${d.truckNumber}","${d.driverName}","${d.sealNumber}",${d.expectedQuantity},${d.receivedQuantity},${d.variance},${d.preDipMm},${d.postDipMm},${d.temperatureC},${d.density},"${d.status}","${d.verifiedBy}"`
              );
              const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `FuelPro_Tanker_Deliveries_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/deliveries/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Receive Road Tanker</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 FORECOURT ROAD TANKER KPI CARDS (With Sparkline Waves)           */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Volume Received MTD */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Bulk Volume Received
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  {totalOffloadedLiters.toLocaleString()} <span className="text-xs font-normal text-gray-400">L</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  MTD
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Across {deliveries.length} consignments
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

        {/* Card 2: Offload Bay Status */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Offload Bay 1 Status
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-amber-600">Active Offload</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md animate-pulse">
                  Flowing
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                UST-02 Diesel (Camlock Connected)
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

        {/* Card 3: Transit Variance Delta */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Transit Discrepancy
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900 font-mono">
                  {totalVarianceLiters} L
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  -0.09% (Safe)
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Within ASTM -0.25% tolerance
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

        {/* Card 4: Quality & Seal Audits */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Tamper Seal Compliance
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">100% Passed</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  Hydrometer OK
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Density & water paste verified
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

      {/* Active Tanker Offload Bay 1 Cockpit Card */}
      <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white animate-pulse">
                OFFLOAD BAY 1 ACTIVE
              </span>
              <span className="font-mono text-xs text-gray-500">TRK-9812-NY • Hass Petroleum</span>
            </div>
            <h2 className="text-xl font-black text-gray-900">
              10,000 L Ultra-Low Sulfur Diesel Discharging → UST-02
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Ground Earthing Clamp Attached
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Vapor Recovery Hose Coupled
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> QA Seal #SEAL-99214-B Verified
              </span>
            </div>
          </div>

          {/* Road Tanker Compartment Visual Allocation */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-2">
            <div className="text-center px-3 border-r border-gray-200">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Chamber 1</div>
              <div className="font-mono font-bold text-xs text-gray-800">5,000 L</div>
              <span className="text-[10px] font-semibold text-emerald-600">Discharged</span>
            </div>
            <div className="text-center px-3 border-r border-gray-200">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Chamber 2</div>
              <div className="font-mono font-bold text-xs text-amber-700 animate-pulse">5,000 L</div>
              <span className="text-[10px] font-semibold text-amber-600">Flowing (52%)</span>
            </div>
            <div className="text-center px-3">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Chamber 3</div>
              <div className="font-mono font-bold text-xs text-gray-400">Empty</div>
              <span className="text-[10px] font-semibold text-gray-400">N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries Ledger TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Road Tanker Intake & Delivery Ledger</h2>
          <p className="text-xs text-gray-500 font-medium">
            Historical tanker offload records with temperature compensation, density audits, and seal logs.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={deliveries}
          searchPlaceholder="Search delivery waybill, supplier, or truck plate..."
          pageSize={10}
          emptyMessage="No tanker offload records found."
        />
      </div>

      {/* Modal: Receive Tanker */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900 text-sm">Receive Road Tanker Consignment</h3>
              </div>
              <button
                onClick={() => setIsReceiveModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDelivery} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fuel Supplier / Hauler</label>
                <input
                  type="text"
                  required
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fuel Product</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Kerosene">Kerosene</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Storage Tank</label>
                  <select
                    value={newTargetTank}
                    onChange={(e) => setNewTargetTank(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="UST-01">UST-01 (Petrol Main)</option>
                    <option value="UST-02">UST-02 (Diesel Heavy)</option>
                    <option value="UST-03">UST-03 (Kerosene)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tanker Plate</label>
                  <input
                    type="text"
                    required
                    value={newTruckNumber}
                    onChange={(e) => setNewTruckNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Invoice Liters (BOL)</label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Security Seal Number</label>
                  <input
                    type="text"
                    required
                    value={newSeal}
                    onChange={(e) => setNewSeal(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Authorize Offload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
