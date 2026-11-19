'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Phone,
  Mail,
  MapPin,
  Truck,
  FileText,
  Search,
  Filter,
  DollarSign,
  Trash2,
  X,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Receipt,
  ShoppingCart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Supplier {
  id: string;
  name: string;
  code: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  products: string[];
  status: 'ACTIVE' | 'INACTIVE';
  outstandingBalance: number;
  deliveriesCount: number;
  paymentTerms: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  quantityLitres: number;
  pricePerLitre: number;
  totalCost: number;
  expectedDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'FULFILLED' | 'CANCELLED';
  destinationTank: string;
}

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    name: 'TotalEnergies Global Supply',
    code: 'SUP-TE',
    contact: 'Jean-Luc Dupont',
    phone: '+252 61 800-1200',
    email: 'dispatch@totalenergies.so',
    address: 'Port Logistics Terminal, Berth 4',
    products: ['Petrol (Super 95)', 'Diesel (ULSD 50ppm)'],
    status: 'ACTIVE',
    outstandingBalance: 12500,
    deliveriesCount: 42,
    paymentTerms: 'Net 30 Days',
  },
  {
    id: 's2',
    name: 'Shell Commercial Distribution',
    code: 'SUP-SH',
    contact: 'Sarah O’Connor',
    phone: '+252 61 800-3400',
    email: 'orders@shell.so',
    address: 'Refinery Highway, Sector 9',
    products: ['Diesel (ULSD 50ppm)', 'Kerosene', 'Petrol (Super 95)'],
    status: 'ACTIVE',
    outstandingBalance: 18400,
    deliveriesCount: 68,
    paymentTerms: 'Net 15 Days',
  },
  {
    id: 's3',
    name: 'Oryx Petroleum Supply Ltd',
    code: 'SUP-OX',
    contact: 'Kofi Mensah',
    phone: '+252 61 800-6700',
    email: 'supply@oryx.so',
    address: 'Coastal Terminal Road, Hub 2',
    products: ['Kerosene', 'Diesel (ULSD 50ppm)'],
    status: 'ACTIVE',
    outstandingBalance: 6200,
    deliveriesCount: 29,
    paymentTerms: 'Net 30 Days',
  },
];

