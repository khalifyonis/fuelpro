'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Fuel,
  GaugeCircle,
  Cylinder,
  Package,
  Truck,
  ShoppingCart,
  Clock,
  Wallet,
  Calculator,
  Wrench,
  FileSearch,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { isPathAllowedForRole, normalizeRole, SystemRole } from '@/lib/rbac';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activeRole?: string;
}

export function Sidebar({ collapsed = false, activeRole: propRole }: SidebarProps) {
  const pathname = usePathname();
  const { user, activeRole: authRole, logout } = useAuth();
  const currentRole: SystemRole = normalizeRole(propRole || authRole);

  const allNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'POS Terminal', href: '/pos', icon: ShoppingCart },
    { label: 'Stations', href: '/branches', icon: Building2 },
    { label: 'Products', href: '/products', icon: Fuel },
    { label: 'Pumps & Nozzles', href: '/pumps', icon: GaugeCircle },
    { label: 'Tanks', href: '/tanks', icon: Cylinder },
    { label: 'Inventory', href: '/inventory', icon: Package },
    { label: 'Deliveries', href: '/deliveries', icon: Truck },
    { label: 'Shifts', href: '/shifts', icon: Clock },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Expenses', href: '/expenses', icon: Wallet },
    { label: 'Accounting', href: '/accounting', icon: Calculator },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Users', href: '/users', icon: Users },
    { label: 'Maintenance', href: '/maintenance', icon: Wrench },
    { label: 'Audit Logs', href: '/audit-logs', icon: FileSearch },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  // RBAC Permission Filter: STRICTLY filter sidebar navigation by active role
  const visibleNavItems = allNavItems.filter((item) => isPathAllowedForRole(currentRole, item.href));

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-[#0f1729] text-white flex flex-col justify-between select-none border-r border-slate-800',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Header with Brand Logo */}
      <div>
        <div className="flex items-center px-6 py-5 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* FUELPRO Yellow Flame Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/20">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path
                  d="M12 7.5a4.5 4.5 0 0 0-4.5 4.5c0 1.5.75 2.8 1.9 3.6.4.3.9-.1.8-.6-.2-.9-.1-1.9.4-2.7.5-.8 1.4-1.3 2.4-1.3.6 0 1 .4 1 1 0 1-.5 1.9-1.3 2.4-.4.3-.2.9.3.9.7 0 1.5-.3 2-1 .9-1 1-2.4.6-3.7-.4-1.3-1.6-2.5-3.1-3.1z"
                  fill="#0f1729"
                  opacity="0.25"
                />
              </svg>
            </div>
            {!collapsed && (
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  FUEL<span className="text-amber-400">PRO</span>
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase block font-medium">
                  Forecourt Management
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Role Access Scope Badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Scope:</span>
            </span>
            <span className="font-bold text-amber-400 text-[11px] truncate max-w-[130px]">
              {currentRole}
            </span>
          </div>
        )}

        {/* Navigation List: ONLY shows permitted modules */}
        <nav className="px-3 py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] scrollbar-none">
          {visibleNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <div
          className={cn(
            'flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase shadow-sm">
              {user ? `${user.firstName?.[0] || 'A'}${user.lastName?.[0] || 'M'}` : 'AD'}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0f1729]" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="block text-xs font-bold text-white truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'Alex Morgan'}
                </span>
                <span className="block text-[10px] text-amber-400 font-medium truncate">
                  {currentRole}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
