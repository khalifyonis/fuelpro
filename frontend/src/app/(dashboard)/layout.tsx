'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { isPathAllowedForRole, ROLE_PERMISSIONS, normalizeRole } from '@/lib/rbac';
import { ShieldAlert, ArrowLeft, LayoutDashboard, KeyRound } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Central Station');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');

  const pathname = usePathname();
  const { activeRole, setActiveRole } = useAuth();

  const normalizedRole = normalizeRole(activeRole);
  const isAllowed = isPathAllowedForRole(normalizedRole, pathname);
  const currentPermissions = ROLE_PERMISSIONS[normalizedRole];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar with dynamic role-filtered navigation passed explicitly */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeRole={normalizedRole}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          collapsed ? 'ml-20' : 'ml-64'
        )}
      >
        <Topbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          activeRole={normalizedRole}
          onChangeRole={setActiveRole}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-[1680px] w-full mx-auto overflow-y-auto">
          {isAllowed ? (
            children
          ) : (
            /* ACCESS RESTRICTED / PERMISSION DENIED GUARD */
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto text-center px-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-sm border border-amber-200">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
                Access Restricted: Role Permissions Enforced
              </h2>

              <p className="text-xs text-gray-500 max-w-md mb-6 leading-relaxed">
                Your currently active session role (
                <strong className="text-amber-700 font-bold">{normalizedRole}</strong>) is restricted by enterprise policy from accessing the{' '}
                <code className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-800 font-mono text-[11px] font-bold">
                  {pathname}
                </code>{' '}
                module.
              </p>

              {/* Allowed Modules for this role */}
              <div className="w-full bg-white p-5 rounded-2xl border border-gray-200 shadow-xs mb-6 text-left">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Permitted Forecourt Modules for {normalizedRole}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentPermissions?.allowedPaths.map((path) => (
                    <Link
                      key={path}
                      href={path}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 transition-colors"
                    >
                      {path.replace('/', '').toUpperCase() || 'DASHBOARD'}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Return to My Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveRole('Super Admin')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
                >
                  <KeyRound className="w-4 h-4 text-gray-500" />
                  <span>Switch to Admin Scope</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
