'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Save,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  KeyRound,
  Lock,
  UserCheck,
  Shield,
  Sparkles,
  Fingerprint,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { SystemRole } from '@/lib/rbac';

const ROLES: { role: SystemRole; desc: string; badgeColor: string }[] = [
  { role: 'Super Admin', desc: 'Full station network control & system root access', badgeColor: 'bg-red-50 text-red-700 border-red-200' },
  { role: 'Station Manager', desc: 'Branch forecourt oversight, fuel deliveries & staff', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { role: 'Cashier', desc: 'POS register settlement, shift till float & card payments', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { role: 'Pump Attendant', desc: 'Dispenser nozzle pump operations & cash collections', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { role: 'Accountant', desc: 'Double-entry GL, bank reconciliation & expense vouchers', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { role: 'Inventory Officer', desc: 'ATG tank dips, ATG calibration & wet stock mass-balance', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
];

export default function NewUserPage() {
  const router = useRouter();

  // Personal Info
  const [employeeId, setEmployeeId] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [fullName, setFullName] = useState('Khadar Hassan Ali');
  const [email, setEmail] = useState('khadar.ali@fuelpro.com');
  const [phone, setPhone] = useState('+252 61 789-4561');
  const [nationalId, setNationalId] = useState('SOM-NAT-892144');

  // Role & Station
  const [selectedRole, setSelectedRole] = useState<SystemRole>('Pump Attendant');
  const [assignedBranch, setAssignedBranch] = useState('Central Station Forecourt');
  const [dispenserPin, setDispenserPin] = useState('4829');
  const [shiftRoster, setShiftRoster] = useState('MORNING_06_14');

  // Granular Security Permissions
  const [canOverridePumps, setCanOverridePumps] = useState(false);
  const [canApproveExpenses, setCanApproveExpenses] = useState(false);
  const [canAdjustTanks, setCanAdjustTanks] = useState(false);
  const [enforceMFA, setEnforceMFA] = useState(true);

  // Avatar initials
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FP';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/users');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/users" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Staff Directory & RBAC
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Enroll Forecourt Personnel</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Personnel Enrollment & Role-Based Access Control
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Grant forecourt authorization credentials, assign station branch duty rosters, and configure cryptographic dispenser keypad PINs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/users"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enroll Personnel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Legal Identity & Contacts */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Personal Identity & Legal Profile</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Verified staff identification, payroll identity, and corporate contact details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Employee ID</label>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Corporate System Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mobile Phone (Forecourt Radios)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-gray-700 font-bold mb-1">National ID / Social Security Identification #</label>
                <input
                  type="text"
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Forecourt Role & Station Assignment */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Station Assignment & Role-Based Access (RBAC)</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Select forecourt authorization level and primary physical work branch.
                </p>
              </div>
            </div>

            {/* Role Radio Grid */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-bold text-xs mb-1">Designated System Role</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                          : 'border-gray-200 hover:bg-gray-50/70'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-900">{r.role}</div>
                        <div className="text-[11px] text-gray-500 leading-snug">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Primary Station Branch</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <select
                    value={assignedBranch}
                    onChange={(e) => setAssignedBranch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Central Station Forecourt">Central Station Forecourt</option>
                    <option value="North Highway Service Station">North Highway Service Station</option>
                    <option value="East Port Commercial Station">East Port Commercial Station</option>
                    <option value="West Highway Travel Plaza">West Highway Travel Plaza</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Dispenser Keypad PIN (4-Digit)</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={dispenserPin}
                    onChange={(e) => setDispenserPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-center font-black tracking-widest text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Assigned Shift Schedule</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <select
                    value={shiftRoster}
                    onChange={(e) => setShiftRoster(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="MORNING_06_14">Morning Shift (06:00 - 14:00)</option>
                    <option value="EVENING_14_22">Evening Shift (14:00 - 22:00)</option>
                    <option value="NIGHT_22_06">Night Shift (22:00 - 06:00)</option>
                    <option value="ROTATING">Rotating 24/7 Roster</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Forecourt Security & Hardware Privileges */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Forecourt Security & Hardware Override Privileges</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Control high-risk permissions such as tank level recalibrations and nozzle price alterations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canOverridePumps}
                  onChange={(e) => setCanOverridePumps(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <div className="font-bold text-gray-900">Manual Pump Totalizer Override</div>
                  <div className="text-[10px] text-gray-500">Authorize manual nozzle start when ATG link fails</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canAdjustTanks}
                  onChange={(e) => setCanAdjustTanks(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <div className="font-bold text-gray-900">Wet Stock Dip Adjustment</div>
                  <div className="text-[10px] text-gray-500">Submit manual stick dips during ATG calibration</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canApproveExpenses}
                  onChange={(e) => setCanApproveExpenses(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <div className="font-bold text-gray-900">Expense Requisition Approval</div>
                  <div className="text-[10px] text-gray-500">Authorize station petty cash & diesel fuel vouchers</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceMFA}
                  onChange={(e) => setEnforceMFA(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <div className="font-bold text-gray-900">Require 2-Factor Auth (MFA)</div>
                  <div className="text-[10px] text-gray-500">Mandatory biometric / TOTP token on sign-in</div>
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Staff ID Badge Preview */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Virtual Forecourt Employee ID Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Forecourt Staff ID Badge
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ACTIVE ROSTER
              </span>
            </div>

            {/* Simulated Plastic PVC ID Badge */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-gray-900 via-slate-900 to-blue-950 text-white space-y-4 shadow-md border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-[10px]">
                    FP
                  </div>
                  <span className="font-black text-xs tracking-wider">FUELPRO ID</span>
                </div>
                <span className="font-mono text-[10px] text-blue-300 font-bold">{employeeId}</span>
              </div>

              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-lg font-black text-white shadow-inner shrink-0">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <div className="font-black text-sm text-white truncate">{fullName || 'Staff Name'}</div>
                  <div className="text-[11px] text-blue-300 font-semibold">{selectedRole}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">{assignedBranch}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] relative z-10 font-mono">
                <div>
                  <div className="text-[9px] text-gray-400 uppercase">Keypad PIN</div>
                  <div className="text-emerald-400 font-bold tracking-widest">**** ({dispenserPin})</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-gray-400 uppercase">MFA Status</div>
                  <div className={enforceMFA ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                    {enforceMFA ? 'ENFORCED' : 'OPTIONAL'}
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned shifts card */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1">
              <div className="flex justify-between font-semibold text-gray-700">
                <span>Roster Shift:</span>
                <span className="font-mono text-blue-600">{shiftRoster.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>National ID:</span>
                <span className="font-mono">{nationalId}</span>
              </div>
            </div>
          </div>

          {/* Enrollment Readiness Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Staff Clearance & Onboarding Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Employee ID generated', valid: employeeId.length > 3 },
                { label: 'Full legal name and corporate email', valid: fullName.length > 3 && email.includes('@') },
                { label: '4-digit dispenser keypad PIN configured', valid: dispenserPin.length === 4 },
                { label: 'Primary station forecourt assigned', valid: !!assignedBranch },
                { label: 'RBAC system role defined', valid: !!selectedRole },
                { label: 'National ID verification recorded', valid: nationalId.length > 4 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  {item.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className={item.valid ? 'font-medium' : 'text-gray-400 font-normal'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
