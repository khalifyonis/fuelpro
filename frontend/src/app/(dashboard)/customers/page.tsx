'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Car,
  CreditCard,
  Building2,
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  DollarSign,
  Trash2,
  X,
  ShieldCheck,
  Fuel,
  FileText,
  KeyRound,
  Gauge,
  CheckCircle2,
  AlertCircle,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Receipt,
  Settings2,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

// ============================================================================
// ENTERPRISE DATA CONTRACTS
// ============================================================================

export interface CustomerAccount {
  id: string;
  accountNumber: string;
  name: string;
  tradingName: string;
  category: 'Corporate Fleet' | 'Government' | 'Haulier / Logistics' | 'Commercial Taxi' | 'VIP Retail';
  contactPerson: string;
  roleTitle: string;
  email: string;
  phone: string;
  taxId: string;
  billingAddress: string;
  city: string;
  creditLimit: number;
  currentBalance: number;
  utilizationPct: number;
  paymentTerms: 'Pre-paid' | 'Net 7 Days' | 'Net 15 Days' | 'Net 30 Days' | 'Net 60 Days';
  pricingTier: 'Standard Retail' | 'Fleet Wholesale (-$0.05/L)' | 'Bulk Contractor (-$0.08/L)' | 'Cost + 4%';
  dailySpendCap: number;
  monthlyLitersQuota: number;
  overlimitLockout: boolean;
  pinRequired: boolean;
  odometerPrompt: boolean;
  authorizedGrades: ('Petrol' | 'Diesel' | 'Kerosene')[];
  authorizedBranches: string[];
  activeVehiclesCount: number;
  activeCardsCount: number;
  monthlyLitersLifted: number;
  status: 'Active' | 'Credit Hold' | 'Suspended';
  initials: string;
  avatarColor: string;
  createdAt: string;
}

export interface FleetVehicle {
  id: string;
  plate: string;
  fleetUnitCode: string;
  make: string;
  model: string;
  year: number;
  assignedCustomerId: string;
  assignedCustomerName: string;
  assignedDriver: string;
  driverPhone: string;
  fuelType: 'Petrol' | 'Diesel';
  tankCapacityLiters: number;
  rfidTagUid: string;
  dailyLimitLiters: number;
  monthlyLimitLiters: number;
  currentMonthLiters: number;
  currentOdometerKm: number;
  odometerStrictCheck: boolean;
  status: 'Active' | 'In Maintenance' | 'Restricted';
}

export interface CustomerLedgerEntry {
  id: string;
  date: string;
  refNumber: string;
  type: 'FUEL_DRAW' | 'INVOICE' | 'PAYMENT' | 'CREDIT_NOTE';
  description: string;
  plateNumber?: string;
  driverName?: string;
  liters?: number;
  unitPrice?: number;
  debit: number;
  credit: number;
  balanceAfter: number;
}

// ============================================================================
// INITIAL SEED DATA (ENTERPRISE GRADE)
// ============================================================================

const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'c1',
    accountNumber: 'CORP-2026-081',
    name: 'Marcus Vance',
    tradingName: 'Metro Rapid Logistics Ltd',
    category: 'Corporate Fleet',
    contactPerson: 'Marcus Vance',
    roleTitle: 'Fleet Manager',
    email: 'marcus@metrorapid.so',
    phone: '+252 61 555-7788',
    taxId: 'SO-VAT-992144',
    billingAddress: 'Airport Road, Sector 4, Wadajir',
    city: 'Mogadishu',
    creditLimit: 25000,
    currentBalance: 8400,
    utilizationPct: 34,
    paymentTerms: 'Net 30 Days',
    pricingTier: 'Fleet Wholesale (-$0.05/L)',
    dailySpendCap: 2500,
    monthlyLitersQuota: 35000,
    overlimitLockout: true,
    pinRequired: true,
    odometerPrompt: true,
    authorizedGrades: ['Petrol', 'Diesel'],
    authorizedBranches: ['Central Station', 'Airport Express', 'Port Gate West'],
    activeVehiclesCount: 5,
    activeCardsCount: 6,
    monthlyLitersLifted: 9240,
    status: 'Active',
    initials: 'MV',
    avatarColor: 'bg-blue-600',
    createdAt: '2025-11-12',
  },
  {
    id: 'c2',
    accountNumber: 'CORP-2026-092',
    name: 'David Miller',
    tradingName: 'Express Airport Taxi & Shuttles',
    category: 'Commercial Taxi',
    contactPerson: 'David Miller',
    roleTitle: 'Treasurer',
    email: 'accounts@expresstaxi.so',
    phone: '+252 61 444-1234',
    taxId: 'SO-VAT-884120',
    billingAddress: 'Maka Al Mukarama St, Km4',
    city: 'Mogadishu',
    creditLimit: 15000,
    currentBalance: 3200,
    utilizationPct: 21,
    paymentTerms: 'Net 15 Days',
    pricingTier: 'Bulk Contractor (-$0.08/L)',
    dailySpendCap: 1200,
    monthlyLitersQuota: 20000,
    overlimitLockout: true,
    pinRequired: true,
    odometerPrompt: true,
    authorizedGrades: ['Petrol'],
    authorizedBranches: ['Central Station', 'Airport Express'],
    activeVehiclesCount: 3,
    activeCardsCount: 3,
    monthlyLitersLifted: 4150,
    status: 'Active',
    initials: 'DM',
    avatarColor: 'bg-purple-600',
    createdAt: '2026-01-05',
  },
  {
    id: 'c3',
    accountNumber: 'GOV-2026-014',
    name: 'General Post & Public Works',
    tradingName: 'National Postal Logistics',
    category: 'Government',
    contactPerson: 'Farhan Ali Abdi',
    roleTitle: 'Logistics Director',
    email: 'farhan.ali@post.gov.so',
    phone: '+252 61 222-9900',
    taxId: 'GOV-EXEMPT-001',
    billingAddress: 'K4 Government Quarter',
    city: 'Mogadishu',
    creditLimit: 35000,
    currentBalance: 17350,
    utilizationPct: 50,
    paymentTerms: 'Net 60 Days',
    pricingTier: 'Fleet Wholesale (-$0.05/L)',
    dailySpendCap: 4000,
    monthlyLitersQuota: 50000,
    overlimitLockout: false,
    pinRequired: true,
    odometerPrompt: true,
    authorizedGrades: ['Petrol', 'Diesel'],
    authorizedBranches: ['Central Station', 'Industrial Bay'],
    activeVehiclesCount: 12,
    activeCardsCount: 15,
    monthlyLitersLifted: 18400,
    status: 'Active',
    initials: 'GP',
    avatarColor: 'bg-emerald-600',
    createdAt: '2025-08-20',
  },
];

