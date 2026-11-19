'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthResponse, LoginCredentials } from '@/types';
import { API_BASE_URL } from '@/lib/constants';
import { isPathAllowedForRole, normalizeRole, SystemRole } from '@/lib/rbac';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  currentBranchId: string | null;
  setCurrentBranchId: (id: string) => void;
  activeRole: SystemRole;
  setActiveRole: (role: string) => void;
  hasRole: (role: string) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  canAccessPath: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo User Profiles with strict role associations
const DEMO_USERS: Record<string, any> = {
  'admin@fuelpro.com': {
    id: 'u-admin',
    email: 'admin@fuelpro.com',
    username: 'admin',
    firstName: 'Alex',
    lastName: 'Morgan',
    status: 'ACTIVE',
    companyId: 'c1',
    roles: [
      { id: 'r1', branchId: 'br-central', branchName: 'Central Station', roleId: 'role-admin', roleName: 'Super Admin', isActive: true },
    ],
  },
  'manager@fuelpro.com': {
    id: 'u-manager',
    email: 'manager@fuelpro.com',
    username: 'manager',
    firstName: 'David',
    lastName: 'Miller',
    status: 'ACTIVE',
    companyId: 'c1',
    roles: [
      { id: 'r2', branchId: 'br-central', branchName: 'Central Station', roleId: 'role-mgr', roleName: 'Station Manager', isActive: true },
    ],
  },
  'cashier@fuelpro.com': {
    id: 'u-cashier',
    email: 'cashier@fuelpro.com',
    username: 'cashier',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    status: 'ACTIVE',
    companyId: 'c1',
    roles: [
      { id: 'r3', branchId: 'br-central', branchName: 'Central Station', roleId: 'role-cashier', roleName: 'Cashier', isActive: true },
    ],
  },
  'inventory@fuelpro.com': {
    id: 'u-inventory',
    email: 'inventory@fuelpro.com',
    username: 'inventory',
    firstName: 'Elena',
    lastName: 'Rostova',
    status: 'ACTIVE',
    companyId: 'c1',
    roles: [
      { id: 'r4', branchId: 'br-central', branchName: 'Central Station', roleId: 'role-inv', roleName: 'Inventory Officer', isActive: true },
    ],
  },
  'accountant@fuelpro.com': {
    id: 'u-accountant',
    email: 'accountant@fuelpro.com',
    username: 'accountant',
    firstName: 'Robert',
    lastName: 'Sterling',
    status: 'ACTIVE',
    companyId: 'c1',
    roles: [
      { id: 'r5', branchId: 'br-central', branchName: 'Central Station', roleId: 'role-acct', roleName: 'Accountant', isActive: true },
    ],
  },
  'attendant@fuelpro.com': {
    id: 'u-attendant',
    email: 'attendant@fuelpro.com',
    username: 'attendant',
    firstName: 'Marcus',
    lastName: 'Vance',
    status: 'ACTIVE',
    companyId: 'c1',
    roles: [
      { id: 'r6', branchId: 'br-central', branchName: 'Central Station', roleId: 'role-att', roleName: 'Pump Attendant', isActive: true },
    ],
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<SystemRole>('Super Admin');
  const [isLoading, setIsLoading] = useState(true);
  const [currentBranchId, setCurrentBranchId] = useState<string | null>('br-central');
  const router = useRouter();

  const isAuthenticated = !!user;

  const setActiveRole = (roleStr: string) => {
    const normalized = normalizeRole(roleStr);
    setActiveRoleState(normalized);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fuelpro_active_role', normalized);
    }
    // Also update the user's role array so topbar profile stays perfectly in sync
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        roles: [{ ...prev.roles[0], roleName: normalized }],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('fuelpro_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const refreshAuth = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('fuelpro_user');
      const storedRole = localStorage.getItem('fuelpro_active_role');
      const token = localStorage.getItem('accessToken');

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        const resolvedRole = storedRole ? normalizeRole(storedRole) : normalizeRole(parsed.roles?.[0]?.roleName);
        setActiveRoleState(resolvedRole);
        setIsLoading(false);
        return;
      }

      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
        localStorage.setItem('fuelpro_user', JSON.stringify(data.data));
        const userRole = normalizeRole(data.data.roles?.[0]?.roleName);
        setActiveRoleState(userRole);
        localStorage.setItem('fuelpro_active_role', userRole);
        if (!currentBranchId && data.data.roles?.length > 0) {
          setCurrentBranchId(data.data.roles[0].branchId);
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('fuelpro_user');
        localStorage.removeItem('fuelpro_active_role');
        setUser(null);
      }
    } catch {
      const local = localStorage.getItem('fuelpro_user');
      if (local) {
        const parsed = JSON.parse(local);
        setUser(parsed);
        setActiveRoleState(normalizeRole(parsed.roles?.[0]?.roleName));
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentBranchId]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (credentials: LoginCredentials) => {
    const emailKey = credentials.emailOrUsername.toLowerCase().trim();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const data: { data: AuthResponse } = await res.json();
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('fuelpro_user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        if (data.data.user.roles.length > 0) {
          const userRole = normalizeRole(data.data.user.roles[0].roleName);
          setActiveRoleState(userRole);
          localStorage.setItem('fuelpro_active_role', userRole);
          setCurrentBranchId(data.data.user.roles[0].branchId);
        }
        router.push('/dashboard');
        return;
      }
    } catch {
      // Fall through to instant demo mode below
    }

    // High quality demo user resolution
    let demoProfile = DEMO_USERS['admin@fuelpro.com'];

    if (emailKey.includes('manager')) {
      demoProfile = DEMO_USERS['manager@fuelpro.com'];
    } else if (emailKey.includes('cashier')) {
      demoProfile = DEMO_USERS['cashier@fuelpro.com'];
    } else if (emailKey.includes('inventory')) {
      demoProfile = DEMO_USERS['inventory@fuelpro.com'];
    } else if (emailKey.includes('accountant')) {
      demoProfile = DEMO_USERS['accountant@fuelpro.com'];
    } else if (emailKey.includes('attendant')) {
      demoProfile = DEMO_USERS['attendant@fuelpro.com'];
    } else if (DEMO_USERS[emailKey]) {
      demoProfile = DEMO_USERS[emailKey];
    }

    const assignedRole = normalizeRole(demoProfile.roles[0].roleName);
    localStorage.setItem('accessToken', `demo-token-${Date.now()}`);
    localStorage.setItem('refreshToken', `demo-refresh-${Date.now()}`);
    localStorage.setItem('fuelpro_user', JSON.stringify(demoProfile));
    localStorage.setItem('fuelpro_active_role', assignedRole);
    setUser(demoProfile);
    setActiveRoleState(assignedRole);
    setCurrentBranchId('br-central');

    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token && !token.startsWith('demo-')) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('fuelpro_user');
      localStorage.removeItem('fuelpro_active_role');
      setUser(null);
      setCurrentBranchId(null);
      router.push('/login');
    }
  };

  const hasRole = (role: string) => {
    return activeRole === normalizeRole(role);
  };

  const hasPermission = (_resource: string, _action: string) => {
    if (activeRole === 'Super Admin') return true;
    return true;
  };

  const canAccessPath = (path: string) => {
    return isPathAllowedForRole(activeRole, path);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshAuth,
        currentBranchId,
        setCurrentBranchId,
        activeRole,
        setActiveRole,
        hasRole,
        hasPermission,
        canAccessPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
