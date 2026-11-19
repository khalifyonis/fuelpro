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
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              System Alerts & Operational Notifications
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Real-time event triggers for tank levels, equipment maintenance, tanker arrivals, and manager sign-offs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
            >
              <Check className="w-4 h-4 text-gray-500" />
              <span>Mark All as Read</span>
            </button>
          )}
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