const INITIAL_VEHICLES: FleetVehicle[] = [
  {
    id: 'v1',
    plate: 'TX-8801',
    fleetUnitCode: 'FLT-CAMRY-01',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    assignedCustomerId: 'c1',
    assignedCustomerName: 'Marcus Vance',
    assignedDriver: 'Ahmed Nur Hassan',
    driverPhone: '+252 61 771-0022',
    fuelType: 'Petrol',
    tankCapacityLiters: 65,
    rfidTagUid: 'RFID-9941-01',
    dailyLimitLiters: 60,
    monthlyLimitLiters: 1200,
    currentMonthLiters: 480,
    currentOdometerKm: 42150,
    odometerStrictCheck: true,
    status: 'Active',
  },
  {
    id: 'v2',
    plate: 'TX-8802',
    fleetUnitCode: 'FLT-PRIUS-02',
    make: 'Toyota',
    model: 'Prius Hybrid',
    year: 2022,
    assignedCustomerId: 'c2',
    assignedCustomerName: 'David Miller',
    assignedDriver: 'Khadar Shire',
    driverPhone: '+252 61 772-1133',
    fuelType: 'Petrol',
    tankCapacityLiters: 45,
    rfidTagUid: 'RFID-9941-02',
    dailyLimitLiters: 40,
    monthlyLimitLiters: 900,
    currentMonthLiters: 310,
    currentOdometerKm: 68300,
    odometerStrictCheck: true,
    status: 'Active',
  },
  {
    id: 'v3',
    plate: 'TX-8803',
    fleetUnitCode: 'FLT-HILUX-03',
    make: 'Toyota',
    model: 'Hilux 4x4 Double Cab',
    year: 2024,
    assignedCustomerId: 'c1',
    assignedCustomerName: 'Marcus Vance',
    assignedDriver: 'Bilal Osman',
    driverPhone: '+252 61 773-4455',
    fuelType: 'Diesel',
    tankCapacityLiters: 80,
    rfidTagUid: 'RFID-9941-03',
    dailyLimitLiters: 80,
    monthlyLimitLiters: 1800,
    currentMonthLiters: 740,
    currentOdometerKm: 19800,
    odometerStrictCheck: true,
    status: 'Active',
  },
  {
    id: 'v4',
    plate: 'GOV-5501',
    fleetUnitCode: 'POST-ISUZU-01',
    make: 'Isuzu',
    model: 'NPR 4.5T Box Truck',
    year: 2023,
    assignedCustomerId: 'c3',
    assignedCustomerName: 'General Post & Public Works',
    assignedDriver: 'Mohamed Rage',
    driverPhone: '+252 61 333-8899',
    fuelType: 'Diesel',
    tankCapacityLiters: 120,
    rfidTagUid: 'RFID-8812-01',
    dailyLimitLiters: 150,
    monthlyLimitLiters: 3200,
    currentMonthLiters: 1420,
    currentOdometerKm: 84600,
    odometerStrictCheck: true,
    status: 'Active',
  },
];

const SAMPLE_LEDGER: CustomerLedgerEntry[] = [
  {
    id: 'led-1',
    date: '2026-11-18 14:22',
    refNumber: 'TXN-99824',
    type: 'FUEL_DRAW',
    description: 'Forecourt Pump #02 Island 1 - Petrol 95',
    plateNumber: 'TX-8801',
    driverName: 'Ahmed Nur Hassan',
    liters: 55.4,
    unitPrice: 1.15,
    debit: 63.71,
    credit: 0,
    balanceAfter: 8400,
  },
  {
    id: 'led-2',
    date: '2026-11-17 09:15',
    refNumber: 'PMT-44012',
    type: 'PAYMENT',
    description: 'Corporate RTGS Bank Settlement - Dahabshiil Bank ref #DH-8812',
    debit: 0,
    credit: 2500,
    balanceAfter: 8336.29,
  },
  {
    id: 'led-3',
    date: '2026-11-16 18:40',
    refNumber: 'TXN-99411',
    type: 'FUEL_DRAW',
    description: 'Forecourt Pump #04 Island 2 - Heavy Diesel',
    plateNumber: 'TX-8803',
    driverName: 'Bilal Osman',
    liters: 74.2,
    unitPrice: 1.05,
    debit: 77.91,
    credit: 0,
    balanceAfter: 10836.29,
  },
];

