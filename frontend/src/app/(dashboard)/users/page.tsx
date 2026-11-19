'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MoreVertical,
  X,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  KeyRound,
  UserCheck,
  UserX,
  Shield,
  Lock,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { SystemRole } from '@/lib/rbac';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: SystemRole;
  branch: string;
  status: 'ACTIVE' | 'SUSPENDED';
  initials: string;
  avatarColor: string;
  lastLogin: string;
}

const INITIAL_USERS: StaffUser[] = [
  {
    id: 'u-admin',
    name: 'Alex Morgan',
    email: 'admin@fuelpro.com',
    phone: '+252 61 500-1100',
    role: 'Super Admin',
    branch: 'Central Station',
    status: 'ACTIVE',
    initials: 'AM',
    avatarColor: 'bg-blue-600',
    lastLogin: 'Today, 08:30 AM',
  },
  {
    id: 'u-mgr',
    name: 'David Miller',
    email: 'manager@fuelpro.com',
    phone: '+252 61 500-2200',
    role: 'Station Manager',
    branch: 'Central Station',
    status: 'ACTIVE',
    initials: 'DM',
    avatarColor: 'bg-purple-600',
    lastLogin: 'Today, 07:45 AM',
  },
  {
    id: 'u-cash',
    name: 'Sarah Jenkins',
    email: 'cashier@fuelpro.com',
    phone: '+252 61 500-3300',
    role: 'Cashier',
    branch: 'Central Station',
    status: 'ACTIVE',
    initials: 'SJ',
    avatarColor: 'bg-emerald-600',
    lastLogin: 'Today, 06:00 AM',
  },
  {
    id: 'u-inv',
    name: 'Farhan Ali',
    email: 'inventory@fuelpro.com',
    phone: '+252 61 500-4400',
    role: 'Inventory Officer',
    branch: 'Central Station',
    status: 'ACTIVE',
    initials: 'FA',
    avatarColor: 'bg-amber-600',
    lastLogin: 'Today, 06:30 AM',
  },
  {
    id: 'u-acct',
    name: 'Robert Sterling',
    email: 'accountant@fuelpro.com',
    phone: '+252 61 500-5500',
    role: 'Accountant',
    branch: 'Central Station',
    status: 'ACTIVE',
    initials: 'RS',
    avatarColor: 'bg-teal-600',
    lastLogin: 'Today, 09:00 AM',
  },
  {
    id: 'u-att',
    name: 'Abdi Hassan',
    email: 'attendant@fuelpro.com',
    phone: '+252 61 500-6600',
    role: 'Pump Attendant',
    branch: 'Central Station',
    status: 'ACTIVE',
    initials: 'AH',
    avatarColor: 'bg-sky-600',
    lastLogin: 'Today, 06:00 AM',
  },
];

const RBAC_MATRIX = [
  { module: 'Forecourt POS & Dispenser Sales', admin: true, manager: true, cashier: true, inventory: false, accountant: false, attendant: true },
  { module: 'Underground Tanks & Dip Audits', admin: true, manager: true, cashier: false, inventory: true, accountant: false, attendant: false },
  { module: 'Road Tanker Deliveries Offload', admin: true, manager: true, cashier: false, inventory: true, accountant: false, attendant: false },
  { module: 'Cash Drawer Till Handover & Shifts', admin: true, manager: true, cashier: true, inventory: false, accountant: false, attendant: false },
  { module: 'General Ledger Accounting & P&L', admin: true, manager: true, cashier: false, inventory: false, accountant: true, attendant: false },
  { module: 'Forecourt Pricing & LED Totem Sign', admin: true, manager: true, cashier: false, inventory: false, accountant: false, attendant: false },
  { module: 'User Management & Permissions Matrix', admin: true, manager: false, cashier: false, inventory: false, accountant: false, attendant: false },
];

