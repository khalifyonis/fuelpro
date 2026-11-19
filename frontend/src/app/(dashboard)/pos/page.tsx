'use client';

import React, { useState } from 'react';
import {
  Fuel,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  UserCheck,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function POSTerminalPage() {
  const { toast } = useToast();

  // Selection states
  const [selectedPump, setSelectedPump] = useState<number>(1);
  const [selectedFuel, setSelectedFuel] = useState<{
    name: string;
    price: number;
    color: string;
    id: string;
  }>({
    name: 'Petrol',
    price: 2.15,
    color: '#2563eb',
    id: 'p1',
  });

  const [inputMode, setInputMode] = useState<'amount' | 'litres'>('amount');
  const [amountValue, setAmountValue] = useState<string>('50');
  const [customerType, setCustomerType] = useState<'walk_in' | 'fleet'>('walk_in');
  const [selectedCustomer, setSelectedCustomer] = useState('Metro Rapid Bus Fleet');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_MONEY' | 'CARD' | 'CREDIT'>('CASH');

  // Completed Receipt Modal
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate live values
  const numericAmount = parseFloat(amountValue) || 0;
  const calculatedLitres = inputMode === 'amount'
    ? (numericAmount / selectedFuel.price).toFixed(2)
    : amountValue;
  const calculatedTotal = inputMode === 'litres'
    ? (numericAmount * selectedFuel.price).toFixed(2)
    : numericAmount.toFixed(2);

  const handlePreset = (preset: number) => {
    setInputMode('amount');
    setAmountValue(preset.toString());
  };

  const handleProcessSale = () => {
    if (numericAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please specify litres or payment amount.',
        type: 'warning',
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const sale = {
        receiptNumber: `REC-${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleString(),
        pump: `Pump ${selectedPump}`,
        nozzle: `Nozzle ${selectedPump}-A`,
        fuel: selectedFuel.name,
        unitPrice: selectedFuel.price,
        litres: calculatedLitres,
        total: calculatedTotal,
        paymentMethod,
        customer: customerType === 'fleet' ? selectedCustomer : 'Walk-in Customer',
        cashier: 'Sarah Jenkins (Cashier)',
        branch: 'Central Station',
      };
      setCompletedSale(sale);
      setIsProcessing(false);
      toast({
        title: 'Sale Completed!',
        description: `Receipt #${sale.receiptNumber} generated successfully.`,
        type: 'success',
      });
    }, 700);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Fuel className="w-5 h-5 text-blue-600" />
            POS Terminal • Fast Fuel Dispense
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Active Terminal #01 • Cashier Shift #SHF-88912 • Central Station
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pumps Online & Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CONFIGURATION: Pump, Fuel, Quantity (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Pump Selector */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                1. Select Dispenser Pump
              </label>
              <span className="text-xs text-gray-400 font-medium">8 Pumps Configured</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((pumpNum) => {
                const isSelected = selectedPump === pumpNum;
                const isOffline = pumpNum === 8;
                return (
                  <button
                    key={pumpNum}
                    type="button"
                    disabled={isOffline}
                    onClick={() => setSelectedPump(pumpNum)}
                    className={`py-3 px-2 rounded-xl text-center font-bold text-xs transition-all border ${
                      isOffline
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    <span className="block text-sm">P{pumpNum}</span>
                    <span className="text-[10px] block opacity-80 mt-0.5">
                      {isOffline ? 'Off' : 'Ready'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Fuel Product Selector */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              2. Select Fuel Grade
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Petrol', price: 2.15, color: '#2563eb', id: 'p1', desc: 'Octane 95 Super' },
                { name: 'Diesel', price: 2.05, color: '#10b981', id: 'p2', desc: 'Ultra Low Sulphur' },
                { name: 'Kerosene', price: 1.50, color: '#f59e0b', id: 'p3', desc: 'Standard Refined' },
              ].map((fuel) => {
                const isSelected = selectedFuel.name === fuel.name;
                return (
                  <button
                    key={fuel.name}
                    type="button"
                    onClick={() => setSelectedFuel(fuel)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-600/20'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900">{fuel.name}</span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: fuel.color }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 block mb-2">{fuel.desc}</span>
                    <span className="text-lg font-black text-gray-900">
                      ${fuel.price.toFixed(2)}
                      <span className="text-xs font-normal text-gray-500"> / litre</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Fuel Quantity / Amount */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                3. Dispense Amount / Volume
              </label>
              <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setInputMode('amount')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    inputMode === 'amount' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500'
                  }`}
                >
                  By Cash ($)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('litres')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    inputMode === 'litres' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500'
                  }`}
                >
                  By Litres (L)
                </button>
              </div>
            </div>

            {/* Numeric Input */}
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">
                {inputMode === 'amount' ? '$' : 'L'}
              </span>
              <input
                type="number"
                step="any"
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 text-3xl font-black text-gray-900 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[10, 20, 30, 50, 75, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className="py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Checkout, Summary, Payment Tender (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Transaction Summary
            </h3>

            {/* Calculation Card */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 mb-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Selected Pump:</span>
                <span className="font-bold text-gray-900">Pump #{selectedPump}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Product:</span>
                <span className="font-bold text-gray-900">{selectedFuel.name}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Unit Price:</span>
                <span className="font-bold text-gray-900">${selectedFuel.price.toFixed(2)} / L</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fuel Volume:</span>
                <span className="font-black text-blue-700 text-sm">{calculatedLitres} Litres</span>
              </div>
              <div className="pt-2 border-t border-blue-200 flex justify-between items-baseline">
                <span className="font-bold text-gray-900 text-sm">Total Payable:</span>
                <span className="font-black text-2xl text-blue-700">${calculatedTotal}</span>
              </div>
            </div>

            {/* Customer Type */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Customer Account
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setCustomerType('walk_in')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border ${
                    customerType === 'walk_in'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  Walk-in Retail
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('fleet')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border ${
                    customerType === 'fleet'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  Fleet / Credit
                </button>
              </div>

              {customerType === 'fleet' && (
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
                >
                  <option value="Metro Rapid Bus Fleet">Metro Rapid Bus Fleet ($16,600 Limit Available)</option>
                  <option value="Express Taxi Cooperative">Express Taxi Cooperative ($11,800 Limit Available)</option>
                  <option value="John Doe Logistics">John Doe Logistics ($4,050 Limit Available)</option>
                </select>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Payment Tender
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Card / POS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('MOBILE_MONEY')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'MOBILE_MONEY'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCustomerType('fleet');
                    setPaymentMethod('CREDIT');
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'CREDIT'
                      ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <Receipt className="w-4 h-4 text-purple-600" />
                  <span>Fleet Credit</span>
                </button>
              </div>
            </div>

            {/* Complete Sale Button */}
            <button
              type="button"
              disabled={isProcessing || numericAmount <= 0}
              onClick={handleProcessSale}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Dispense & Complete (${calculatedTotal})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <Dialog open={!!completedSale} onOpenChange={() => setCompletedSale(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-gray-900">
              Transaction Receipt
            </DialogTitle>
          </DialogHeader>

          {completedSale && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-gray-300 font-mono text-xs space-y-3">
              <div className="text-center pb-3 border-b border-gray-200">
                <h4 className="font-black text-base tracking-wider text-gray-900">FUELPRO ENERGY LTD</h4>
                <p className="text-[11px] text-gray-500">{completedSale.branch}</p>
                <p className="text-[11px] text-gray-500">Tel: +1 (555) 019-2834</p>
                <p className="text-[10px] text-gray-400 mt-1">{completedSale.receiptNumber}</p>
              </div>

              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="font-semibold text-gray-900">{completedSale.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span className="font-semibold text-gray-900">{completedSale.cashier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-semibold text-gray-900">{completedSale.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispenser:</span>
                  <span className="font-semibold text-gray-900">{completedSale.pump} ({completedSale.nozzle})</span>
                </div>
              </div>

              <div className="py-2 border-y border-gray-200 space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Item:</span>
                  <span>{completedSale.fuel}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Volume:</span>
                  <span>{completedSale.litres} L</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Rate:</span>
                  <span>${completedSale.unitPrice.toFixed(2)} / L</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-black text-sm text-gray-900">TOTAL:</span>
                <span className="font-black text-xl text-blue-700">${completedSale.total}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Payment Method:</span>
                <span className="font-bold text-gray-700">{completedSale.paymentMethod}</span>
              </div>

              <div className="text-center pt-4 text-[10px] text-gray-400">
                <p>Thank you for fueling with FuelPro!</p>
                <p className="tracking-widest mt-1">|||| | ||||| || |||||| | ||||</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <button
              type="button"
              onClick={printReceipt}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={() => setCompletedSale(null)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