export default function CustomersPage() {
  const { toast } = useToast();

  const [customers, setCustomers] = useState<CustomerAccount[]>(INITIAL_CUSTOMERS);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(INITIAL_VEHICLES);
  const [ledgerEntries] = useState<CustomerLedgerEntry[]>(SAMPLE_LEDGER);

  const [searchQuery, setSearchQuery] = useState('');
  const [accountType, setAccountType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'SPLIT' | 'TABLE'>('SPLIT');

  // Modals & Drawers
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Form tab navigation inside large enterprise customer modal
  const [activeCustomerTab, setActiveCustomerTab] = useState<'PROFILE' | 'CREDIT' | 'PRICING' | 'SECURITY'>('PROFILE');

  // Enterprise Multi-Field Customer Form State
  const [customerForm, setCustomerForm] = useState({
    name: '',
    tradingName: '',
    category: 'Corporate Fleet' as CustomerAccount['category'],
    contactPerson: '',
    roleTitle: 'Fleet Operations Director',
    email: '',
    phone: '',
    taxId: '',
    billingAddress: '',
    city: 'Mogadishu',
    creditLimit: 25000,
    paymentTerms: 'Net 30 Days' as CustomerAccount['paymentTerms'],
    pricingTier: 'Fleet Wholesale (-$0.05/L)' as CustomerAccount['pricingTier'],
    dailySpendCap: 2500,
    monthlyLitersQuota: 30000,
    overlimitLockout: true,
    pinRequired: true,
    odometerPrompt: true,
    authorizedGrades: ['Petrol', 'Diesel'] as ('Petrol' | 'Diesel' | 'Kerosene')[],
    authorizedBranches: ['Central Station'],
  });

  // Enterprise Vehicle Form State
  const [vehicleForm, setVehicleForm] = useState({
    plate: '',
    fleetUnitCode: '',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    assignedCustomerId: 'c1',
    assignedDriver: '',
    driverPhone: '',
    fuelType: 'Petrol' as 'Petrol' | 'Diesel',
    tankCapacityLiters: 65,
    rfidTagUid: '',
    dailyLimitLiters: 60,
    monthlyLimitLiters: 1200,
    currentOdometerKm: 25000,
    odometerStrictCheck: true,
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: '2500',
    method: 'RTGS_WIRE',
    refCode: 'DH-TXN-' + Math.floor(100000 + Math.random() * 900000),
    notes: 'Invoice settlement monthly batch reconciliation',
  });

  // Totals & KPI metrics
  const totalApproved = useMemo(() => customers.reduce((sum, c) => sum + c.creditLimit, 0), [customers]);
  const totalOutstanding = useMemo(() => customers.reduce((sum, c) => sum + c.currentBalance, 0), [customers]);
  const availableCreditBuffer = totalApproved - totalOutstanding;
  const totalVehiclesCount = vehicles.length;
  const totalAccountsCount = customers.length;

  // Filtered lists
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.tradingName.toLowerCase().includes(q) ||
        c.accountNumber.toLowerCase().includes(q) ||
        c.roleTitle.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q);

      const matchesType =
        accountType === 'ALL' ||
        (accountType === 'COMPANY' && c.category !== 'VIP Retail') ||
        (accountType === 'INDIVIDUAL' && (c.category === 'VIP Retail' || c.category === 'Commercial Taxi'));

      return matchesSearch && matchesType;
    });
  }, [customers, searchQuery, accountType]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = searchQuery.toLowerCase();
      return (
        v.plate.toLowerCase().includes(q) ||
        v.fleetUnitCode.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.assignedCustomerName.toLowerCase().includes(q) ||
        v.assignedDriver.toLowerCase().includes(q)
      );
    });
  }, [vehicles, searchQuery]);

  // Handlers
  const handleGradeToggle = (grade: 'Petrol' | 'Diesel' | 'Kerosene') => {
    if (customerForm.authorizedGrades.includes(grade)) {
      if (customerForm.authorizedGrades.length > 1) {
        setCustomerForm({
          ...customerForm,
          authorizedGrades: customerForm.authorizedGrades.filter((g) => g !== grade),
        });
      }
    } else {
      setCustomerForm({
        ...customerForm,
        authorizedGrades: [...customerForm.authorizedGrades, grade],
      });
    }
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email) {
      toast({
        title: 'Validation Error',
        description: 'Customer legal name and billing email are required.',
        type: 'warning',
      });
      return;
    }

    const initials = customerForm.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newCust: CustomerAccount = {
      id: `c-${Date.now()}`,
      accountNumber: `CORP-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: customerForm.name,
      tradingName: customerForm.tradingName || customerForm.name,
      category: customerForm.category,
      contactPerson: customerForm.contactPerson || customerForm.name,
      roleTitle: customerForm.roleTitle,
      email: customerForm.email,
      phone: customerForm.phone || '+252 61 000-0000',
      taxId: customerForm.taxId || 'SO-TIN-PENDING',
      billingAddress: customerForm.billingAddress || 'Industrial Area',
      city: customerForm.city || 'Mogadishu',
      creditLimit: Number(customerForm.creditLimit) || 10000,
      currentBalance: 0,
      utilizationPct: 0,
      paymentTerms: customerForm.paymentTerms,
      pricingTier: customerForm.pricingTier,
      dailySpendCap: Number(customerForm.dailySpendCap) || 2000,
      monthlyLitersQuota: Number(customerForm.monthlyLitersQuota) || 25000,
      overlimitLockout: customerForm.overlimitLockout,
      pinRequired: customerForm.pinRequired,
      odometerPrompt: customerForm.odometerPrompt,
      authorizedGrades: customerForm.authorizedGrades,
      authorizedBranches: customerForm.authorizedBranches,
      activeVehiclesCount: 0,
      activeCardsCount: 0,
      monthlyLitersLifted: 0,
      status: 'Active',
      initials: initials || 'CU',
      avatarColor: 'bg-blue-600',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCustomers([newCust, ...customers]);
    setIsAddCustomerOpen(false);
    toast({
      title: 'Corporate Account Approved',
      description: `Account ${newCust.accountNumber} for ${newCust.name} has been enrolled into forecourt billing.`,
      type: 'success',
    });
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.plate) {
      toast({
        title: 'Validation Error',
        description: 'Vehicle plate registration is required.',
        type: 'warning',
      });
      return;
    }

    const cust = customers.find((c) => c.id === vehicleForm.assignedCustomerId) || customers[0];

    const newVeh: FleetVehicle = {
      id: `v-${Date.now()}`,
      plate: vehicleForm.plate.toUpperCase().trim(),
      fleetUnitCode: vehicleForm.fleetUnitCode.toUpperCase().trim() || `FLT-${vehicleForm.plate.toUpperCase()}`,
      make: vehicleForm.make,
      model: vehicleForm.model,
      year: Number(vehicleForm.year) || 2023,
      assignedCustomerId: cust.id,
      assignedCustomerName: cust.name,
      assignedDriver: vehicleForm.assignedDriver || 'Designated Driver',
      driverPhone: vehicleForm.driverPhone || cust.phone,
      fuelType: vehicleForm.fuelType,
      tankCapacityLiters: Number(vehicleForm.tankCapacityLiters) || 60,
      rfidTagUid: vehicleForm.rfidTagUid || `RFID-${Math.floor(1000 + Math.random() * 9000)}-${vehicleForm.plate.slice(0, 2)}`,
      dailyLimitLiters: Number(vehicleForm.dailyLimitLiters) || 60,
      monthlyLimitLiters: Number(vehicleForm.monthlyLimitLiters) || 1200,
      currentMonthLiters: 0,
      currentOdometerKm: Number(vehicleForm.currentOdometerKm) || 10000,
      odometerStrictCheck: vehicleForm.odometerStrictCheck,
      status: 'Active',
    };

    setVehicles([newVeh, ...vehicles]);
    // increment customer's vehicle count
    setCustomers(
      customers.map((c) => (c.id === cust.id ? { ...c, activeVehiclesCount: c.activeVehiclesCount + 1 } : c))
    );
    setIsAddVehicleOpen(false);
    toast({
      title: 'Fleet Vehicle Enrolled',
      description: `Plate ${newVeh.plate} enrolled with RFID tag ${newVeh.rfidTagUid}.`,
      type: 'success',
    });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amt = Number(paymentForm.amount) || 0;

    setCustomers(
      customers.map((c) => {
        if (c.id === selectedCustomer.id) {
          const newBal = Math.max(0, c.currentBalance - amt);
          const newUtil = Math.round((newBal / (c.creditLimit || 1)) * 100);
          return { ...c, currentBalance: newBal, utilizationPct: newUtil };
        }
        return c;
      })
    );

    setIsPaymentOpen(false);
    toast({
      title: 'Remittance Processed',
      description: `Settlement of $${amt.toLocaleString()} recorded for ${selectedCustomer.name}. Current balance updated.`,
      type: 'success',
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Account Number,Customer Name,Trading Name,Category,Contact,Phone,Email,Credit Limit,Current Balance,Utilization %,Terms,Pricing Tier,Status',
    ];
    const rows = customers.map(
      (c) =>
        `"${c.accountNumber}","${c.name}","${c.tradingName}","${c.category}","${c.contactPerson}","${c.phone}","${c.email}",${c.creditLimit},${c.currentBalance},${c.utilizationPct}%,"${c.paymentTerms}","${c.pricingTier}","${c.status}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FuelPro_Corporate_Customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({
      title: 'Data Exported',
      description: 'Customer credit ledger downloaded in CSV format.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER ROW (Exact Match to Image 2 with Enterprise Actions)         */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Users className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Customers & Corporate Fleet Accounts
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                Enterprise forecourt v2.4
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Manage corporate fuel cards, vehicle quotas, RFID telemetry, and multi-currency credit reconciliations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('SPLIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'SPLIT'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Split Cockpit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Enterprise Ledger</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddVehicleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Car className="w-4 h-4 text-purple-600" />
            <span>Enroll Vehicle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCustomerTab('PROFILE');
              setIsAddCustomerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Customer Account</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. 4 MODERN FORECOURT KPI CARDS (Pixel-Matched to Image 2 Mockup)      */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Outstanding Balance */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Outstanding Balance
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">${totalOutstanding.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  <span>↑</span> 12%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Active credit accounts receivable
              </span>
            </div>
          </div>
          {/* Subtle Blue Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-blue-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 24C12 24 16 12 26 12C36 12 40 20 50 14C56 9 62 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Credit Approved */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Credit Approved
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">${totalApproved.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  <span>↑</span> 8%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                ${availableCreditBuffer.toLocaleString()} available credit buffer
              </span>
            </div>
          </div>
          {/* Subtle Green Wave Graphic */}
          <div className="hidden sm:block shrink-0 pr-1">
            <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 70 30" fill="none">
              <path
                d="M2 22C12 22 18 16 28 16C38 16 44 8 54 8C60 8 64 4 68 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Active Fleet Vehicles */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Active Fleet Vehicles
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">{totalVehiclesCount}</span>
                <span className="text-xs font-semibold text-gray-500">Vehicles</span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Enrolled in automated forecourt billing
              </span>
            </div>
          </div>
          {/* Mini 4-Bar Chart Graphic */}
          <div className="flex items-end gap-1 h-7 shrink-0 pr-2">
            <div className="w-1.5 h-3 bg-purple-200 rounded-xs" />
            <div className="w-1.5 h-4 bg-purple-300 rounded-xs" />
            <div className="w-1.5 h-5 bg-purple-400 rounded-xs" />
            <div className="w-1.5 h-7 bg-purple-600 rounded-xs" />
          </div>
        </div>

        {/* Card 4: Total Accounts */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Accounts
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">{totalAccountsCount}</span>
                <span className="text-xs font-semibold text-gray-500">Clients</span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                3 Corporate / 1 Hauliers
              </span>
            </div>
          </div>
          {/* Mini 4-Bar Chart Graphic */}
          <div className="flex items-end gap-1 h-7 shrink-0 pr-2">
            <div className="w-1.5 h-2 bg-amber-200 rounded-xs" />
            <div className="w-1.5 h-4 bg-amber-300 rounded-xs" />
            <div className="w-1.5 h-5 bg-amber-400 rounded-xs" />
            <div className="w-1.5 h-6 bg-amber-500 rounded-xs" />
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. SEARCH & ENTERPRISE PILL FILTERS (Exact Match to Image 2)          */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search input with pill styling */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, fleet plate number, contact, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800"
          />
        </div>

        {/* Filter Pills matching Image 2 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Account Type:</span>
          <button
            type="button"
            onClick={() => setAccountType('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              accountType === 'ALL'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200'
            }`}
          >
            All Accounts
          </button>
          <button
            type="button"
            onClick={() => setAccountType('COMPANY')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              accountType === 'COMPANY'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200'
            }`}
          >
            Corporate Fleets
          </button>
          <button
            type="button"
            onClick={() => setAccountType('INDIVIDUAL')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              accountType === 'INDIVIDUAL'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200'
            }`}
          >
            Individual Hauliers
          </button>

          <button
            type="button"
            onClick={() => {
              toast({
                title: 'Faceted Forecourt Filters',
                description: 'Filter by Payment Terms, Credit Risk Tier, or Forecourt Branch.',
                type: 'info',
              });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 ml-1 transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters ⌄</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. VIEW TOGGLE: SPLIT COCKPIT (IMAGE 2) VS ENTERPRISE MASTER TABLE    */}
      {/* ===================================================================== */}
      {viewMode === 'SPLIT' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ----------------------------------------------------------------- */}
          {/* LEFT COLUMN: CUSTOMERS ACCOUNTS CARD (Exact Match to Image 2)     */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden">
            <div>
              {/* Card Header */}
              <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-sm">Customers Accounts</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('TABLE')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-5">Customer</th>
                      <th className="py-3 px-3">Balance</th>
                      <th className="py-3 px-3">Credit Limit</th>
                      <th className="py-3 px-3 text-center">Utilization</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-blue-50/30 transition-colors">
                        {/* Customer with Avatar */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${cust.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}
                            >
                              {cust.initials}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block leading-tight text-xs hover:text-blue-600 cursor-pointer">
                                {cust.name}
                              </span>
                              <span className="text-[11px] text-gray-400 block mt-0.5">
                                {cust.roleTitle}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Balance */}
                        <td className="py-3.5 px-3 font-black text-gray-900">
                          ${cust.currentBalance.toLocaleString()}
                        </td>

                        {/* Credit Limit */}
                        <td className="py-3.5 px-3 font-semibold text-gray-500">
                          ${cust.creditLimit.toLocaleString()}
                        </td>

                        {/* Circular Progress Utilization Ring (Image 2 Match: 34%, 21%) */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center justify-center">
                            <div className="relative w-9 h-9 flex items-center justify-center">
                              <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="14"
                                  stroke="#e2e8f0"
                                  strokeWidth="3.5"
                                  fill="none"
                                />
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="14"
                                  stroke={
                                    cust.utilizationPct > 80
                                      ? '#ef4444'
                                      : cust.utilizationPct > 50
                                      ? '#f59e0b'
                                      : '#2563eb'
                                  }
                                  strokeWidth="3.5"
                                  strokeDasharray="88"
                                  strokeDashoffset={88 - (88 * cust.utilizationPct) / 100}
                                  strokeLinecap="round"
                                  fill="none"
                                />
                              </svg>
                              <span className="absolute text-[10px] font-black text-gray-800">
                                {cust.utilizationPct}%
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Badge with Dot */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              cust.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                cust.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {cust.status}
                          </span>
                        </td>

                        {/* Actions Menu */}
                        <td className="py-3.5 px-4 text-right relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveDropdown(activeDropdown === cust.id ? null : cust.id)
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeDropdown === cust.id && (
                            <div className="absolute right-4 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setIsPaymentOpen(true);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                              >
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Record Payment / Receipt</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setIsLedgerOpen(true);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                              >
                                <Receipt className="w-3.5 h-3.5 text-blue-600" />
                                <span>View Statement & Draws</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setCustomerForm({
                                    name: cust.name,
                                    tradingName: cust.tradingName,
                                    category: cust.category,
                                    contactPerson: cust.contactPerson,
                                    roleTitle: cust.roleTitle,
                                    email: cust.email,
                                    phone: cust.phone,
                                    taxId: cust.taxId,
                                    billingAddress: cust.billingAddress,
                                    city: cust.city,
                                    creditLimit: cust.creditLimit,
                                    paymentTerms: cust.paymentTerms,
                                    pricingTier: cust.pricingTier,
                                    dailySpendCap: cust.dailySpendCap,
                                    monthlyLitersQuota: cust.monthlyLitersQuota,
                                    overlimitLockout: cust.overlimitLockout,
                                    pinRequired: cust.pinRequired,
                                    odometerPrompt: cust.odometerPrompt,
                                    authorizedGrades: cust.authorizedGrades,
                                    authorizedBranches: cust.authorizedBranches,
                                  });
                                  setIsEditCustomerOpen(true);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                                <span>Edit Facility & Terms</span>
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomers(customers.filter((c) => c.id !== cust.id));
                                  setActiveDropdown(null);
                                  toast({
                                    title: 'Account Archived',
                                    description: `Customer account ${cust.name} removed.`,
                                    type: 'info',
                                  });
                                }}
                                className="w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Suspend Account</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Summary Bar */}
            <div className="p-3.5 px-5 bg-gray-50/70 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                i
              </span>
              <span>
                {filteredCustomers.length} customers •{' '}
                <strong className="text-gray-900 font-bold">
                  ${filteredCustomers.reduce((s, c) => s + c.currentBalance, 0).toLocaleString()}
                </strong>{' '}
                total balance
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* RIGHT COLUMN: FLEET VEHICLES CARD (Exact Match to Image 2)        */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden">
            <div>
              {/* Card Header */}
              <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Car className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-sm">Fleet Vehicles</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>+ Enroll Vehicle</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-5">Vehicle</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Assigned To</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredVehicles.map((veh) => (
                      <tr key={veh.id} className="hover:bg-blue-50/30 transition-colors">
                        {/* Vehicle Plate & Thumbnail */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              <Car className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <span className="font-mono font-bold text-gray-900 block text-xs tracking-tight">
                                {veh.plate}
                              </span>
                              <span className="text-[11px] text-gray-400 block mt-0.5">
                                {veh.make} {veh.model}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Fuel Type Badge */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                              veh.fuelType === 'Petrol'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            {veh.fuelType}
                          </span>
                        </td>

                        {/* Assigned Customer & Driver */}
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-gray-800 block text-xs">
                            {veh.assignedCustomerName}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            Driver: {veh.assignedDriver}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {veh.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              toast({
                                title: `Vehicle RFID Tag: ${veh.rfidTagUid}`,
                                description: `Odometer: ${veh.currentOdometerKm.toLocaleString()} km | Quota: ${veh.currentMonthLiters}/${veh.monthlyLimitLiters} L`,
                                type: 'info',
                              });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Summary Bar */}
            <div className="p-3.5 px-5 bg-gray-50/70 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Car className="w-4 h-4 text-blue-600" />
              <span>
                {vehicles.length} total vehicles •{' '}
                <strong className="text-gray-900 font-bold">100% operational</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* ENTERPRISE MASTER LEDGER TABLE (FULL 14 ENTERPRISE COLUMNS)           */
        /* ===================================================================== */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <TableIcon className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900 text-sm">
                Corporate Fleet Master Underwriting & Exposure Ledger
              </h2>
            </div>
            <div className="text-xs text-gray-500">
              Showing {filteredCustomers.length} corporate accounts
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Account ID</th>
                  <th className="py-3.5 px-4">Entity & Legal Name</th>
                  <th className="py-3.5 px-3">Classification</th>
                  <th className="py-3.5 px-3">Billing Contact</th>
                  <th className="py-3.5 px-3 text-right">Credit Line</th>
                  <th className="py-3.5 px-3 text-right">Current Balance</th>
                  <th className="py-3.5 px-3 text-center">Utilization</th>
                  <th className="py-3.5 px-3">Payment Terms</th>
                  <th className="py-3.5 px-3">Contract Pricing</th>
                  <th className="py-3.5 px-3 text-center">Fleet Size</th>
                  <th className="py-3.5 px-3 text-right">Monthly Lifted</th>
                  <th className="py-3.5 px-3">Underwriting</th>
                  <th className="py-3.5 px-4 text-right">Forecourt Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* Account ID */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {cust.accountNumber}
                    </td>

                    {/* Entity & Legal Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full ${cust.avatarColor} text-white font-black text-[10px] flex items-center justify-center shrink-0`}
                        >
                          {cust.initials}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block leading-tight text-xs">
                            {cust.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            {cust.tradingName} • TIN: {cust.taxId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700">
                        {cust.category}
                      </span>
                    </td>

                    {/* Billing Contact */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-800 block text-[11px]">
                        {cust.contactPerson}
                      </span>
                      <span className="text-[10px] text-gray-400 block">{cust.phone}</span>
                    </td>

                    {/* Credit Line */}
                    <td className="py-3 px-3 text-right font-semibold text-gray-700">
                      ${cust.creditLimit.toLocaleString()}
                    </td>

                    {/* Current Balance */}
                    <td className="py-3 px-3 text-right font-black text-gray-900">
                      ${cust.currentBalance.toLocaleString()}
                    </td>

                    {/* Utilization Bar */}
                    <td className="py-3 px-3">
                      <div className="w-24 mx-auto space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{cust.utilizationPct}%</span>
                          <span className="text-gray-400">
                            ${(cust.creditLimit - cust.currentBalance).toLocaleString()} left
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              cust.utilizationPct > 80
                                ? 'bg-rose-500'
                                : cust.utilizationPct > 50
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(cust.utilizationPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Payment Terms */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-700 text-[11px] block">
                        {cust.paymentTerms}
                      </span>
                    </td>

                    {/* Contract Pricing */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold block w-fit">
                        {cust.pricingTier}
                      </span>
                    </td>

                    {/* Fleet Size */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-gray-800">
                        {cust.activeVehiclesCount} veh
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {cust.activeCardsCount} tags
                      </span>
                    </td>

                    {/* Monthly Volume */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-800">
                      {cust.monthlyLitersLifted.toLocaleString()} L
                    </td>

                    {/* Underwriting Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cust.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {cust.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setIsPaymentOpen(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Remit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setIsLedgerOpen(true);
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Ledger
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. ENTERPRISE MULTI-TAB MODAL: NEW CUSTOMER ACCOUNT (MILLIONS SAAS)  */}
      {/* ===================================================================== */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Enroll Corporate Customer & Fleet Account</h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Configure legal entity, underwriting credit facility, forecourt fuel pricing, and security rules.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center border-b border-gray-200 bg-slate-50 px-6 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveCustomerTab('PROFILE')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCustomerTab === 'PROFILE'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Legal Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCustomerTab('CREDIT')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCustomerTab === 'CREDIT'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>2. Credit Facility & Settlement</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCustomerTab('PRICING')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCustomerTab === 'PRICING'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>3. Fuel Authorizations</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCustomerTab('SECURITY')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCustomerTab === 'SECURITY'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>4. Forecourt Security</span>
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <form onSubmit={handleCreateCustomer} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: PROFILE */}
              {activeCustomerTab === 'PROFILE' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Legal Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Metro Rapid Logistics Ltd"
                        value={customerForm.name}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Trading Name / DBA
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Metro Express"
                        value={customerForm.tradingName}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, tradingName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Entity Category
                      </label>
                      <select
                        value={customerForm.category}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            category: e.target.value as CustomerAccount['category'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium bg-white"
                      >
                        <option value="Corporate Fleet">Corporate Fleet</option>
                        <option value="Government">Government / Public Agency</option>
                        <option value="Haulier / Logistics">Haulier / Logistics</option>
                        <option value="Commercial Taxi">Commercial Taxi / Shuttle</option>
                        <option value="VIP Retail">VIP Retail Account</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Tax / VAT Registration ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SO-VAT-992144"
                        value={customerForm.taxId}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, taxId: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        City / Forecourt Hub
                      </label>
                      <input
                        type="text"
                        value={customerForm.city}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, city: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Primary Billing Contact *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Vance"
                        value={customerForm.contactPerson}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, contactPerson: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Fleet Manager"
                        value={customerForm.roleTitle}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, roleTitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Official Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+252 61 555-7788"
                        value={customerForm.phone}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Billing Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="invoicing@company.so"
                      value={customerForm.email}
                      onChange={(e) =>
                        setCustomerForm({ ...customerForm, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Registered Office Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Airport Road, Sector 4, Wadajir District"
                      value={customerForm.billingAddress}
                      onChange={(e) =>
                        setCustomerForm({ ...customerForm, billingAddress: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT FACILITY */}
              {activeCustomerTab === 'CREDIT' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Approved Forecourt Credit Line ($ USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                          $
                        </span>
                        <input
                          type="number"
                          required
                          min="1000"
                          step="500"
                          value={customerForm.creditLimit}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              creditLimit: Number(e.target.value),
                            })
                          }
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-black text-gray-900"
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        Maximum revolving balance allowed before nozzle lockout.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Settlement Payment Terms *
                      </label>
                      <select
                        value={customerForm.paymentTerms}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            paymentTerms: e.target.value as CustomerAccount['paymentTerms'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium bg-white"
                      >
                        <option value="Pre-paid">Pre-paid Escrow Deposit</option>
                        <option value="Net 7 Days">Net 7 Days</option>
                        <option value="Net 15 Days">Net 15 Days</option>
                        <option value="Net 30 Days">Net 30 Days (Standard Corporate)</option>
                        <option value="Net 60 Days">Net 60 Days (Government Tier)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Daily Forecourt Spend Cap ($ USD)
                      </label>
                      <input
                        type="number"
                        value={customerForm.dailySpendCap}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            dailySpendCap: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Monthly Volume Quota (Liters)
                      </label>
                      <input
                        type="number"
                        value={customerForm.monthlyLitersQuota}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            monthlyLitersQuota: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customerForm.overlimitLockout}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            overlimitLockout: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-amber-900 block">
                          Enforce Automatic Nozzle Lockout on Credit Limit Breach
                        </span>
                        <span className="text-[11px] text-amber-700 block mt-0.5">
                          When outstanding draws reach 100% of approved credit, dispenser will decline authorization.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING & FUEL AUTHORIZATION */}
              {activeCustomerTab === 'PRICING' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Contract Fuel Pricing Tier *
                    </label>
                    <select
                      value={customerForm.pricingTier}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          pricingTier: e.target.value as CustomerAccount['pricingTier'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium bg-white"
                    >
                      <option value="Standard Retail">Standard Forecourt Retail Price</option>
                      <option value="Fleet Wholesale (-$0.05/L)">Fleet Wholesale (-$0.05/L off Totem)</option>
                      <option value="Bulk Contractor (-$0.08/L)">Bulk Contractor (-$0.08/L off Totem)</option>
                      <option value="Cost + 4%">Refinery Landed Cost + 4% Margin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Authorized Fuel Grades
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Petrol', 'Diesel', 'Kerosene'] as const).map((grade) => {
                        const isChecked = customerForm.authorizedGrades.includes(grade);
                        return (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => handleGradeToggle(grade)}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            <span className="text-xs">{grade}</span>
                            {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Authorized Station Network Branches
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700">
                      All Network Branches Authorized (Central Station, Airport Express, Port Gate West, Industrial Bay)
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FORECOURT SECURITY */}
              {activeCustomerTab === 'SECURITY' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customerForm.pinRequired}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, pinRequired: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-blue-950 block">
                          Require 4-Digit Driver PIN at Forecourt Dispenser
                        </span>
                        <span className="text-[11px] text-blue-700 block mt-0.5">
                          Prevents unauthorized vehicle fuel theft by prompting driver for cryptographic PIN on keypad.
                        </span>
                      </div>
                    </label>

                    <div className="border-t border-blue-200/60 pt-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customerForm.odometerPrompt}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              odometerPrompt: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-blue-950 block">
                            Mandatory Odometer Mileage Prompt at Pump
                          </span>
                          <span className="text-[11px] text-blue-700 block mt-0.5">
                            Driver must enter vehicle odometer (km) prior to nozzle unholstering for automated fuel economy audits.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {activeCustomerTab !== 'PROFILE' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeCustomerTab === 'SECURITY') setActiveCustomerTab('PRICING');
                        else if (activeCustomerTab === 'PRICING') setActiveCustomerTab('CREDIT');
                        else if (activeCustomerTab === 'CREDIT') setActiveCustomerTab('PROFILE');
                      }}
                      className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                      ← Previous Step
                    </button>
                  )}

                  {activeCustomerTab !== 'SECURITY' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeCustomerTab === 'PROFILE') setActiveCustomerTab('CREDIT');
                        else if (activeCustomerTab === 'CREDIT') setActiveCustomerTab('PRICING');
                        else if (activeCustomerTab === 'PRICING') setActiveCustomerTab('SECURITY');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20"
                    >
                      Approve & Enroll Customer
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. MODAL: ENROLL FLEET VEHICLE & RFID FUEL CARD                       */}
      {/* ===================================================================== */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-purple-200" />
                <div>
                  <h3 className="text-base font-bold">Enroll Fleet Vehicle</h3>
                  <p className="text-xs text-purple-200">
                    Bind RFID fuel keyfob, tank capacity, and driver fuel quotas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVehicleOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Plate Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TX-8809"
                    value={vehicleForm.plate}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, plate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Fleet Unit Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FLT-CAMRY-09"
                    value={vehicleForm.fleetUnitCode}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, fleetUnitCode: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Assign to Corporate Account *
                </label>
                <select
                  value={vehicleForm.assignedCustomerId}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, assignedCustomerId: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    value={vehicleForm.make}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, make: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={vehicleForm.model}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, model: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fuel Grade</label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        fuelType: e.target.value as 'Petrol' | 'Diesel',
                      })
                    }
                    className="w-full px-2.5 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tank Capacity (Liters)
                  </label>
                  <input
                    type="number"
                    value={vehicleForm.tankCapacityLiters}
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        tankCapacityLiters: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Assigned RFID Keyfob UID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RFID-8841-09"
                    value={vehicleForm.rfidTagUid}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, rfidTagUid: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-purple-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Designated Driver
                  </label>
                  <input
                    type="text"
                    placeholder="Driver full name"
                    value={vehicleForm.assignedDriver}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, assignedDriver: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Driver Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+252 61 ..."
                    value={vehicleForm.driverPhone}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, driverPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20"
                >
                  Enroll Vehicle & Activate Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. MODAL: RECORD PAYMENT & REMITTANCE                                  */}
      {/* ===================================================================== */}
      {isPaymentOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Record Customer Remittance</h3>
                <p className="text-xs text-emerald-200">{selectedCustomer.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 block font-bold">Outstanding Balance</span>
                  <span className="text-lg font-black text-gray-900">
                    ${selectedCustomer.currentBalance.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block font-bold">Credit Limit</span>
                  <span className="text-xs font-bold text-gray-600">
                    ${selectedCustomer.creditLimit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Settlement Amount ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="10"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-base font-black text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tender Method</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, method: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium bg-white"
                  >
                    <option value="RTGS_WIRE">RTGS Bank Wire</option>
                    <option value="CHEQUE">Company Cheque</option>
                    <option value="CASH">Cash Till Drop</option>
                    <option value="MOBILE_MONEY">EVC Plus / Zaad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ref / Cheque #</label>
                  <input
                    type="text"
                    value={paymentForm.refCode}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, refCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Remittance Memo</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Post Payment & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. MODAL: STATEMENT & DRAW LEDGER AUDIT                                */}
      {/* ===================================================================== */}
      {isLedgerOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Customer Account Statement</h3>
                <p className="text-xs text-blue-200">
                  {selectedCustomer.name} • {selectedCustomer.accountNumber} • Current Balance: ${selectedCustomer.currentBalance.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLedgerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold text-[11px] uppercase">
                    <th className="py-2">Date</th>
                    <th className="py-2">Ref #</th>
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Debit (+)</th>
                    <th className="py-2 text-right">Credit (-)</th>
                    <th className="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {ledgerEntries.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="py-2.5 text-gray-500 font-mono text-[11px]">{row.date}</td>
                      <td className="py-2.5 font-mono text-blue-600 font-bold">{row.refNumber}</td>
                      <td className="py-2.5 text-gray-800">
                        {row.description}
                        {row.plateNumber && (
                          <span className="block text-[10px] text-gray-400 font-mono">
                            Vehicle: {row.plateNumber} • {row.liters} L
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right font-black text-rose-600">
                        {row.debit > 0 ? `$${row.debit.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-2.5 text-right font-black text-emerald-600">
                        {row.credit > 0 ? `$${row.credit.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-2.5 text-right font-black text-gray-900">
                        ${row.balanceAfter.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 px-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold">
                Payment Terms: {selectedCustomer.paymentTerms}
              </span>
              <button
                type="button"
                onClick={() => setIsLedgerOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
