'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Car,
  CreditCard,
  Building2,
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  Info,
  DollarSign,
  Trash2,
  X,
} from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  fuel: 'Petrol' | 'Diesel';
  assignedTo: string;
  status: 'Active' | 'Inactive';
}

interface Customer {
  id: string;
  name: string;
  roleTitle: string;
  initials: string;
  avatarColor: string;
  type: 'COMPANY' | 'INDIVIDUAL';
  phone: string;
  email: string;
  creditLimit: number;
  currentBalance: number;
  utilizationPct: number;
  paymentTerms: string;
  status: 'Active' | 'Suspended';
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Marcus Vance',
    roleTitle: 'Fleet Manager',
    initials: 'MV',
    avatarColor: 'bg-blue-600',
    type: 'COMPANY',
    phone: '+252 61 555-7788',
    email: 'marcus@metrorapid.so',
    creditLimit: 25000,
    currentBalance: 8400,
    utilizationPct: 34,
    paymentTerms: 'Net 30 Days',
    status: 'Active',
  },
  {
    id: 'c2',
    name: 'David Miller',
    roleTitle: 'Treasurer',
    initials: 'DM',
    avatarColor: 'bg-purple-600',
    type: 'COMPANY',
    phone: '+252 61 444-1234',
    email: 'accounts@expresstaxi.so',
    creditLimit: 15000,
    currentBalance: 3200,
    utilizationPct: 21,
    paymentTerms: 'Net 15 Days',
    status: 'Active',
  },
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    plate: 'TX-8801',
    model: 'Toyota Camry',
    fuel: 'Petrol',
    assignedTo: 'Marcus Vance',
    status: 'Active',
  },
  {
    id: 'v2',
    plate: 'TX-8802',
    model: 'Toyota Prius',
    fuel: 'Petrol',
    assignedTo: 'David Miller',
    status: 'Active',
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountType, setAccountType] = useState<'ALL' | 'COMPANY' | 'INDIVIDUAL'>('ALL');

  // Modals & dropdowns
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Forms
  const [customerForm, setCustomerForm] = useState({
    name: '',
    roleTitle: 'Fleet Manager',
    type: 'COMPANY' as 'COMPANY' | 'INDIVIDUAL',
    phone: '',
    email: '',
    creditLimit: 25000,
  });

  const [vehicleForm, setVehicleForm] = useState({
    plate: '',
    model: '',
    fuel: 'Petrol' as 'Petrol' | 'Diesel',
    assignedTo: 'Marcus Vance',
  });

  const [paymentAmount, setPaymentAmount] = useState('1000');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = accountType === 'ALL' || c.type === accountType;
    return matchesSearch && matchesType;
  });

  const filteredVehicles = vehicles.filter((v) => {
    return (
      v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalOutstanding = 28950;
  const totalApproved = 75000;
  const availableCreditBuffer = totalApproved - totalOutstanding;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = customerForm.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const created: Customer = {
      id: `c-${Date.now()}`,
      name: customerForm.name,
      roleTitle: customerForm.roleTitle,
      initials: initials || 'CU',
      avatarColor: 'bg-blue-600',
      type: customerForm.type,
      phone: customerForm.phone || '+252 61 000-0000',
      email: customerForm.email || 'billing@company.so',
      creditLimit: Number(customerForm.creditLimit),
      currentBalance: 0,
      utilizationPct: 0,
      paymentTerms: 'Net 30 Days',
      status: 'Active',
    };

    setCustomers([created, ...customers]);
    setIsAddCustomerOpen(false);
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vehicle = {
      id: `v-${Date.now()}`,
      plate: vehicleForm.plate.toUpperCase(),
      model: vehicleForm.model,
      fuel: vehicleForm.fuel,
      assignedTo: vehicleForm.assignedTo,
      status: 'Active',
    };

    setVehicles([created, ...vehicles]);
    setIsAddVehicleOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amt = Number(paymentAmount) || 0;

    setCustomers(
      customers.map((c) => {
        if (c.id === selectedCustomer.id) {
          const newBal = Math.max(0, c.currentBalance - amt);
          const newUtil = Math.round((newBal / (c.creditLimit || 1)) * 100);
          return { ...c, currentBalance: newBal, utilizationPct: newUtil };
        }
        return c;
      })
    );
    setIsPaymentOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Row (Exact Match to Image 2) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Users className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
              Customers & Corporate Fleet Accounts
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Manage corporate fuel cards, vehicle quotas, and payment reconciliations.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCustomerOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Customer Account</span>
        </button>
      </div>

      {/* 2. 4 Modern KPI Cards Row (Exact Match to Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Outstanding Balance */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Outstanding Balance
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">${totalOutstanding.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  <span>↑</span> 12%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Active credit accounts receivable
              </span>
            </div>
          </div>
          {/* Subtle Blue Wave Graphic */}
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

        {/* Card 2: Total Credit Approved */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Credit Approved
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">${totalApproved.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  <span>↑</span> 8%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                ${availableCreditBuffer.toLocaleString()} available credit buffer
              </span>
            </div>
          </div>
          {/* Subtle Green Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 22C12 22 18 16 28 16C38 16 44 8 54 8C60 8 64 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Active Fleet Vehicles */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Active Fleet Vehicles
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">8</span>
                <span className="text-xs font-semibold text-gray-500">Vehicles</span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Enrolled in automated forecourt billing
              </span>
            </div>
          </div>
          {/* Mini 4-Bar Chart Graphic */}
          <div className="flex items-end gap-1 h-7 shrink-0 pr-2">
            <div className="w-1.5 h-3 bg-purple-200 rounded-xs" />
            <div className="w-1.5 h-4 bg-purple-300 rounded-xs" />
            <div className="w-1.5 h-5 bg-purple-400 rounded-xs" />
            <div className="w-1.5 h-7 bg-purple-600 rounded-xs" />
          </div>
        </div>

        {/* Card 4: Total Accounts */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Accounts
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">4</span>
                <span className="text-xs font-semibold text-gray-500">Clients</span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                3 Corporate / 1 Hauliers
              </span>
            </div>
          </div>
          {/* Mini 4-Bar Chart Graphic */}
          <div className="flex items-end gap-1 h-7 shrink-0 pr-2">
            <div className="w-1.5 h-2 bg-amber-200 rounded-xs" />
            <div className="w-1.5 h-4 bg-amber-300 rounded-xs" />
            <div className="w-1.5 h-5 bg-amber-400 rounded-xs" />
            <div className="w-1.5 h-6 bg-amber-500 rounded-xs" />
          </div>
        </div>
      </div>

      {/* 3. Search and Pill Filters Bar (Exact Match to Image 2) */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search input with pill styling */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, fleet plate number, contact, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Account Type:</span>
          <button
            type="button"
            onClick={() => setAccountType('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all ${
              accountType === 'ALL'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200'
            }`}
          >
            All Accounts
          </button>
          <button
            type="button"
            onClick={() => setAccountType('COMPANY')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all ${
              accountType === 'COMPANY'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200'
            }`}
          >
            Corporate Fleets
          </button>
          <button
            type="button"
            onClick={() => setAccountType('INDIVIDUAL')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all ${
              accountType === 'INDIVIDUAL'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200'
            }`}
          >
            Individual Hauliers
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 ml-1 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters ⌄</span>
          </button>
        </div>
      </div>

      {/* 4. Two-Column Dashboard Split (Exact Match to Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Customers Accounts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Card Header */}
            <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">Customers Accounts</h2>
              </div>
              <button
                type="button"
                onClick={() => setAccountType('ALL')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/50 text-gray-400 font-semibold text-[11px]">
                  <tr>
                    <th className="p-4 pl-5">Customer</th>
                    <th className="p-4">Balance</th>
                    <th className="p-4">Credit Limit</th>
                    <th className="p-4">Utilization</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Customer Info */}
                      <td className="p-4 pl-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${c.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {c.initials}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block leading-tight">{c.name}</span>
                            <span className="text-[11px] text-gray-400">{c.roleTitle}</span>
                          </div>
                        </div>
                      </td>

                      {/* Balance */}
                      <td className="p-4 font-bold text-gray-900 font-mono">
                        ${c.currentBalance.toLocaleString()}
                      </td>

                      {/* Credit Limit */}
                      <td className="p-4 text-gray-500 font-mono">
                        ${c.creditLimit.toLocaleString()}
                      </td>

                      {/* Circular / Utilization Progress Ring */}
                      <td className="p-4">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-8 h-8 -rotate-90">
                            <circle
                              cx="16"
                              cy="16"
                              r="13"
                              stroke="#e2e8f0"
                              strokeWidth="2.5"
                              fill="none"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="13"
                              stroke="#2563eb"
                              strokeWidth="2.5"
                              strokeDasharray={81.68}
                              strokeDashoffset={81.68 - (81.68 * c.utilizationPct) / 100}
                              strokeLinecap="round"
                              fill="none"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-black text-gray-800">
                            {c.utilizationPct}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === c.id && (
                          <div className="absolute right-4 top-10 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20 text-left py-1 text-xs animate-in fade-in zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomer(c);
                                setIsPaymentOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 font-medium text-emerald-700"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Record Payment</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setVehicleForm({ ...vehicleForm, assignedTo: c.name });
                                setIsAddVehicleOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 font-medium text-blue-700"
                            >
                              <Car className="w-3.5 h-3.5" />
                              <span>Assign Vehicle</span>
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              type="button"
                              onClick={() => {
                                setCustomers(customers.filter((item) => item.id !== c.id));
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Account</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card Footer Summary (Exact Match to Image 2) */}
          <div className="m-4 mt-2 p-3 bg-blue-50/70 border border-blue-100/80 rounded-xl flex items-center gap-2 text-xs font-semibold text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              2 customers • $11,600 total balance
            </span>
          </div>
        </div>

        {/* Right Card: Fleet Vehicles (Exact Match to Image 2) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Card Header */}
            <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Car className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">Fleet Vehicles</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVehicleOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/50 text-gray-400 font-semibold text-[11px]">
                  <tr>
                    <th className="p-4 pl-5">Vehicle</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Assigned To</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Vehicle Thumbnail & Plate */}
                      <td className="p-4 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 overflow-hidden">
                            {/* Realistic Car Thumbnail SVG */}
                            <svg className="w-10 h-6 text-slate-700" viewBox="0 0 60 30" fill="currentColor">
                              <path d="M5 18 L12 9 C13 7 15 6 18 6 L38 6 C41 6 43 7 45 9 L52 18 L55 19 C57 20 58 22 58 24 L56 25 C56 26 55 27 53 27 C51 27 50 26 50 25 L40 25 C40 26 39 27 37 27 C35 27 34 26 34 25 L16 25 C16 26 15 27 13 27 C11 27 10 26 10 25 L5 25 C3 25 2 24 2 22 L2 20 C2 19 3 18 5 18 Z" fill="#94a3b8" />
                              <circle cx="13" cy="24" r="4" fill="#1e293b" />
                              <circle cx="13" cy="24" r="1.5" fill="#f8fafc" />
                              <circle cx="47" cy="24" r="4" fill="#1e293b" />
                              <circle cx="47" cy="24" r="1.5" fill="#f8fafc" />
                              <path d="M15 10 L25 10 L25 16 L11 16 Z" fill="#e2e8f0" />
                              <path d="M28 10 L38 10 L44 16 L28 16 Z" fill="#e2e8f0" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 font-mono block leading-tight">{v.plate}</span>
                            <span className="text-[11px] text-gray-400">{v.model}</span>
                          </div>
                        </div>
                      </td>

                      {/* Fuel Type Badge */}
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600">
                          {v.fuel}
                        </span>
                      </td>

                      {/* Assigned Driver / Account */}
                      <td className="p-4 font-semibold text-gray-700">
                        {v.assignedTo}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove vehicle ${v.plate}?`)) {
                              setVehicles(vehicles.filter((item) => item.id !== v.id));
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card Footer Summary (Exact Match to Image 2) */}
          <div className="m-4 mt-2 p-3 bg-blue-50/70 border border-blue-100/80 rounded-xl flex items-center gap-2 text-xs font-semibold text-blue-900">
            <Car className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              8 total vehicles • 100% operational
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Add Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">New Customer Account</h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Customer / Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={customerForm.roleTitle}
                    onChange={(e) => setCustomerForm({ ...customerForm, roleTitle: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    required
                    value={customerForm.creditLimit}
                    onChange={(e) => setCustomerForm({ ...customerForm, creditLimit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vehicle */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Enroll Fleet Vehicle</h3>
              <button
                type="button"
                onClick={() => setIsAddVehicleOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">License Plate # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TX-8803"
                    value={vehicleForm.plate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, plate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fuel Grade</label>
                  <select
                    value={vehicleForm.fuel}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuel: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:bg-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vehicle Make & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Hilux 4x4"
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Driver / Fleet Manager</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.assignedTo}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, assignedTo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                >
                  Enroll Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Payment */}
      {isPaymentOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Record Payment</h3>
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500">Current Balance:</span>
                <span className="font-mono font-black text-gray-900 text-sm">
                  ${selectedCustomer.currentBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Amount Paid ($)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-black text-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
