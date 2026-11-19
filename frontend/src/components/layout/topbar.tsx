'use client';

import React from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Building2,
  Calendar,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  onToggleSidebar: () => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
  activeRole?: string;
  onChangeRole?: (role: string) => void;
}

export function Topbar({
  onToggleSidebar,
  selectedBranch,
  onSelectBranch,
  selectedPeriod = 'Last 30 Days',
  onSelectPeriod,
  activeRole: propRole,
  onChangeRole: propChangeRole,
}: TopbarProps) {
  const { user, activeRole: authRole, setActiveRole, logout } = useAuth();
  const currentRole = propRole || authRole;

  const handleRoleChange = (r: string) => {
    setActiveRole(r);
    if (propChangeRole) propChangeRole(r);
  };

  const branches = [
    'Central Station',
    'North Station',
    'East Station',
    'West Station',
  ];

  const periods = [
    'Today',
    'This Week',
    'Last 30 Days',
    'This Month',
    'This Quarter',
    'This Year',
  ];

  const roles = [
    'Super Admin',
    'Station Manager',
    'Cashier',
    'Inventory Officer',
    'Accountant',
    'Pump Attendant',
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200/80 shadow-xs">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything across forecourt..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Right Controls: Branch, Interactive Role Switcher, Period Filter, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Branch Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{selectedBranch}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {branches.map((b) => (
              <DropdownMenuItem
                key={b}
                onSelect={() => onSelectBranch(b)}
                onClick={() => onSelectBranch(b)}
                className={selectedBranch === b ? 'font-semibold text-blue-600 bg-blue-50' : ''}
              >
                {b}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Live Interactive Role Scope Switcher (Direct Native + Dropdown combo for 100% responsiveness) */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-gray-500 font-medium">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent font-bold text-amber-900 border-none outline-none cursor-pointer text-xs pr-1 focus:ring-0"
              title="Switch user role to test permissions"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="font-semibold text-gray-900 bg-white">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date / Period Filter */}
        {onSelectPeriod && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors hidden sm:flex">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>{selectedPeriod}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {periods.map((p) => (
                <DropdownMenuItem
                  key={p}
                  onSelect={() => onSelectPeriod(p)}
                  onClick={() => onSelectPeriod(p)}
                  className={selectedPeriod === p ? 'font-semibold text-blue-600' : ''}
                >
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 p-1 pl-2 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                {user ? `${user.firstName?.[0] || 'U'}` : 'A'}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-bold text-gray-900 block leading-tight">
                  {user ? `${user.firstName} ${user.lastName}` : 'Alex Morgan'}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold block">
                  {currentRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings">Account Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/audit-logs">Activity History</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
