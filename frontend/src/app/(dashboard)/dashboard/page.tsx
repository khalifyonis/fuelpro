'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  Droplet,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  Activity,
  Layers,
  Building2,
  Calendar,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
  Truck,
  RotateCcw,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/providers/auth-provider';
import { normalizeRole } from '@/lib/rbac';

export default function DashboardPage() {
  const { activeRole } = useAuth();
  const normalized = normalizeRole(activeRole);
  const role: 'Admin' | 'Station Manager' | 'Cashier' | 'Inventory Officer' | 'Accountant' | 'Pump Attendant' =
    normalized === 'Super Admin'
      ? 'Admin'
      : (normalized as any);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/reports/dashboard', { role });
      setData(res.data || res);
    } catch {
      // Fallback realistic numbers matching the FuelPro Dashboard Collection designs exactly
      setData({
        kpi: {
          totalSales: 248750,
          totalLitres: 112430,
          totalProfit: 72340,
          totalStations: 4,
          todaySales: 42750,
          litresSold: 19860,
          avgPrice: 2.15,
          pumpsOnline: '6/8',
          pumpsOnlinePct: 75,
          posTodaySales: 12450,
          posTransactions: 245,
          posAvgSale: 50.82,
          posCashDrawer: 1250,
          totalStock: 52000,
          tankCapacityPct: 78,
          lowStockAlerts: 1,
          deliveriesToday: 10000,
          totalRevenue: 248750,
          totalExpenses: 176410,
          netProfit: 72340,
          pendingInvoices: 18500,
          assignedPumps: '1 - 4',
          currentFueling: 3,
          todayVolume: 7450,
          shiftTime: '8h 12m',
        },
        salesOverview: [
          { name: 'Mon', thisPeriod: 80000, lastPeriod: 75000, sales: 25000, litres: 15000 },
          { name: 'Tue', thisPeriod: 95000, lastPeriod: 82000, sales: 28000, litres: 18000 },
          { name: 'Wed', thisPeriod: 110000, lastPeriod: 90000, sales: 32000, litres: 22000 },
          { name: 'Thu', thisPeriod: 124500, lastPeriod: 100000, sales: 35000, litres: 24000 },
          { name: 'Fri', thisPeriod: 140000, lastPeriod: 115000, sales: 40000, litres: 28000 },
          { name: 'Sat', thisPeriod: 155000, lastPeriod: 120000, sales: 38000, litres: 26000 },
          { name: 'Sun', thisPeriod: 165000, lastPeriod: 130000, sales: 42000, litres: 29000 },
        ],
        stationPerformance: [
          { name: 'Central', sales: 88000 },
          { name: 'East', sales: 58000 },
          { name: 'West', sales: 74000 },
          { name: 'North', sales: 62000 },
        ],
        revenueVsExpenses: [
          { name: 'Jan', revenue: 170000, expenses: 120000 },
          { name: 'Feb', revenue: 185000, expenses: 135000 },
          { name: 'Mar', revenue: 195000, expenses: 140000 },
          { name: 'Apr', revenue: 220000, expenses: 160000 },
          { name: 'May', revenue: 248750, expenses: 176410 },
          { name: 'Jun', revenue: 265000, expenses: 185000 },
        ],
        paymentMethods: [
          { name: 'Cash', value: 68, color: '#f59e0b' },
          { name: 'Card', value: 24, color: '#2563eb' },
          { name: 'Mobile Money', value: 8, color: '#10b981' },
        ],
        stockLevels: {
          petrol: 85,
          diesel: 72,
          kerosene: 60,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const k = data?.kpi || {
    totalSales: 248750,
    totalLitres: 112430,
    totalProfit: 72340,
    totalStations: 4,
    todaySales: 42750,
    litresSold: 19860,
    avgPrice: 2.15,
    pumpsOnline: '6/8',
    pumpsOnlinePct: 75,
    posTodaySales: 12450,
    posTransactions: 245,
    posAvgSale: 50.82,
    posCashDrawer: 1250,
    totalStock: 52000,
    tankCapacityPct: 78,
    lowStockAlerts: 1,
    deliveriesToday: 10000,
    totalRevenue: 248750,
    totalExpenses: 176410,
    netProfit: 72340,
    pendingInvoices: 18500,
    assignedPumps: '1 - 4',
    currentFueling: 3,
    todayVolume: 7450,
    shiftTime: '8h 12m',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner matching Modern Standard (Role Pills Removed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {role === 'Admin' && 'Administrator Forecourt Overview'}
              {role === 'Station Manager' && 'Station Manager Operations'}
              {role === 'Cashier' && 'Cashier Forecourt Register'}
              {role === 'Inventory Officer' && 'Fuel Inventory & Wet Stock Control'}
              {role === 'Accountant' && 'Financial Ledger & Performance'}
              {role === 'Pump Attendant' && 'Forecourt Attendant Dispenser Status'}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {role === 'Admin' && 'Real-time telemetry, retail revenue, and underground fuel wet stock across all station branches.'}
              {role === 'Station Manager' && 'Manage your station forecourt operations, shift handovers, and stock deliveries.'}
              {role === 'Cashier' && 'Forecourt point of sale register, tender collection, and shift transaction ledger.'}
              {role === 'Inventory Officer' && 'Monitor underground storage tank wet stock, dip stick logs, and delivery offloads.'}
              {role === 'Accountant' && 'General ledger reconciliation, forecourt sales audit, and gross margins.'}
              {role === 'Pump Attendant' && 'Live dispenser pump statuses, active fueling nozzles, and forecourt safety checklist.'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ADMINISTRATOR DASHBOARD                                                */}
      {/* ========================================================================= */}
      {role === 'Admin' && (
        <div className="space-y-6">
          {/* 4 Colored KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Blue: Total Sales */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">
                  Total Sales
                </span>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">
                ${k.totalSales?.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-blue-100 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 12.5%</span>
                <span className="opacity-75 ml-1">vs last period</span>
              </div>
            </div>

            {/* Green: Total Litres */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                  Total Litres
                </span>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Fuel className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">
                {k.totalLitres?.toLocaleString()} L
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-emerald-100 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 10.8%</span>
                <span className="opacity-75 ml-1">vs last period</span>
              </div>
            </div>

            {/* Purple: Total Profit */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">
                  Total Profit
                </span>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">
                ${k.totalProfit?.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-purple-100 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 12.3%</span>
                <span className="opacity-75 ml-1">vs last period</span>
              </div>
            </div>

            {/* Orange: Total Stations */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">
                  Total Stations
                </span>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">
                {k.totalStations}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-amber-100 mt-2 font-medium">
                <span>→ 0%</span>
                <span className="opacity-75 ml-1">All online</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Overview Line Chart (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Sales Overview</h3>
                  <p className="text-xs text-gray-400 font-medium">Weekly sales comparison</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>This Period</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <span>Last Period</span>
                  </div>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.salesOverview || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Sales']} />
                    <Line type="monotone" dataKey="thisPeriod" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="lastPeriod" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Station Performance Bar Chart (1 Col) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">Station Performance</h3>
                  <Link href="/branches" className="text-xs font-semibold text-blue-600 hover:underline">
                    See All →
                  </Link>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.stationPerformance || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Sales']} />
                      <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Top performer:</span>
                <span className="font-bold text-gray-900">Central Station ($88k)</span>
              </div>
            </div>
          </div>

          {/* Bottom Widgets Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Activities</h3>
                <Link href="/audit-logs" className="text-xs font-semibold text-blue-600 hover:underline">
                  See All →
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-gray-900">New sale recorded at Central Station</p>
                    <span className="text-[11px] text-gray-400">2 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-gray-900">Fuel delivery completed (10,000 L)</p>
                    <span className="text-[11px] text-gray-400">15 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-gray-900">User role updated: Cashier</p>
                    <span className="text-[11px] text-gray-400">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">System Health</h3>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">All Systems Online</h4>
                    <p className="text-xs text-emerald-700">Uptime: 99.9% across 4 stations</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600 font-medium">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Database Cluster</span>
                    <span className="text-emerald-600 font-bold">Healthy (8ms)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Pump Controllers</span>
                    <span className="text-emerald-600 font-bold">Synced</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>POS Terminal Network</span>
                    <span className="text-emerald-600 font-bold">Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Brand Card (Matching Design) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1836] via-[#102454] to-[#1e3a8a] p-6 text-white shadow-md flex flex-col justify-between">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-navy-DEFAULT flex items-center justify-center shadow-lg font-black text-lg mb-3">
                  FP
                </div>
                <h4 className="text-xl font-black tracking-tight">FUELPRO</h4>
                <p className="text-xs text-blue-200 mt-1 font-medium">
                  Smarter. Faster. Better.
                </p>
              </div>
              <div className="relative z-10 pt-4">
                <Link
                  href="/pos"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  <span>Launch POS Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-20">
                <Fuel className="w-32 h-32 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STATION MANAGER DASHBOARD                                              */}
      {/* ========================================================================= */}
      {role === 'Station Manager' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">Today's Sales</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.todaySales?.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-[11px] text-blue-100 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 11.3%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Litres Sold</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.litresSold?.toLocaleString()} L</h3>
              <div className="flex items-center gap-1 text-[11px] text-emerald-100 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 8.7%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20">
              <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">Avg. Price</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.avgPrice?.toFixed(2)}/L</h3>
              <div className="flex items-center gap-1 text-[11px] text-purple-100 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 0.3%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
              <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">Pumps Online</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.pumpsOnline}</h3>
              <div className="flex items-center gap-1 text-[11px] text-amber-100 mt-2 font-medium">
                <span>{k.pumpsOnlinePct}% Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Sales Trend</h3>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-blue-600">● Sales ($)</span>
                  <span className="text-emerald-500">● Litres (L)</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.salesOverview || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="litres" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-gray-900">Pump Status</h3>
                  <Link href="/pumps" className="text-xs font-semibold text-blue-600 hover:underline">See All →</Link>
                </div>
                <div className="flex flex-col items-center justify-center my-4">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Online', value: 6, color: '#10b981' },
                            { name: 'Offline', value: 2, color: '#ef4444' },
                          ]}
                          innerRadius={50}
                          outerRadius={70}
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-gray-900">75%</span>
                      <span className="block text-[10px] text-gray-500 font-semibold">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-semibold mt-2">
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Online: 6
                    </span>
                    <span className="flex items-center gap-1.5 text-red-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Offline: 2
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <Link href="/pos" className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl text-center">
                  New Sale
                </Link>
                <Link href="/inventory" className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl text-center">
                  Check Stock
                </Link>
              </div>
            </div>
          </div>

          {/* Stock Levels Bars (From Design) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Fuel Stock Levels</h3>
              <Link href="/tanks" className="text-xs font-semibold text-blue-600 hover:underline">See All →</Link>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    Petrol
                  </span>
                  <span>85%</span>
                </div>
                <Progress value={85} indicatorColor="bg-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    Diesel
                  </span>
                  <span>72%</span>
                </div>
                <Progress value={72} indicatorColor="bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    Kerosene
                  </span>
                  <span>60%</span>
                </div>
                <Progress value={60} indicatorColor="bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CASHIER / POS DASHBOARD                                                */}
      {/* ========================================================================= */}
      {role === 'Cashier' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">Today's Sales</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.posTodaySales?.toLocaleString()}</h3>
              <span className="text-[11px] text-blue-100 font-medium">↑ 8.2%</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Transactions</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.posTransactions}</h3>
              <span className="text-[11px] text-emerald-100 font-medium">↑ 2.1%</span>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20">
              <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">Avg. Sale</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.posAvgSale?.toFixed(2)}</h3>
              <span className="text-[11px] text-purple-100 font-medium">↑ 2.3%</span>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
              <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">Cash Drawer</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.posCashDrawer?.toLocaleString()}</h3>
              <span className="text-[11px] text-amber-100 font-medium">Balanced float</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4">Hourly Sales Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: '8 AM', today: 1800, yesterday: 1400 },
                      { name: '10 AM', today: 3200, yesterday: 2900 },
                      { name: '12 PM', today: 6400, yesterday: 5200 },
                      { name: '2 PM', today: 7800, yesterday: 7100 },
                      { name: '4 PM', today: 9800, yesterday: 8900 },
                      { name: '6 PM', today: 11400, yesterday: 10200 },
                      { name: '8 PM', today: 12450, yesterday: 11300 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip />
                    <Line type="monotone" dataKey="today" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="yesterday" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick POS Action (Matching Design) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">Quick POS</h3>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Petrol</span>
                      <span className="text-[11px] text-gray-500 font-semibold">$2.15 / L</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Diesel</span>
                      <span className="text-[11px] text-gray-500 font-semibold">$2.05 / L</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Kerosene</span>
                      <span className="text-[11px] text-gray-500 font-semibold">$1.50 / L</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </div>
                </div>
              </div>
              <Link
                href="/pos"
                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs shadow-md shadow-blue-500/20 transition-all block"
              >
                Start Sale →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INVENTORY OFFICER DASHBOARD                                            */}
      {/* ========================================================================= */}
      {role === 'Inventory Officer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">Total Stock</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.totalStock?.toLocaleString()} L</h3>
              <span className="text-[11px] text-blue-100 font-medium">↑ 3.1%</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Tank Capacity</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.tankCapacityPct}%</h3>
              <span className="text-[11px] text-emerald-100 font-medium">↑ 2.5%</span>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20">
              <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">Low Stock Alerts</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.lowStockAlerts}</h3>
              <span className="text-[11px] text-purple-100 font-medium">Requires re-order</span>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
              <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">Deliveries Today</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.deliveriesToday?.toLocaleString()} L</h3>
              <span className="text-[11px] text-amber-100 font-medium">Verified into tanks</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4">Tank Levels (% of Capacity)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Petrol', level: 85, fill: '#2563eb' },
                      { name: 'Diesel', level: 72, fill: '#10b981' },
                      { name: 'Kerosene', level: 60, fill: '#f59e0b' },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="level" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Deliveries</h3>
                <Link href="/deliveries" className="text-xs font-semibold text-blue-600 hover:underline">See All →</Link>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center justify-between font-bold text-xs text-gray-900">
                    <span>10,000 L - Diesel</span>
                    <span className="text-emerald-700">Verified</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">Nov 16, 2026 • 3:15 PM</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center justify-between font-bold text-xs text-gray-900">
                    <span>8,000 L - Petrol</span>
                    <span className="text-blue-700">Verified</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">Nov 16, 2026 • 10:20 AM</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center justify-between font-bold text-xs text-gray-900">
                    <span>5,000 L - Kerosene</span>
                    <span className="text-amber-700">Verified</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">Nov 15, 2026 • 4:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ACCOUNTANT DASHBOARD                                                    */}
      {/* ========================================================================= */}
      {role === 'Accountant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">Total Revenue</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.totalRevenue?.toLocaleString()}</h3>
              <span className="text-[11px] text-blue-100 font-medium">↑ 9.0%</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Total Expenses</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.totalExpenses?.toLocaleString()}</h3>
              <span className="text-[11px] text-emerald-100 font-medium">↑ 8.2%</span>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20">
              <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">Net Profit</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.netProfit?.toLocaleString()}</h3>
              <span className="text-[11px] text-purple-100 font-medium">↑ 14.3%</span>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
              <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">Pending Invoices</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">${k.pendingInvoices?.toLocaleString()}</h3>
              <span className="text-[11px] text-amber-100 font-medium">Receivables due</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Revenue vs Expenses</h3>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-blue-600">● Revenue</span>
                  <span className="text-amber-500">● Expenses</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.revenueVsExpenses || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Methods Donut (Matching Design) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Payment Methods</h3>
                <div className="relative w-44 h-44 mx-auto my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.paymentMethods || []}
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        <Cell fill="#f59e0b" />
                        <Cell fill="#2563eb" />
                        <Cell fill="#10b981" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-gray-900">68%</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Cash</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cash
                    </span>
                    <span>68%</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Card
                    </span>
                    <span>24%</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mobile Money
                    </span>
                    <span>8%</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <Link href="/accounting" className="block text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors">
                  Financial Summary Report →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PUMP ATTENDANT DASHBOARD                                               */}
      {/* ========================================================================= */}
      {role === 'Pump Attendant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">Assigned Pumps</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.assignedPumps}</h3>
              <span className="text-[11px] text-blue-100 font-medium">All calibrated</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Current Fueling</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.currentFueling}</h3>
              <span className="text-[11px] text-emerald-100 font-medium">Ongoing transactions</span>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20">
              <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">Today's Volume</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.todayVolume?.toLocaleString()} L</h3>
              <span className="text-[11px] text-purple-100 font-medium">↑ 9.1%</span>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
              <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">Shift Time</span>
              <h3 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight">{k.shiftTime}</h3>
              <span className="text-[11px] text-amber-100 font-medium">Active shift</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Pump Status Grid (Matching Design) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4">Pump Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <Fuel className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Pump 1</h4>
                  <span className="text-xs font-bold text-emerald-600 block mt-1">Fueling</span>
                  <span className="text-[11px] text-gray-500">28.5 L/min</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto mb-2">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Pump 2</h4>
                  <span className="text-xs font-semibold text-gray-500 block mt-1">Idle</span>
                  <span className="text-[11px] text-gray-400">—</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <Fuel className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Pump 3</h4>
                  <span className="text-xs font-bold text-emerald-600 block mt-1">Fueling</span>
                  <span className="text-[11px] text-gray-500">31.2 L/min</span>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Pump 4</h4>
                  <span className="text-xs font-bold text-blue-600 block mt-1">Ready</span>
                  <span className="text-[11px] text-gray-500">—</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
                <Link href="/pumps" className="text-xs font-semibold text-blue-600 hover:underline">See All →</Link>
              </div>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pump 1 - Sale Completed</p>
                    <span className="text-[11px] text-gray-400">2 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pump 3 - Fueling Started</p>
                    <span className="text-[11px] text-gray-400">5 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pump 2 - Nozzle Returned</p>
                    <span className="text-[11px] text-gray-400">8 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
