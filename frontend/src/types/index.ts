// User & Auth types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: string;
  createdAt: string;
  roles: UserBranchRole[];
}

export interface UserBranchRole {
  id: string;
  branchId: string;
  branchName: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

// Branch
export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

// Fuel Product
export interface FuelProduct {
  id: string;
  code: string;
  name: string;
  unit: string;
  color?: string;
  isActive: boolean;
  currentPrice?: FuelPrice;
}

export interface FuelPrice {
  id: string;
  productId: string;
  branchId?: string;
  costPrice: number;
  sellingPrice: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isApproved: boolean;
}

// Pump & Nozzle
export interface Pump {
  id: string;
  branchId: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  nozzles: Nozzle[];
}

export interface Nozzle {
  id: string;
  pumpId: string;
  productId: string;
  productName: string;
  label: string;
  currentMeterReading: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

// Tank
export interface Tank {
  id: string;
  branchId: string;
  productId: string;
  productName: string;
  name: string;
  code: string;
  capacity: number;
  currentStock: number;
  minimumLevel: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';
  fillPercentage: number;
}

export interface TankReading {
  id: string;
  tankId: string;
  readingDate: string;
  dipReading: number;
  calculatedVolume: number;
  variance?: number;
  readBy: string;
  notes?: string;
}

// Sale
export interface Sale {
  id: string;
  branchId: string;
  shiftId?: string;
  cashierId: string;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  saleNumber: string;
  saleDate: string;
  status: 'COMPLETED' | 'VOIDED' | 'REFUNDED';
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  items: SaleItem[];
  payments: Payment[];
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  nozzleId?: string;
  pumpName?: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  openingMeter?: number;
  closingMeter?: number;
}

// Payment
export interface Payment {
  id: string;
  saleId?: string;
  method: 'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CARD' | 'CREDIT';
  amount: number;
  transactionFee: number;
  netAmount: number;
  reference?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIAL';
}

// Shift
export interface Shift {
  id: string;
  branchId: string;
  cashierId: string;
  cashierName: string;
  shiftNumber: string;
  startTime: string;
  endTime?: string;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'REOPENED';
  openingCash: number;
  expectedCash: number;
  actualCash: number;
  cashVariance: number;
  totalSales: number;
  totalTransactions: number;
  mobileMoney: number;
  cardPayments: number;
  creditSales: number;
}

// Delivery
export interface Delivery {
  id: string;
  branchId: string;
  supplierId: string;
  supplierName: string;
  deliveryNumber: string;
  deliveryDate: string;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'RECEIVED' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
  totalExpected: number;
  totalReceived: number;
  variance: number;
  items: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  productId: string;
  productName: string;
  tankId?: string;
  expectedQuantity: number;
  receivedQuantity: number;
  variance: number;
}

// Supplier
export interface Supplier {
  id: string;
  name: string;
  code?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  balance: number;
  isActive: boolean;
}

// Customer
export interface Customer {
  id: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  creditLimit: number;
  currentBalance: number;
  paymentTermDays: number;
  isActive: boolean;
  vehicles: CustomerVehicle[];
}

export interface CustomerVehicle {
  id: string;
  plateNumber: string;
  make?: string;
  model?: string;
  fuelType?: string;
}

// Expense
export interface Expense {
  id: string;
  branchId: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  description: string;
  vendor?: string;
  expenseDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';
}

// Notification
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Approval
export interface Approval {
  id: string;
  type: string;
  referenceId: string;
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  reviewedBy?: string;
  comments?: string;
}

// Equipment & Maintenance
export interface Equipment {
  id: string;
  branchId: string;
  name: string;
  type: string;
  status: 'OPERATIONAL' | 'FAULTY' | 'UNDER_MAINTENANCE' | 'DECOMMISSIONED';
  lastServiceDate?: string;
  nextServiceDate?: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  equipmentId: string;
  equipmentName: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo?: string;
  scheduledDate?: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: any;
  after?: any;
  reason?: string;
  createdAt: string;
}

// Reports
export interface DashboardKPI {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  branchId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Purchase Order
export interface PurchaseOrder {
  id: string;
  branchId: string;
  supplierId: string;
  supplierName: string;
  orderNumber: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: string;
  totalAmount: number;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
}

// System Settings
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
}