const INITIAL_POS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-091',
    supplierName: 'Shell Commercial Distribution',
    product: 'Diesel',
    quantityLitres: 12000,
    pricePerLitre: 1.12,
    totalCost: 13440,
    expectedDate: 'Nov 20, 2026',
    status: 'CONFIRMED',
    destinationTank: 'TK-02 (Central Diesel)',
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-090',
    supplierName: 'TotalEnergies Global Supply',
    product: 'Petrol',
    quantityLitres: 10000,
    pricePerLitre: 1.18,
    totalCost: 11800,
    expectedDate: 'Nov 19, 2026',
    status: 'FULFILLED',
    destinationTank: 'TK-01 (Central Petrol)',
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_POS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'SUPPLIERS' | 'ORDERS'>('SUPPLIERS');

  // Modals
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isPaySupplierOpen, setIsPaySupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Supplier Form
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    code: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: 'Net 30 Days',
  });

  // Purchase Order Form
  const [poForm, setPoForm] = useState({
    supplierName: 'Shell Commercial Distribution',
    product: 'Petrol' as 'Petrol' | 'Diesel' | 'Kerosene',
    quantityLitres: 10000,
    pricePerLitre: 1.15,
    destinationTank: 'TK-01 (Central Petrol Underground Tank 1)',
    expectedDate: 'Nov 22, 2026',
  });

  // Pay Supplier Form
  const [payForm, setPayForm] = useState({
    amount: '',
    paymentMethod: 'Bank Wire Transfer',
    reference: '',
  });

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPayables = suppliers.reduce((acc, s) => acc + s.outstandingBalance, 0);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      id: `s-${Date.now()}`,
      name: supplierForm.name,
      code: supplierForm.code || `SUP-0${suppliers.length + 1}`,
      contact: supplierForm.contact,
      phone: supplierForm.phone,
      email: supplierForm.email,
      address: supplierForm.address || 'Forecourt Logistics Park',
      products: ['Petrol (Super 95)', 'Diesel (ULSD 50ppm)'],
      status: 'ACTIVE',
      outstandingBalance: 0,
      deliveriesCount: 0,
      paymentTerms: supplierForm.paymentTerms,
    };

    setSuppliers((prev) => [newSupplier, ...prev]);
    setIsAddSupplierOpen(false);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(poForm.quantityLitres) * Number(poForm.pricePerLitre);
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierName: poForm.supplierName,
      product: poForm.product,
      quantityLitres: Number(poForm.quantityLitres),
      pricePerLitre: Number(poForm.pricePerLitre),
      totalCost: total,
      expectedDate: poForm.expectedDate,
      status: 'CONFIRMED',
      destinationTank: poForm.destinationTank,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    setIsAddPOOpen(false);
    setActiveTab('ORDERS');
  };

  const handleOpenPayModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setPayForm({
      amount: supplier.outstandingBalance.toString(),
      paymentMethod: 'Bank Wire Transfer',
      reference: `WIRE-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setIsPaySupplierOpen(true);
  };

  const handleConfirmPaySupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    const payAmt = Number(payForm.amount) || 0;

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === selectedSupplier.id
          ? { ...s, outstandingBalance: Math.max(0, s.outstandingBalance - payAmt) }
          : s
      )
    );
    setIsPaySupplierOpen(false);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Decommission this fuel supplier contract?')) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Fuel Suppliers & Bulk Purchase Orders
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage refinery distribution contracts, bulk tanker procurement orders, and vendor accounts payable.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/purchase-orders/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </Link>
          <Link
            href="/suppliers/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Supplier</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Accounts Payable</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-600">${totalPayables.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Pending wholesale fuel settlements</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active Contracts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{suppliers.length}</span>
            <span className="text-xs font-semibold text-gray-500">Refineries</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Shell, TotalEnergies, Oryx</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Purchase Orders</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-600">{purchaseOrders.length}</span>
            <span className="text-xs font-semibold text-gray-500">Active</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {purchaseOrders.filter((po) => po.status === 'CONFIRMED').length} in transit / confirmed
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Bulk Deliveries</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">
              {suppliers.reduce((acc, s) => acc + s.deliveriesCount, 0)}
            </span>
            <span className="text-xs font-semibold text-gray-500">Tankers</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Historical lifetime shipments</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('SUPPLIERS')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'SUPPLIERS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Suppliers Directory ({suppliers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'ORDERS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
      </div>

      {activeTab === 'SUPPLIERS' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSuppliers.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono">
                    {s.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={s.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {s.status}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleDeleteSupplier(s.id)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-1">{s.name}</h3>
                <span className="text-xs text-gray-500 block mb-3">Contact: <strong>{s.contact}</strong></span>

                <div className="space-y-1.5 text-xs text-gray-600 py-3 border-y border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{s.address}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Outstanding Payable</span>
                    <span className="font-mono font-black text-amber-600 text-sm">
                      ${s.outstandingBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-gray-500">
                    <span>Terms: {s.paymentTerms}</span>
                    <span>{s.deliveriesCount} Shipments</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenPayModal(s)}
                  className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Settle Bill</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPoForm({ ...poForm, supplierName: s.name });
                    setIsAddPOOpen(true);
                  }}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* PURCHASE ORDERS TABLE */
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Fuel Product</th>
                  <th className="p-4">Quantity (Litres)</th>
                  <th className="p-4">Price / L</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Destination Tank</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono font-bold text-gray-900">{po.poNumber}</td>
                    <td className="p-4 font-semibold text-gray-900">{po.supplierName}</td>
                    <td className="p-4">
                      <span className="font-bold text-gray-800">{po.product}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{po.quantityLitres.toLocaleString()} L</td>
                    <td className="p-4 font-mono">${po.pricePerLitre.toFixed(2)}</td>
                    <td className="p-4 font-black font-mono text-gray-900 text-sm">
                      ${po.totalCost.toLocaleString()}
                    </td>
                    <td className="p-4 text-blue-600 font-semibold">{po.destinationTank}</td>
                    <td className="p-4">
                      <Badge variant={po.status === 'FULFILLED' ? 'success' : 'default'}>
                        {po.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PURCHASE ORDER MODAL */}
      {isAddPOOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShoppingCart className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Issue Bulk Purchase Order</h3>
                  <p className="text-xs text-gray-500">Order wholesale road tanker fuel from contracted supplier</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPOOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Supplier *
                </label>
                <select
                  value={poForm.supplierName}
                  onChange={(e) => setPoForm({ ...poForm, supplierName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Fuel Product *
                  </label>
                  <select
                    value={poForm.product}
                    onChange={(e) =>
                      setPoForm({
                        ...poForm,
                        product: e.target.value as 'Petrol' | 'Diesel' | 'Kerosene',
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
                    Order Volume (Litres) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={poForm.quantityLitres}
                    onChange={(e) => setPoForm({ ...poForm, quantityLitres: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Contract Cost / Litre ($) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={poForm.pricePerLitre}
                    onChange={(e) => setPoForm({ ...poForm, pricePerLitre: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Expected Arrival Date
                  </label>
                  <input
                    type="text"
                    value={poForm.expectedDate}
                    onChange={(e) => setPoForm({ ...poForm, expectedDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex justify-between items-center font-bold text-blue-900">
                <span>Total Requisition Commitment:</span>
                <span className="text-base font-black">
                  ${(poForm.quantityLitres * poForm.pricePerLitre).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddPOOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                >
                  Authorize Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER SUPPLIER MODAL */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Register Wholesale Supplier</h3>
                  <p className="text-xs text-gray-500">Add fuel refinery or terminal distribution partner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSupplierOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                    placeholder="e.g. National Petroleum Corp"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Supplier Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierForm.code}
                    onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })}
                    placeholder="SUP-NPC"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Key Contact Person
                  </label>
                  <input
                    type="text"
                    value={supplierForm.contact}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                    placeholder="e.g. Hassan Nur"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    placeholder="+252 61..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Orders & Dispatch Email
                </label>
                <input
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  placeholder="orders@supplier.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Terminal / Depot Physical Address
                </label>
                <input
                  type="text"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  placeholder="Port Depot, Gate 3"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Register Supplier Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETTLE BILL MODAL */}
      {isPaySupplierOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Settle Wholesale Payable</h3>
                  <p className="text-xs text-gray-500">Post payment to {selectedSupplier.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPaySupplierOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPaySupplier} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500 font-semibold">Outstanding Invoice Balance:</span>
                <span className="font-mono font-black text-amber-600 text-sm">
                  ${selectedSupplier.outstandingBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Amount ($) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Bank Reference / Wire Transfer #
                </label>
                <input
                  type="text"
                  required
                  value={payForm.reference}
                  onChange={(e) => setPayForm({ ...payForm, reference: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPaySupplierOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                >
                  Confirm & Post Wire Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
