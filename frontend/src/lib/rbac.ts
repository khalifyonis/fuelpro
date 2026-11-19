export type SystemRole =
  | 'Super Admin'
  | 'Station Manager'
  | 'Cashier'
  | 'Inventory Officer'
  | 'Accountant'
  | 'Pump Attendant';

export interface RolePermissions {
  role: SystemRole;
  allowedPaths: string[];
  description: string;
}

export const ROLE_PERMISSIONS: Record<SystemRole, RolePermissions> = {
  'Super Admin': {
    role: 'Super Admin',
    description: 'Full unconstrained enterprise control over all company assets, pricing, users, and audit logs.',
    allowedPaths: [
      '/dashboard',
      '/pos',
      '/branches',
      '/products',
      '/pumps',
      '/tanks',
      '/inventory',
      '/deliveries',
      '/shifts',
      '/customers',
      '/expenses',
      '/accounting',
      '/reports',
      '/users',
      '/maintenance',
      '/audit-logs',
      '/settings',
      '/nozzles',
      '/purchase-orders',
      '/sales',
      '/notifications',
    ],
  },
  'Station Manager': {
    role: 'Station Manager',
    description: 'Oversees station forecourt operations, shift closings, delivery offload approvals, and staff scheduling.',
    allowedPaths: [
      '/dashboard',
      '/pos',
      '/branches',
      '/products',
      '/pumps',
      '/tanks',
      '/inventory',
      '/deliveries',
      '/shifts',
      '/customers',
      '/expenses',
      '/reports',
      '/maintenance',
      '/sales',
      '/nozzles',
      '/purchase-orders',
      '/notifications',
    ],
  },
  'Cashier': {
    role: 'Cashier',
    description: 'Forecourt retail POS register sales, tender collection (Cash, Card, EVC Plus), and cashier shift handover.',
    allowedPaths: [
      '/dashboard',
      '/pos',
      '/shifts',
      '/customers',
      '/sales',
      '/notifications',
    ],
  },
  'Inventory Officer': {
    role: 'Inventory Officer',
    description: 'Underground tank wet stock dipping, road tanker offload inspection, fuel quality tests, and stock adjustments.',
    allowedPaths: [
      '/dashboard',
      '/tanks',
      '/inventory',
      '/deliveries',
      '/products',
      '/pumps',
      '/nozzles',
      '/purchase-orders',
      '/notifications',
    ],
  },
  'Accountant': {
    role: 'Accountant',
    description: 'General ledger journal vouchers, P&L statements, vendor accounts payable, customer receivables, and financial audits.',
    allowedPaths: [
      '/dashboard',
      '/accounting',
      '/expenses',
      '/reports',
      '/customers',
      '/sales',
      '/audit-logs',
      '/notifications',
    ],
  },
  'Pump Attendant': {
    role: 'Pump Attendant',
    description: 'Forecourt vehicle fueling, customer service, pump meter readings, and daily forecourt safety checklists.',
    allowedPaths: [
      '/dashboard',
      '/pos',
      '/maintenance',
      '/notifications',
    ],
  },
};

/**
 * Normalizes role string variations (e.g. "Admin", "Super Admin", "Manager", etc.)
 */
export function normalizeRole(roleString?: string | null): SystemRole {
  if (!roleString) return 'Super Admin';
  const lower = roleString.toLowerCase();
  if (lower.includes('admin')) return 'Super Admin';
  if (lower.includes('manager')) return 'Station Manager';
  if (lower.includes('cashier')) return 'Cashier';
  if (lower.includes('inventory')) return 'Inventory Officer';
  if (lower.includes('accountant') || lower.includes('finance')) return 'Accountant';
  if (lower.includes('attendant')) return 'Pump Attendant';
  return 'Super Admin';
}

/**
 * Checks if a given role is allowed to access a given URL path
 */
export function isPathAllowedForRole(role: SystemRole | string, pathname: string): boolean {
  const normRole = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[normRole];
  if (!permissions) return false;

  // Super Admin can access everything
  if (normRole === 'Super Admin') return true;

  // Dashboard root is accessible to all authenticated roles
  if (pathname === '/dashboard') return true;

  // Check matching path prefix
  return permissions.allowedPaths.some((allowed) => {
    if (allowed === pathname) return true;
    if (allowed !== '/dashboard' && pathname.startsWith(allowed)) return true;
    return false;
  });
}
