'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Building2,
  Globe,
  Receipt,
  Bell,
  Shield,
  Sliders,
  Printer,
  Radio,
  CheckCircle2,
  Flame,
  Search,
  Filter,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function SettingsPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'COMPANY' | 'THRESHOLDS' | 'RECEIPT' | 'ATG'>('COMPANY');

  const [company, setCompany] = useState({
    name: 'FuelPro Energy Somalia Ltd',
    registrationNumber: 'FP-2026-98124',
    taxId: 'TAX-88776655',
    address: '100 Energy Boulevard, Forecourt Plaza, KM4',
    city: 'Mogadishu',
    country: 'Somalia',
    phone: '+252 61 555-0199',
    email: 'contact@fuelpro.so',
    currency: 'USD ($)',
    timezone: 'Africa/Mogadishu (EAT UTC+3)',
    unit: 'Litre (L)',
  });

  const [thresholds, setThresholds] = useState({
    lowStockAlertPct: 20,
    criticalStockAlertPct: 10,
    meterTolerancePct: 0.25,
    maxCashDrawerFloat: 2500,
    autoCloseShiftHours: 12,
  });

  const [receipt, setReceipt] = useState({
    headerTagline: 'Smarter Fuel Management • Premium Clean Energy',
    footerMessage: 'Thank you for choosing FuelPro! Drive Safely.',
    showTaxBreakdown: true,
    showPumpMeterReadings: true,
  });

  const [atg, setAtg] = useState({
    protocol: 'Veeder-Root TLS-450 / TLS-350',
    gatewayIp: '192.168.1.180',
    port: '10001',
    pollIntervalSec: 30,
    status: 'CONNECTED',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Settings Saved',
        description: 'Forecourt operational thresholds and parameters have been updated.',
        type: 'success',
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner matching Modern Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Enterprise Forecourt Settings & Configuration
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Company legal entity profile, operational alert thresholds, 80mm thermal receipt header/footer, and Veeder-Root ATG probe telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration Changes'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Colored Modern Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Low Stock Alert with Blue Wave Sparkline */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            {/* Blue Wave SVG Sparkline */}
            <svg className="w-16 h-8 text-blue-500" viewBox="0 0 64 32" fill="none">
              <path
                d="M2 24 C 14 26, 20 8, 32 14 C 44 20, 52 4, 62 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Reserve Trigger Level
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-gray-900">{thresholds.lowStockAlertPct}% Volume</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                Automatic Alert
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Requisition notification dispatched to manager</p>
          </div>
        </div>

        {/* Card 2: Meter Tolerance with Green Wave Sparkline */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            {/* Green Wave SVG Sparkline */}
            <svg className="w-16 h-8 text-emerald-500" viewBox="0 0 64 32" fill="none">
              <path
                d="M2 22 C 12 18, 22 28, 34 16 C 46 6, 54 14, 62 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Meter Audit Tolerance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-gray-900">±{thresholds.meterTolerancePct}%</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                Legal Spec
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Weights and measures regulatory compliance</p>
          </div>
        </div>

        {/* Card 3: Safe Drawer Float with Purple Mini Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            {/* Purple Mini Bar Chart */}
            <div className="flex items-end gap-1 h-8">
              <span className="w-1.5 h-3 bg-purple-200 rounded-t-sm" />
              <span className="w-1.5 h-5 bg-purple-300 rounded-t-sm" />
              <span className="w-1.5 h-7 bg-purple-500 rounded-t-sm" />
              <span className="w-1.5 h-6 bg-purple-400 rounded-t-sm" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Max Cash Drawer Float
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-gray-900">${thresholds.maxCashDrawerFloat}</span>
              <span className="text-xs font-semibold text-purple-600">Skim Trigger</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Mandatory blind safe drop threshold</p>
          </div>
        </div>

        {/* Card 4: Auto Shift Timeout with Amber Mini Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            {/* Amber Mini Bar Chart */}
            <div className="flex items-end gap-1 h-8">
              <span className="w-1.5 h-4 bg-amber-200 rounded-t-sm" />
              <span className="w-1.5 h-6 bg-amber-300 rounded-t-sm" />
              <span className="w-1.5 h-8 bg-amber-500 rounded-t-sm" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Shift Max Duration
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-gray-900">{thresholds.autoCloseShiftHours} Hours</span>
              <span className="text-xs font-semibold text-amber-600">Hard Cap</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Auto-lock forecourt register handover</p>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Pill Bar (Configuration Tabs) */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 mr-1">Section:</span>
        {[
          { id: 'COMPANY', label: 'Company Profile & Entity' },
          { id: 'THRESHOLDS', label: 'Operating Thresholds' },
          { id: 'RECEIPT', label: 'Thermal Slip Layout' },
          { id: 'ATG', label: 'Veeder-Root ATG Telemetry' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/90'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Split Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Active Configuration Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                {activeTab === 'COMPANY'
                  ? 'Company Legal Entity Profile'
                  : activeTab === 'THRESHOLDS'
                    ? 'Forecourt Operating Thresholds'
                    : activeTab === 'RECEIPT'
                      ? '80mm Thermal Receipt Options'
                      : 'Veeder-Root TLS Probe Configuration'}
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Active
            </span>
          </div>

          {activeTab === 'COMPANY' && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Company Trading Name</label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Commercial Tax ID</label>
                  <input
                    type="text"
                    value={company.taxId}
                    onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Company Reg #</label>
                  <input
                    type="text"
                    value={company.registrationNumber}
                    onChange={(e) => setCompany({ ...company, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Head Office Street Address</label>
                <input
                  type="text"
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">City & Country</label>
                  <input
                    type="text"
                    value={`${company.city}, ${company.country}`}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Operating Currency</label>
                  <input
                    type="text"
                    value={company.currency}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-600 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'THRESHOLDS' && (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Low Wet Stock Warning (%)</label>
                  <input
                    type="number"
                    value={thresholds.lowStockAlertPct}
                    onChange={(e) => setThresholds({ ...thresholds, lowStockAlertPct: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Critical Stock Shutoff (%)</label>
                  <input
                    type="number"
                    value={thresholds.criticalStockAlertPct}
                    onChange={(e) => setThresholds({ ...thresholds, criticalStockAlertPct: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Cash Float in POS Drawer ($)</label>
                  <input
                    type="number"
                    value={thresholds.maxCashDrawerFloat}
                    onChange={(e) => setThresholds({ ...thresholds, maxCashDrawerFloat: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Auto Shift Close Timeout (Hours)</label>
                  <input
                    type="number"
                    value={thresholds.autoCloseShiftHours}
                    onChange={(e) => setThresholds({ ...thresholds, autoCloseShiftHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RECEIPT' && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Receipt Header Tagline</label>
                <input
                  type="text"
                  value={receipt.headerTagline}
                  onChange={(e) => setReceipt({ ...receipt, headerTagline: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Receipt Footer Message</label>
                <input
                  type="text"
                  value={receipt.footerMessage}
                  onChange={(e) => setReceipt({ ...receipt, footerMessage: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {activeTab === 'ATG' && (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">ATG Console IP Gateway</label>
                  <input
                    type="text"
                    value={atg.gatewayIp}
                    onChange={(e) => setAtg({ ...atg, gatewayIp: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Port</label>
                  <input
                    type="text"
                    value={atg.port}
                    onChange={(e) => setAtg({ ...atg, port: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ATG Telemetry Daemon Online • 4 Tanks Polling Every 30s</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live 80mm Receipt Simulator & ATG Console Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Printer className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Live 80mm Forecourt Receipt Preview</h2>
              </div>
              <span className="text-[11px] font-mono text-gray-400">EPSON ESC/POS</span>
            </div>

            {/* Thermal Slip Container */}
            <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-gray-300 font-mono text-xs text-gray-800 space-y-2 max-w-sm mx-auto">
              <div className="text-center border-b border-dashed border-gray-300 pb-3">
                <span className="font-black text-sm block">{company.name.toUpperCase()}</span>
                <span className="text-[10px] text-gray-500 block">{company.address}</span>
                <span className="text-[10px] text-gray-500 block">{receipt.headerTagline}</span>
              </div>

              <div className="pt-2 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>SAMPLE TX:</span>
                  <span className="font-bold">REC-991250</span>
                </div>
                <div className="flex justify-between">
                  <span>DISPENSER:</span>
                  <span>Pump 01 (Nozzle 1-A)</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-gray-300 py-2.5 my-2 text-[11px] space-y-1">
                <div className="flex justify-between font-bold">
                  <span>PETROL (PMS 95)</span>
                  <span>$50.00</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[10px]">
                  <span>23.26 L @ $2.15/L</span>
                  <span>TAX INCLUDED</span>
                </div>
              </div>

              <div className="pt-3 text-center border-t border-dashed border-gray-300 text-[10px] text-gray-400">
                <p>{receipt.footerMessage}</p>
                <p>FUELPRO TELEMETRY 2026</p>
              </div>
            </div>
          </div>

          {/* Sub Summary Footer */}
          <div className="bg-slate-50/60 border-t border-slate-100 px-6 py-3 text-xs text-gray-500 font-medium flex items-center gap-2 mt-4 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Settings synced across all forecourt point of sale terminals</span>
          </div>
        </div>
      </div>
    </div>
  );
}
