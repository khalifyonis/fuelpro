'use client';

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Fuel,
  DollarSign,
  Clock,
  ShieldCheck,
  Check,
  Trash2,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'WARNING' | 'SUCCESS' | 'INFO' | 'PENDING';
  time: string;
  read: boolean;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Low Fuel Stock Alert: Tank TK-04',
    message: 'Central Diesel Reserve Tank 2 has dropped to 3,800 L (19% capacity), below minimum safe reserve.',
    type: 'WARNING',
    time: '15 min ago',
    read: false,
    actionUrl: '/tanks',
  },
  {
    id: 'n2',
    title: 'Fuel Delivery Offload Confirmed',
    message: '10,000 L of Diesel received from Shell has been approved and logged to inventory ledger.',
    type: 'SUCCESS',
    time: '1 hour ago',
    read: true,
    actionUrl: '/deliveries',
  },
  {
    id: 'n3',
    title: 'Pump 03 Offline for Flow Calibration',
    message: 'Scheduled nozzle flow test and weights seal verification in progress on Pump 3.',
    type: 'INFO',
    time: '2 hours ago',
    read: true,
    actionUrl: '/maintenance',
  },
  {
    id: 'n4',
    title: 'Pending Expense Voucher Sign-off',
    message: 'New forecourt maintenance voucher for $125.00 awaiting Station Manager review.',
    type: 'PENDING',
    time: '4 hours ago',
    read: false,
    actionUrl: '/expenses',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'WARNING'>('ALL');

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'WARNING') return n.type === 'WARNING';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header Banner matching Modern Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                System Alerts & Operational Telemetry
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Enterprise Forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Real-time event triggers for tank levels, equipment maintenance, tanker arrivals, and manager sign-offs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Forecourt KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unread Alerts */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Pending Notices</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
              {unreadCount} Unread
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600">{unreadCount}</span>
            <span className="text-xs font-semibold text-gray-500">Requires Review</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Live forecourt supervisor feed</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 16 Q 25 6, 50 14 T 100 8"
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Tank Low Stock Warning */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Wet Stock Alerts</span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/50">
              1 Low Reserve
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-600">TK-04</span>
            <span className="text-xs font-semibold text-rose-600">19% Capacity</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Central Diesel Reserve replenishment</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 20 Q 30 10, 60 16 T 100 6"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Forecourt Equipment State */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Equipment Telemetry</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
              Pump 3 Testing
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-600">98.5%</span>
            <span className="text-xs font-semibold text-emerald-600">Forecourt Uptime</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Scheduled Weights & Measures seal</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 18 Q 35 4, 70 12 T 100 4"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Safety & Environmental Compliance */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Safety Compliance</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              100% Armed
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">Passed</span>
            <span className="text-xs font-semibold text-emerald-600 font-mono">ESD Active</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Emergency shutoff switches tested</span>
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                d="M0 14 Q 30 22, 60 10 T 100 4"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-2xl w-fit text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'ALL' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'UNREAD' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('WARNING')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'WARNING' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Warnings Only
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs divide-y divide-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            No notifications match your current filter.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start gap-4 transition-colors ${
                !n.read ? 'bg-blue-50/20' : 'hover:bg-gray-50/50'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  n.type === 'WARNING'
                    ? 'bg-amber-100 text-amber-700'
                    : n.type === 'SUCCESS'
                    ? 'bg-emerald-100 text-emerald-700'
                    : n.type === 'PENDING'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {n.type === 'WARNING' && <AlertTriangle className="w-5 h-5" />}
                {n.type === 'SUCCESS' && <CheckCircle2 className="w-5 h-5" />}
                {n.type === 'PENDING' && <DollarSign className="w-5 h-5" />}
                {n.type === 'INFO' && <ShieldCheck className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-2">{n.message}</p>

                <div className="flex items-center gap-3">
                  {n.actionUrl && (
                    <a
                      href={n.actionUrl}
                      className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1"
                    >
                      <span>Take Action</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleRead(n.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {n.read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDismiss(n.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
