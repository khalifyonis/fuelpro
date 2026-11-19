export const APP_NAME = 'FUELPRO';
export const APP_DESCRIPTION = 'Fuel Station Management System';
export const APP_TAGLINE = 'Smarter Fuel Management. Greater Business Control.';
export const APP_SLOGAN = 'Fueling Your Success';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  STATION_MANAGER: 'Station Manager',
  SUPERVISOR: 'Supervisor',
  CASHIER: 'Cashier',
  PUMP_ATTENDANT: 'Pump Attendant',
  INVENTORY_OFFICER: 'Inventory Officer',
  ACCOUNTANT: 'Accountant',
  AUDITOR: 'Auditor',
  MAINTENANCE_TECH: 'Maintenance Technician',
} as const;

export const PAYMENT_METHODS = {
  CASH: { label: 'Cash', icon: 'Banknote' },
  MOBILE_MONEY: { label: 'Mobile Money', icon: 'Smartphone' },
  BANK_TRANSFER: { label: 'Bank Transfer', icon: 'Building2' },
  CARD: { label: 'Card', icon: 'CreditCard' },
  CREDIT: { label: 'Credit Account', icon: 'Receipt' },
} as const;

export const FUEL_COLORS: Record<string, string> = {
  'Petrol': '#2563eb',
  'Diesel': '#10b981',
  'Kerosene': '#f59e0b',
};

export const PUMP_STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#10b981',
  INACTIVE: '#6b7280',
  MAINTENANCE: '#f59e0b',
  OUT_OF_SERVICE: '#ef4444',
};

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', roles: 'all' },
  { label: 'Sales / POS', href: '/pos', icon: 'ShoppingCart', roles: ['Super Admin', 'Station Manager', 'Supervisor', 'Cashier'] },
  { group: 'Operations', items: [
    { label: 'Fuel Products', href: '/products', icon: 'Fuel', roles: ['Super Admin', 'Station Manager', 'Inventory Officer'] },
    { label: 'Pumps & Nozzles', href: '/pumps', icon: 'GaugeCircle', roles: ['Super Admin', 'Station Manager', 'Pump Attendant', 'Maintenance Technician'] },
    { label: 'Tanks', href: '/tanks', icon: 'Cylinder', roles: ['Super Admin', 'Station Manager', 'Inventory Officer'] },
    { label: 'Inventory', href: '/inventory', icon: 'Package', roles: ['Super Admin', 'Station Manager', 'Inventory Officer'] },
  ]},
  { group: 'Supply Chain', items: [
    { label: 'Deliveries', href: '/deliveries', icon: 'Truck', roles: ['Super Admin', 'Station Manager', 'Inventory Officer'] },
    { label: 'Suppliers', href: '/suppliers', icon: 'Building2', roles: ['Super Admin', 'Station Manager', 'Accountant'] },
    { label: 'Purchase Orders', href: '/purchase-orders', icon: 'ClipboardList', roles: ['Super Admin', 'Station Manager', 'Inventory Officer'] },
  ]},
  { group: 'People', items: [
    { label: 'Shifts', href: '/shifts', icon: 'Clock', roles: ['Super Admin', 'Station Manager', 'Supervisor', 'Cashier'] },
    { label: 'Customers', href: '/customers', icon: 'Users', roles: ['Super Admin', 'Station Manager', 'Cashier', 'Accountant'] },
  ]},
  { group: 'Finance', items: [
    { label: 'Sales History', href: '/sales', icon: 'Receipt', roles: ['Super Admin', 'Station Manager', 'Accountant', 'Auditor'] },
    { label: 'Expenses', href: '/expenses', icon: 'Wallet', roles: ['Super Admin', 'Station Manager', 'Accountant'] },
    { label: 'Accounting', href: '/accounting', icon: 'Calculator', roles: ['Super Admin', 'Accountant'] },
  ]},
  { group: 'Management', items: [
    { label: 'Reports', href: '/reports', icon: 'BarChart3', roles: ['Super Admin', 'Station Manager', 'Accountant', 'Auditor'] },
    { label: 'Users', href: '/users', icon: 'UserCog', roles: ['Super Admin'] },
    { label: 'Branches', href: '/branches', icon: 'MapPin', roles: ['Super Admin'] },
    { label: 'Notifications', href: '/notifications', icon: 'Bell', roles: 'all' },
    { label: 'Maintenance', href: '/maintenance', icon: 'Wrench', roles: ['Super Admin', 'Station Manager', 'Maintenance Technician'] },
    { label: 'Audit Logs', href: '/audit-logs', icon: 'FileSearch', roles: ['Super Admin', 'Auditor'] },
    { label: 'Settings', href: '/settings', icon: 'Settings', roles: ['Super Admin', 'Station Manager'] },
  ]},
];

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy HH:mm',
  input: 'yyyy-MM-dd',
  time: 'HH:mm',
  full: 'EEEE, MMMM dd, yyyy',
} as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;
