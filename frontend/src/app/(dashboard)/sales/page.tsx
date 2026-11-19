'use client';

import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Receipt,
  Search,
  Download,
  Printer,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  X,
  Eye,
  Fuel,
  DollarSign,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Building2,
  Tag,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

export interface ForecourtSale {
  id: string;
  receiptNumber: string;
  time: string;
  cashier: string;
  pump: string;
  nozzle: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  litres: number;
  rate: number;
  total: number;
  method: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CREDIT';
  customer: string;
  vehiclePlate?: string;
  meterStart: number;
  meterEnd: number;
  status: 'COMPLETED' | 'REFUNDED';
}

const INITIAL_SALES: ForecourtSale[] = [
  {
    id: 's1',
    receiptNumber: 'REC-991245',
    time: '14:22 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 01',
    nozzle: 'NZ-01 (Petrol)',
    product: 'Petrol',
    litres: 29.07,
    rate: 2.15,
    total: 62.5,
    method: 'CASH',
    customer: 'Walk-in Retail Customer',
    vehiclePlate: 'SO-MOG-1022',
    meterStart: 184520.1,
    meterEnd: 184549.17,
    status: 'COMPLETED',
  },
  {
    id: 's2',
    receiptNumber: 'REC-991244',
    time: '14:15 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 03',
    nozzle: 'NZ-05 (Diesel)',
    product: 'Diesel',
    litres: 22.05,
    rate: 2.05,
    total: 45.2,
    method: 'CARD',
    customer: 'Walk-in Retail Customer',
    vehiclePlate: 'SO-MOG-9431',
    meterStart: 94210.0,
    meterEnd: 94232.05,
    status: 'COMPLETED',
  },
  {
    id: 's3',
    receiptNumber: 'REC-991243',
    time: '14:02 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 01',
    nozzle: 'NZ-01 (Petrol)',
    product: 'Petrol',
    litres: 33.53,
    rate: 2.15,
    total: 72.1,
    method: 'MOBILE_MONEY',
    customer: 'Walk-in (EVC Plus)',
    vehiclePlate: 'SO-MOG-5512',
    meterStart: 184486.57,
    meterEnd: 184520.1,
    status: 'COMPLETED',
  },
  {
    id: 's4',
    receiptNumber: 'REC-991242',
    time: '13:40 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 02',
    nozzle: 'NZ-03 (Diesel)',
    product: 'Diesel',
    litres: 80.0,
    rate: 2.05,
    total: 164.0,
    method: 'CREDIT',
    customer: 'Metro Rapid Bus Fleet',
    vehiclePlate: 'TX-8801',
    meterStart: 120500.0,
    meterEnd: 120580.0,
    status: 'COMPLETED',
  },
  {
    id: 's5',
    receiptNumber: 'REC-991241',
    time: '13:10 PM Today',
    cashier: 'Sarah Jenkins',
    pump: 'Pump 04',
    nozzle: 'NZ-07 (Kerosene)',
    product: 'Kerosene',
    litres: 15.0,
    rate: 1.85,
    total: 27.75,
    method: 'CASH',
    customer: 'Somali Energy Canister Refill',
    vehiclePlate: 'N/A',
    meterStart: 34100.0,
    meterEnd: 34115.0,
    status: 'COMPLETED',
  },
  {
    id: 's6',
    receiptNumber: 'REC-991240',
    time: '12:55 PM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 02',
    nozzle: 'NZ-04 (Petrol)',
    product: 'Petrol',
    litres: 45.12,
    rate: 2.15,
    total: 97.0,
    method: 'MOBILE_MONEY',
    customer: 'Zaad Mobile Money Customer',
    vehiclePlate: 'SO-MOG-7721',
    meterStart: 184441.45,
    meterEnd: 184486.57,
    status: 'COMPLETED',
  },
  {
    id: 's7',
    receiptNumber: 'REC-991239',
    time: '12:30 PM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 03',
    nozzle: 'NZ-05 (Diesel)',
    product: 'Diesel',
    litres: 120.0,
    rate: 2.05,
    total: 246.0,
    method: 'CREDIT',
    customer: 'Express Taxi Cooperative',
    vehiclePlate: 'TX-8802',
    meterStart: 94090.0,
    meterEnd: 94210.0,
    status: 'COMPLETED',
  },
  {
    id: 's8',
    receiptNumber: 'REC-991238',
    time: '12:05 PM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 01',
    nozzle: 'NZ-02 (Diesel)',
    product: 'Diesel',
    litres: 25.0,
    rate: 2.05,
    total: 51.25,
    method: 'CASH',
    customer: 'Private Hauler Pickup',
    vehiclePlate: 'SO-MOG-3011',
    meterStart: 94065.0,
    meterEnd: 94090.0,
    status: 'COMPLETED',
  },
  {
    id: 's9',
    receiptNumber: 'REC-991237',
    time: '11:42 AM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 04',
    nozzle: 'NZ-08 (Petrol)',
    product: 'Petrol',
    litres: 50.0,
    rate: 2.15,
    total: 107.5,
    method: 'CARD',
    customer: 'Mastercard Contactless',
    vehiclePlate: 'SO-MOG-6100',
    meterStart: 184391.45,
    meterEnd: 184441.45,
    status: 'COMPLETED',
  },
  {
    id: 's10',
    receiptNumber: 'REC-991236',
    time: '11:15 AM Today',
    cashier: 'Abdi Hassan',
    pump: 'Pump 02',
    nozzle: 'NZ-03 (Diesel)',
    product: 'Diesel',
    litres: 18.5,
    rate: 2.05,
    total: 37.92,
    method: 'CASH',
    customer: 'Walk-in Generator Jerrycan',
    vehiclePlate: 'N/A',
    meterStart: 120481.5,
    meterEnd: 120500.0,
    status: 'REFUNDED',
  },
];

