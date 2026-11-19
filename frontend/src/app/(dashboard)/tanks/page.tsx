'use client';

import React, { useState } from 'react';
import {
  Cylinder,
  Plus,
  ArrowRight,
  Droplet,
  Waves,
  Thermometer,
  Gauge,
  ShieldCheck,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

interface Tank {
  id: string;
  name: string;
  code: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  currentLitres: number;
  capacityLitres: number;
  percentage: number;
  status: 'Healthy' | 'Low Stock';
  safetyFloor: string;
  waterBottom: string;
  temperature: string;
  themeColor: 'blue' | 'green' | 'amber';
}

interface DipLog {
  id: string;
  timestamp: string;
  tankUnit: string;
  grade: 'Petrol' | 'Diesel' | 'Kerosene';
  dipHeight: string;
  waterBottom: string;
  physicalVolume: string;
  bookVariance: string;
  inspector: string;
  compliance: 'Passed' | 'Flagged';
}

const INITIAL_TANKS: Tank[] = [
  {
    id: 't1',
    name: 'Main Forecourt Petrol Tank 1',
    code: 'UST-01',
    product: 'Petrol',
    currentLitres: 29750,
    capacityLitres: 35000,
    percentage: 85,
    status: 'Healthy',
    safetyFloor: '5,250 L',
    waterBottom: '0 mm',
    temperature: '24.5°C',
    themeColor: 'blue',
  },
  {
    id: 't2',
    name: 'Heavy Transport Diesel Tank',
    code: 'UST-02',
    product: 'Diesel',
    currentLitres: 28800,
    capacityLitres: 40000,
    percentage: 72,
    status: 'Healthy',
    safetyFloor: '11,200 L',
    waterBottom: '3 mm',
    temperature: '25.1°C',
    themeColor: 'green',
  },
  {
    id: 't3',
    name: 'Domestic Heating Kerosene Tank',
    code: 'UST-03',
    product: 'Kerosene',
    currentLitres: 3750,
    capacityLitres: 15000,
    percentage: 25,
    status: 'Low Stock',
    safetyFloor: '620 mm',
    waterBottom: '1 mm',
    temperature: '23.8°C',
    themeColor: 'amber',
  },
];

const INITIAL_DIPS: DipLog[] = [
  {
    id: 'd1',
    timestamp: 'Today, 06:30 AM',
    tankUnit: 'UST-01',
    grade: 'Petrol',
    dipHeight: '2,420 mm',
    waterBottom: '0 mm (Nil)',
    physicalVolume: '29,750 L',
    bookVariance: '-30 L',
    inspector: 'Farhan Ali',
    compliance: 'Passed',
  },
  {
    id: 'd2',
    timestamp: 'Today, 06:35 AM',
    tankUnit: 'UST-02',
    grade: 'Diesel',
    dipHeight: '1,980 mm',
    waterBottom: '3 mm',
    physicalVolume: '28,800 L',
    bookVariance: '-15 L',
    inspector: 'Farhan Ali',
    compliance: 'Passed',
  },
  {
    id: 'd3',
    timestamp: 'Today, 06:40 AM',
    tankUnit: 'UST-03',
    grade: 'Kerosene',
    dipHeight: '1,200 mm',
    waterBottom: '1 mm',
    physicalVolume: '3,750 L',
    bookVariance: '-5 L',
    inspector: 'Ahmed Hassan',
    compliance: 'Passed',
  },
];

export default function TanksPage() {
  const [tanks, setTanks] = useState<Tank[]>(INITIAL_TANKS);
  const [dips, setDips] = useState<DipLog[]>(INITIAL_DIPS);
  const [filterPeriod, setFilterPeriod] = useState<'All' | 'Today' | 'This Week' | 'This Month'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTankOpen, setIsAddTankOpen] = useState(false);

  // Form states
  const [newTankName, setNewTankName] = useState('');
  const [newTankCode, setNewTankCode] = useState('UST-04');
  const [newGrade, setNewGrade] = useState<'Petrol' | 'Diesel' | 'Kerosene'>('Petrol');
  const [newCapacity, setNewCapacity] = useState('30000');
  const [newCurrent, setNewCurrent] = useState('15000');

  const filteredDips = dips.filter((d) => {
    return (
      d.tankUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.inspector.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddTank = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseFloat(newCapacity) || 30000;
    const cur = parseFloat(newCurrent) || 15000;
    const pct = Math.round((cur / cap) * 100);

    const created: Tank = {
      id: `t-${Date.now()}`,
      name: newTankName || `${newGrade} Underground Tank`,
      code: newTankCode,
      product: newGrade,
      currentLitres: cur,
      capacityLitres: cap,
      percentage: pct,
      status: pct < 30 ? 'Low Stock' : 'Healthy',
      safetyFloor: `${Math.round(cap * 0.15).toLocaleString()} L`,
      waterBottom: '0 mm',
      temperature: '24.0°C',
      themeColor: newGrade === 'Petrol' ? 'blue' : newGrade === 'Diesel' ? 'green' : 'amber',
    };

    setTanks([...tanks, created]);
    setIsAddTankOpen(false);
    setNewTankName('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner matching Image 1 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="12" rx="6" />
              <line x1="8" y1="6" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="18" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
              Tanks
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Monitor fuel levels, tank status and ensure smooth operations.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddTankOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Tank</span>
        </button>
      </div>

      {/* 2. Top 4 KPI Metric Cards (Matching Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tanks */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="6" width="16" height="12" rx="4" />
                <line x1="9" y1="6" x2="9" y2="18" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Tanks
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{tanks.length}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 0% vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Fuel */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 fill-emerald-600 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Fuel
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">83,450 L</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 12% vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Avg. Level */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Avg. Level
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">62%</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 3% vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: System Health */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                System Health
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">99.8%</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 0.1% vs last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Tanks Grid (Exact Match to Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tanks.map((tank) => {
          const isHealthy = tank.status === 'Healthy';
          const isPetrol = tank.product === 'Petrol';
          const isDiesel = tank.product === 'Diesel';

          const progressColor = isPetrol
            ? 'bg-blue-600'
            : isDiesel
            ? 'bg-emerald-500'
            : 'bg-amber-500';

          return (
            <div
              key={tank.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Card Top: Status Pill & Options */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isHealthy
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isHealthy ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>{tank.status}</span>
                </span>

                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Tank Title */}
              <h3 className="font-bold text-gray-900 text-sm">{tank.name}</h3>

              {/* Tank Volume Numbers & 3D Tank Graphic */}
              <div className="flex items-center justify-between my-3">
                <div className="flex-1 pr-3">
                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className="text-xl font-black text-gray-900">
                      {tank.currentLitres.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      / {tank.capacityLitres.toLocaleString()} L
                    </span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${tank.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 font-mono">
                      {tank.percentage}%
                    </span>
                  </div>
                </div>

                {/* 3D Realistic Cylindrical Tank Illustration */}
                <div className="shrink-0">
                  <svg className="w-24 h-14" viewBox="0 0 120 70" fill="none">
                    <defs>
                      <linearGradient id={`tankGrad-${tank.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="30%" stopColor="#ffffff" />
                        <stop offset="70%" stopColor="#cbd5e1" />
                        <stop offset="100%" stopColor="#94a3b8" />
                      </linearGradient>
                      <linearGradient id={`liquidGrad-${tank.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={isPetrol ? '#2563eb' : isDiesel ? '#10b981' : '#f59e0b'} />
                        <stop offset="100%" stopColor={isPetrol ? '#3b82f6' : isDiesel ? '#34d399' : '#fbbf24'} />
                      </linearGradient>
                      <filter id={`shadow-${tank.id}`} x="-10%" y="-10%" width="120%" height="130%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.1" />
                      </filter>
                    </defs>
                    {/* Shadow on ground */}
                    <ellipse cx="60" cy="62" rx="42" ry="4" fill="#0f172a" fillOpacity="0.08" />
                    {/* Support Saddles */}
                    <path d="M30 46 L27 60 L37 60 L34 46 Z" fill="#64748b" />
                    <path d="M86 46 L83 60 L93 60 L90 46 Z" fill="#64748b" />
                    {/* Tank Body */}
                    <rect
                      x="25"
                      y="16"
                      width="70"
                      height="34"
                      rx="17"
                      fill={`url(#tankGrad-${tank.id})`}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                      filter={`url(#shadow-${tank.id})`}
                    />
                    {/* Left Dome Seam */}
                    <path d="M35 16 C28 22 28 44 35 50" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
                    {/* Right Dome Seam */}
                    <path d="M85 16 C92 22 92 44 85 50" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
                    {/* Top Manhole Hatch */}
                    <rect x="52" y="10" width="16" height="7" rx="3" fill="#64748b" />
                    <rect x="54" y="8" width="12" height="3" rx="1.5" fill="#94a3b8" />
                  </svg>
                </div>
              </div>

              {/* Bottom Row of 3 Metrics (Safety Floor, Water Bottom, Temperature) */}
              <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs">
                {/* Safety Floor */}
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block leading-none font-medium">Safety Floor</span>
                    <span className="font-bold text-gray-800 text-[11px] leading-tight mt-0.5 block">{tank.safetyFloor}</span>
                  </div>
                </div>

                {/* Water Bottom */}
                <div className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block leading-none font-medium">Water Bottom</span>
                    <span className="font-bold text-gray-800 text-[11px] leading-tight mt-0.5 block">{tank.waterBottom}</span>
                  </div>
                </div>

                {/* Temperature */}
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block leading-none font-medium">Temperature</span>
                    <span className="font-bold text-gray-800 text-[11px] leading-tight mt-0.5 block">{tank.temperature}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Card: Physical Dip Log & Calibration Audits (Exact Match to Image 1) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 px-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">
                Physical Dip Log & Calibration Audits
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Track dip records and tank calibrations for compliance.
              </p>
            </div>
          </div>

          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>View All Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Period Filter Pills */}
        <div className="p-4 border-b border-gray-100/70 flex flex-wrap items-center justify-between gap-3 bg-gray-50/30">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tank, record type or inspector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-gray-800"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['All', 'Today', 'This Week', 'This Month'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  filterPeriod === period
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-400 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">DIP TIMESTAMP</th>
                <th className="py-3 px-4">TANK UNIT</th>
                <th className="py-3 px-4">GRADE</th>
                <th className="py-3 px-4">DIP HEIGHT</th>
                <th className="py-3 px-4">WATER BOTTOM</th>
                <th className="py-3 px-4">PHYSICAL VOLUME</th>
                <th className="py-3 px-4">BOOK VARIANCE</th>
                <th className="py-3 px-4">INSPECTOR</th>
                <th className="py-3 px-5 text-center">COMPLIANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredDips.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3.5 px-5 font-semibold text-gray-800">
                    {row.timestamp}
                  </td>

                  {/* Tank Unit */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {row.tankUnit}
                    </span>
                  </td>

                  {/* Grade */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        row.grade === 'Petrol'
                          ? 'bg-emerald-50 text-emerald-700'
                          : row.grade === 'Diesel'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.grade === 'Petrol'
                            ? 'bg-emerald-500'
                            : row.grade === 'Diesel'
                            ? 'bg-amber-500'
                            : 'bg-purple-500'
                        }`}
                      />
                      {row.grade}
                    </span>
                  </td>

                  {/* Dip Height */}
                  <td className="py-3.5 px-4 text-gray-700 font-semibold font-mono">
                    {row.dipHeight}
                  </td>

                  {/* Water Bottom */}
                  <td className="py-3.5 px-4 text-gray-600 font-semibold">
                    {row.waterBottom}
                  </td>

                  {/* Physical Volume */}
                  <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                    {row.physicalVolume}
                  </td>

                  {/* Book Variance */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {row.bookVariance}
                    </span>
                  </td>

                  {/* Inspector */}
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    {row.inspector}
                  </td>

                  {/* Compliance */}
                  <td className="py-3.5 px-5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{row.compliance}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Tank */}
      {isAddTankOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Add Underground Tank</h3>
              </div>
              <button
                onClick={() => setIsAddTankOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTank} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tank Code</label>
                  <input
                    type="text"
                    required
                    value={newTankCode}
                    onChange={(e) => setNewTankCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Kerosene">Kerosene</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tank Name / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Forecourt Petrol Tank"
                  value={newTankName}
                  onChange={(e) => setNewTankName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Capacity (L)</label>
                  <input
                    type="number"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Current Stock (L)</label>
                  <input
                    type="number"
                    required
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddTankOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save Tank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
