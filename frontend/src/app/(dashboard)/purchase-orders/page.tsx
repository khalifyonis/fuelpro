'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Truck,
  DollarSign,
  X,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  quantityLitres: number;
  pricePerLitre: number;
  totalCost: number;
  orderDate: string;
  expectedDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'FULFILLED' | 'CANCELLED';
  destinationTank: string;
  notes: string;
}

const INITIAL_POS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-091',
    supplierName: 'Shell Commercial Distribution',
    product: 'Diesel',
    quantityLitres: 12000,
    pricePerLitre: 1.12,
    totalCost: 13440,
    orderDate: 'Nov 18, 2026',
    expectedDate: 'Nov 20, 2026',
    status: 'CONFIRMED',
    destinationTank: 'TK-02 (Central Diesel)',
    notes: 'Bulk ULSD road tanker delivery dispatched from coastal depot.',
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-090',
    supplierName: 'TotalEnergies Global Supply',
    product: 'Petrol',
    quantityLitres: 10000,
    pricePerLitre: 1.18,
    totalCost: 11800,
    orderDate: 'Nov 17, 2026',
    expectedDate: 'Nov 19, 2026',
    status: 'FULFILLED',
    destinationTank: 'TK-01 (Central Petrol)',
    notes: 'Delivered and offloaded successfully. Quality verified.',
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-089',
    supplierName: 'Oryx Petroleum Supply Ltd',
    product: 'Kerosene',
    quantityLitres: 5000,
    pricePerLitre: 1.05,
    totalCost: 5250,
    orderDate: 'Nov 15, 2026',
    expectedDate: 'Nov 17, 2026',
    status: 'FULFILLED',
    destinationTank: 'TK-03 (Central Kerosene)',
    notes: 'Tank chamber replenished.',
  },
];

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_POS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [inspectOrder, setInspectOrder] = useState<PurchaseOrder | null>(null);

  // Form State
  const [form, setForm] = useState({
    supplierName: 'Shell Commercial Distribution',
    product: 'Petrol' as 'Petrol' | 'Diesel' | 'Kerosene',
    quantityLitres: 10000,
    pricePerLitre: 1.15,
    expectedDate: 'Nov 22, 2026',
    destinationTank: 'TK-01 (Central Petrol)',
    notes: '',
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(form.quantityLitres) * Number(form.pricePerLitre);
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierName: form.supplierName,
      product: form.product,
      quantityLitres: Number(form.quantityLitres),
      pricePerLitre: Number(form.pricePerLitre),
      totalCost: total,
      orderDate: 'Today',
      expectedDate: form.expectedDate,
      status: 'CONFIRMED',
      destinationTank: form.destinationTank,
      notes: form.notes || 'Bulk fuel replenishment purchase order.',
    };

    setOrders((prev) => [newPO, ...prev]);
    setIsAddPOOpen(false);
  };

  const filteredOrders = orders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCommitted = orders.reduce((acc, po) => acc + po.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Bulk Fuel Purchase Orders
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Requisition bulk road tankers from partner refineries with contract pricing and expected delivery tracking.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddPOOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Procurement</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-gray-900">${totalCommitted.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Committed wholesale orders</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active In Transit</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-600">
              {orders.filter((po) => po.status === 'CONFIRMED').length}
            </span>
            <span className="text-xs font-semibold text-gray-500">Orders</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Awaiting depot gate arrival</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Fuel Ordered (L)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">
              {orders.reduce((acc, po) => acc + po.quantityLitres, 0).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">Litres</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Cumulative tanker volume</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Suppliers Engaged</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">3 Terminals</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Shell, TotalEnergies, Oryx</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by PO #, supplier, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-500 mr-1">Status:</span>
          {(['ALL', 'CONFIRMED', 'FULFILLED', 'DRAFT'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">PO Number & Date</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Product & Tank</th>
                <th className="p-4">Volume (L)</th>
                <th className="p-4">Price / L</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Expected Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-gray-900 block">{po.poNumber}</span>
                    <span className="text-[11px] text-gray-400">{po.orderDate}</span>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">{po.supplierName}</td>
                  <td className="p-4">
                    <span className="font-bold text-gray-800 block">{po.product}</span>
                    <span className="text-[11px] text-blue-600">→ {po.destinationTank}</span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">{po.quantityLitres.toLocaleString()} L</td>
                  <td className="p-4 font-mono font-semibold">${po.pricePerLitre.toFixed(2)}</td>
                  <td className="p-4 font-mono font-black text-gray-900 text-sm">
                    ${po.totalCost.toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700">{po.expectedDate}</td>
                  <td className="p-4">
                    <Badge variant={po.status === 'FULFILLED' ? 'success' : 'default'}>
                      {po.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => setInspectOrder(po)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PO MODAL */}
      {isAddPOOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingCart className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Create Purchase Order</h3>
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

            <form onSubmit={handleCreateOrder} className="mt-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Supplier *
                </label>
                <select
                  value={form.supplierName}
                  onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white"
                >
                  <option value="Shell Commercial Distribution">Shell Commercial Distribution</option>
                  <option value="TotalEnergies Global Supply">TotalEnergies Global Supply</option>
                  <option value="Oryx Petroleum Supply Ltd">Oryx Petroleum Supply Ltd</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Fuel Product *
                  </label>
                  <select
                    value={form.product}
                    onChange={(e) =>
                      setForm({
                        ...form,
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
                    Volume (Litres) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={form.quantityLitres}
                    onChange={(e) => setForm({ ...form, quantityLitres: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Price / Litre ($) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={form.pricePerLitre}
                    onChange={(e) => setForm({ ...form, pricePerLitre: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="text"
                    value={form.expectedDate}
                    onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex justify-between items-center font-bold text-blue-900">
                <span>Total Commitment:</span>
                <span className="text-base font-black">
                  ${(form.quantityLitres * form.pricePerLitre).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddPOOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Authorize Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT PO MODAL */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="font-mono font-bold text-blue-700">{inspectOrder.poNumber}</span>
                <h3 className="font-bold text-gray-900 text-base mt-0.5">Purchase Order Waybill Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Supplier:</span>
                <span className="font-bold text-gray-900">{inspectOrder.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Fuel Product:</span>
                <span className="font-bold text-gray-900">{inspectOrder.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Volume Ordered:</span>
                <span className="font-bold text-gray-900">{inspectOrder.quantityLitres.toLocaleString()} L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Contract Rate:</span>
                <span className="font-mono font-bold">${inspectOrder.pricePerLitre.toFixed(2)}/L</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1 font-bold">
                <span>Total Commitment:</span>
                <span className="font-mono font-black text-sm text-blue-700">${inspectOrder.totalCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Destination Chamber</span>
              <span className="font-bold text-blue-900">{inspectOrder.destinationTank}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectOrder(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