export default function SalesPage() {
  const [sales] = useState<ForecourtSale[]>(INITIAL_SALES);
  const [selectedProduct, setSelectedProduct] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedPump, setSelectedPump] = useState<string>('ALL');
  const [selectedSale, setSelectedSale] = useState<ForecourtSale | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Compute live aggregates
  const totalVolume = useMemo(() => sales.reduce((acc, s) => acc + s.litres, 0), [sales]);
  const totalRevenue = useMemo(
    () => sales.filter((s) => s.status === 'COMPLETED').reduce((acc, s) => acc + s.total, 0),
    [sales]
  );
  const tenderCounts = useMemo(() => {
    return {
      CASH: sales.filter((s) => s.method === 'CASH').length,
      CARD: sales.filter((s) => s.method === 'CARD').length,
      MOBILE: sales.filter((s) => s.method === 'MOBILE_MONEY').length,
      CREDIT: sales.filter((s) => s.method === 'CREDIT').length,
    };
  }, [sales]);

  // Filtered dataset for TanStack table
  const filteredData = useMemo(() => {
    return sales.filter((s) => {
      const matchProduct = selectedProduct === 'ALL' || s.product === selectedProduct;
      const matchMethod = selectedMethod === 'ALL' || s.method === selectedMethod;
      const matchPump = selectedPump === 'ALL' || s.pump === selectedPump;
      return matchProduct && matchMethod && matchPump;
    });
  }, [sales, selectedProduct, selectedMethod, selectedPump]);

  // Export to CSV function
  const handleExportCsv = () => {
    const headers = ['Receipt #', 'Time', 'Cashier', 'Pump', 'Product', 'Litres', 'Rate', 'Total', 'Payment Method', 'Customer', 'Plate', 'Status'];
    const rows = filteredData.map((s) => [
      s.receiptNumber,
      s.time,
      s.cashier,
      s.pump,
      s.product,
      s.litres.toFixed(2),
      s.rate.toFixed(2),
      s.total.toFixed(2),
      s.method,
      `"${s.customer}"`,
      s.vehiclePlate || 'N/A',
      s.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fuelpro-sales-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // TanStack Table Column Definitions
  const columns: ColumnDef<ForecourtSale>[] = [
    {
      accessorKey: 'receiptNumber',
      header: 'Receipt #',
      cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedSale(row.original);
            setIsReceiptOpen(true);
          }}
          className="flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          <Receipt className="w-3.5 h-3.5 text-blue-500" />
          <span>{row.original.receiptNumber}</span>
        </button>
      ),
    },
    {
      accessorKey: 'time',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-medium text-gray-700">{row.original.time}</span>
        </div>
      ),
    },
    {
      accessorKey: 'pump',
      header: 'Dispenser',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs bg-gray-100 text-gray-800">
          {row.original.pump}
        </span>
      ),
    },
    {
      accessorKey: 'product',
      header: 'Fuel Grade',
      cell: ({ row }) => {
        const prod = row.original.product;
        const color =
          prod === 'Petrol'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : prod === 'Diesel'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-indigo-50 text-indigo-700 border-indigo-200';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
            <Fuel className="w-3 h-3" />
            {prod}
          </span>
        );
      },
    },
    {
      accessorKey: 'litres',
      header: 'Volume',
      cell: ({ row }) => (
        <span className="font-bold text-gray-900">
          {row.original.litres.toFixed(2)} <span className="text-[11px] font-normal text-gray-400">L</span>
        </span>
      ),
    },
    {
      accessorKey: 'rate',
      header: 'Rate / L',
      cell: ({ row }) => <span className="text-gray-600 font-semibold">${row.original.rate.toFixed(2)}</span>,
    },
    {
      accessorKey: 'total',
      header: 'Gross Total',
      cell: ({ row }) => (
        <span className="font-extrabold text-sm text-gray-900">
          ${row.original.total.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'method',
      header: 'Tender Method',
      cell: ({ row }) => {
        const m = row.original.method;
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700">
            {m === 'CASH' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
            {m === 'CARD' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
            {m === 'MOBILE_MONEY' && <Smartphone className="w-3.5 h-3.5 text-teal-600" />}
            {m === 'CREDIT' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
            {m.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      accessorKey: 'customer',
      header: 'Customer / Vehicle',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 truncate max-w-[150px]">{row.original.customer}</span>
          <span className="text-[11px] text-gray-400 font-mono">{row.original.vehiclePlate || 'Walk-in'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const isComp = row.original.status === 'COMPLETED';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              isComp ? 'bg-emerald-100/70 text-emerald-700' : 'bg-red-100/70 text-red-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isComp ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedSale(row.original);
              setIsReceiptOpen(true);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Inspect & Print Slip"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sales Management Top Executive Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Forecourt Sales & Transactions</h1>
            <p className="text-xs text-gray-500 font-medium">
              Enterprise real-time forecourt transaction audit ledger, tender settlement, and ESC/POS thermal slips.
            </p>
          </div>
        </div>

        {/* Live Metrics Summary Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs text-xs">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-gray-500 font-medium">Today&apos;s Gross:</span>
            <strong className="text-gray-900 font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs text-xs">
            <Fuel className="w-4 h-4 text-blue-600" />
            <span className="text-gray-500 font-medium">Throughput:</span>
            <strong className="text-gray-900 font-bold">{totalVolume.toFixed(1)} L</strong>
          </div>
        </div>
      </div>

      {/* Tender Method Distribution Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase">Cash Tenders</div>
              <div className="text-sm font-bold text-gray-900">{tenderCounts.CASH} txns</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Settled</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase">POS Cards</div>
              <div className="text-sm font-bold text-gray-900">{tenderCounts.CARD} txns</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Visa / MC</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase">Mobile Money</div>
              <div className="text-sm font-bold text-gray-900">{tenderCounts.MOBILE} txns</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">EVC / Zaad</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase">Corporate Fleet</div>
              <div className="text-sm font-bold text-gray-900">{tenderCounts.CREDIT} txns</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">On Credit</span>
        </div>
      </div>

      {/* TanStack Table with Multi-Faceted Filters */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Filter by receipt, customer, or plate..."
        onExportCsv={handleExportCsv}
        pageSize={10}
        emptyMessage="No sales transactions matched your filter criteria."
        filterComponent={
          <div className="flex flex-wrap items-center gap-2">
            {/* Fuel Grade Filter */}
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="ALL">All Fuel Grades</option>
              <option value="Petrol">Petrol (Super 95)</option>
              <option value="Diesel">Diesel (Ultra Low)</option>
              <option value="Kerosene">Kerosene</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="ALL">All Tender Types</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Debit / Credit Card</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CREDIT">Corporate Fleet Credit</option>
            </select>

            {/* Pump Selector */}
            <select
              value={selectedPump}
              onChange={(e) => setSelectedPump(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="ALL">All Dispensers</option>
              <option value="Pump 01">Pump 01 (Island 1)</option>
              <option value="Pump 02">Pump 02 (Island 1)</option>
              <option value="Pump 03">Pump 03 (Island 2)</option>
              <option value="Pump 04">Pump 04 (Island 2)</option>
            </select>
          </div>
        }
      />

      {/* Slide-Over Drawer: 80mm ESC/POS Thermal Receipt & Audit Telemetry */}
      {isReceiptOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">ESC/POS Forecourt Slip</h3>
              </div>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paper Thermal Receipt Simulator */}
            <div className="p-6 bg-gray-50 flex justify-center">
              <div className="w-full max-w-xs bg-white p-6 shadow-sm border border-gray-200 font-mono text-xs text-gray-800 space-y-3 rounded-md">
                <div className="text-center space-y-1">
                  <div className="font-black text-sm tracking-wider">*** FUELPRO PETROLEUM ***</div>
                  <div className="text-[10px] text-gray-500">Mogadishu Central Forecourt • St. 21</div>
                  <div className="text-[10px] text-gray-500">Tax ID: SO-VAT-89102-F</div>
                  <div className="text-[10px] text-gray-400">Tel: +252 61 555-7788</div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Receipt:</span>
                    <span className="font-bold">{selectedSale.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date/Time:</span>
                    <span>{selectedSale.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cashier:</span>
                    <span>{selectedSale.cashier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispenser:</span>
                    <span>{selectedSale.pump} ({selectedSale.nozzle})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span>{selectedSale.vehiclePlate || 'N/A'}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Opening Meter:</span>
                    <span>{selectedSale.meterStart.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Closing Meter:</span>
                    <span>{selectedSale.meterEnd.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-gray-300 py-2 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>{selectedSale.product}</span>
                    <span>${selectedSale.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 pl-2">
                    <span>{selectedSale.litres.toFixed(2)} L @ ${selectedSale.rate.toFixed(2)}/L</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-sm">
                    <span>TOTAL PAID:</span>
                    <span className="text-emerald-700">${selectedSale.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Payment Method:</span>
                    <span className="font-semibold">{selectedSale.method}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Customer:</span>
                    <span className="truncate max-w-[150px]">{selectedSale.customer}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-3 text-center space-y-1 text-[10px] text-gray-500">
                  <div className="font-bold">THANK YOU FOR CHOOSING FUELPRO!</div>
                  <div>Safe travels • Retain for company audit</div>
                  <div className="pt-1 font-mono text-[9px] text-gray-400">BARCODE: *{selectedSale.receiptNumber}*</div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