export default function UsersPage() {
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_USERS);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+252 61 ');
  const [newRole, setNewRole] = useState<SystemRole>('Cashier');
  const [newBranch, setNewBranch] = useState('Central Station');

  const handleEnrollUser = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = newName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';

    const created: StaffUser = {
      id: `u-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      branch: newBranch,
      status: 'ACTIVE',
      initials,
      avatarColor: 'bg-blue-600',
      lastLogin: 'Never (New)',
    };
    setUsers([...users, created]);
    setIsEnrollModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u
      )
    );
  };

  // TanStack columns
  const columns: ColumnDef<StaffUser>[] = [
    {
      accessorKey: 'name',
      header: 'Staff Member',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl ${row.original.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}
          >
            {row.original.initials}
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.original.name}</div>
            <div className="text-[11px] text-gray-400">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Assigned RBAC Role',
      cell: ({ row }) => {
        const r = row.original.role;
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            {r}
          </span>
        );
      },
    },
    {
      accessorKey: 'branch',
      header: 'Forecourt Station',
      cell: ({ row }) => <span className="font-semibold text-gray-800 text-xs">{row.original.branch}</span>,
    },
    {
      accessorKey: 'phone',
      header: 'Mobile Contact',
      cell: ({ row }) => <span className="font-mono text-gray-600 text-xs">{row.original.phone}</span>,
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Authentication',
      cell: ({ row }) => <span className="text-gray-500 text-xs">{row.original.lastLogin}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Account Status',
      cell: ({ row }) => {
        const isActive = row.original.status === 'ACTIVE';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Access Control',
      cell: ({ row }) => {
        const isActive = row.original.status === 'ACTIVE';
        return (
          <button
            onClick={() => handleToggleStatus(row.original.id)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
              isActive
                ? 'text-red-600 border-red-200 hover:bg-red-50'
                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {isActive ? 'Suspend' : 'Activate'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-100/70 text-violet-700 flex items-center justify-center shrink-0 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Staff Members & Role-Based Permissions (RBAC)
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Forecourt employee accounts, assigned station duty shifts, and cryptographic access privileges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Staff Member</span>
          </button>
        </div>
      </div>

      {/* Staff Roster TanStack Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Authorized Forecourt Personnel Directory</h2>
          <p className="text-xs text-gray-500 font-medium">
            Active staff credentials across central and regional station branches.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search staff name, email, or role..."
          pageSize={10}
          emptyMessage="No staff members found."
        />
      </div>

      {/* Interactive Granular RBAC Permission Matrix Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Role-Based Access Control (RBAC) Permission Matrix</h3>
            <p className="text-xs text-gray-500 font-medium">
              Strict module segregation enforced by the system route guard and dynamic sidebar.
            </p>
          </div>
          <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
            Strict Enforcement
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3">System Module</th>
                <th className="py-2.5 px-2 text-center">Super Admin</th>
                <th className="py-2.5 px-2 text-center">Station Manager</th>
                <th className="py-2.5 px-2 text-center">Cashier</th>
                <th className="py-2.5 px-2 text-center">Inventory Officer</th>
                <th className="py-2.5 px-2 text-center">Accountant</th>
                <th className="py-2.5 px-2 text-center">Pump Attendant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {RBAC_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-3 px-3 font-semibold text-gray-800">{row.module}</td>
                  <td className="py-3 px-2 text-center">
                    {row.admin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.manager ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.cashier ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.inventory ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.accountant ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-gray-300 inline" />}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.attendant ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-gray-300 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Enroll Staff Member */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-600" />
                <h3 className="font-bold text-gray-900 text-sm">Enroll Forecourt Staff Member</h3>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hassan Nur Warsame"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Work Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="employee@fuelpro.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned RBAC Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Station Manager">Station Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Inventory Officer">Inventory Officer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Pump Attendant">Pump Attendant</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Station Branch</label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="Central Station">Central Station</option>
                    <option value="North Highway">North Highway</option>
                    <option value="East Port">East Port</option>
                    <option value="West Ring">West Ring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile Contact Phone</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Enroll Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
