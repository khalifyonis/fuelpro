'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Droplet,
  Thermometer,
  Gauge,
  ShieldCheck,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Radio,
  FileSpreadsheet,
  Download,
  Activity,
  Layers,
  Wrench,
  Sparkles,
  Info,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

// ============================================================================
// ENTERPRISE TANK DATA CONTRACTS
// ============================================================================

export interface EnterpriseTank {
  id: string;
  name: string;
  code: string;
  product: 'Petrol' | 'Diesel' | 'Kerosene';
  productGradeName: string;
  tankType: 'UST_DOUBLE_WALL' | 'UST_COMPOSITE' | 'AST_BUNDED';
  diameterMm: number;
  lengthMm: number;
  capacityLitres: number;
  currentLitres: number;
  safeWorkingCapacityLitres: number; // 95% Ullage
  deadstockFloorLitres: number; // Unpumpable
  ullageAvailableLitres: number;
  percentage: number;
  status: 'Healthy' | 'Low Stock' | 'Critical Low';
  safetyFloorDisplay: string;
  waterBottomMm: number;
  waterBottomDisplay: string;
  temperatureCelsius: number;
  temperatureDisplay: string;
  atgProbeSerial: string;
  atgStatus: 'Online' | 'Calibrating' | 'Diagnostic';
  highLevelAlarmLiters: number;
  reorderThresholdLiters: number;
  themeColor: 'blue' | 'green' | 'amber';
  lastDipTime: string;
  lastCalibratedDate: string;
}

export interface EnterpriseDipLog {
  id: string;
  timestamp: string;
  tankUnit: string;
  tankName: string;
  grade: 'Petrol' | 'Diesel' | 'Kerosene';
  dipHeightMm: number;
  dipHeightDisplay: string;
  waterBottomMm: number;
  waterBottomDisplay: string;
  physicalVolumeLitres: number;
  physicalVolumeDisplay: string;
  atgVolumeLitres: number;
  bookVarianceLitres: number;
  bookVarianceDisplay: string;
  temperatureCelsius: number;
  inspector: string;
  pasteUsed: 'Kolor Kut Gas' | 'Kolor Kut Water' | 'Digital Laser Dip';
  compliance: 'Passed' | 'Flagged';
  remarks: string;
}

// ============================================================================
// SEED DATA (Exact Match to Mockup Image 1)
// ============================================================================

const INITIAL_TANKS: EnterpriseTank[] = [
  {
    id: 't1',
    name: 'Main Forecourt Petrol Tank 1',
    code: 'UST-01',
    product: 'Petrol',
    productGradeName: 'Super Unleaded Petrol 95 RON',
    tankType: 'UST_DOUBLE_WALL',
    diameterMm: 2500,
    lengthMm: 7200,
    capacityLitres: 35000,
    currentLitres: 29750,
    safeWorkingCapacityLitres: 33250,
    deadstockFloorLitres: 2100,
    ullageAvailableLitres: 3500,
    percentage: 85,
    status: 'Healthy',
    safetyFloorDisplay: '5,250 L',
    waterBottomMm: 0,
    waterBottomDisplay: '0 mm',
    temperatureCelsius: 24.5,
    temperatureDisplay: '24.5°C',
    atgProbeSerial: 'VR-MAG-88219-01',
    atgStatus: 'Online',
    highLevelAlarmLiters: 31500,
    reorderThresholdLiters: 8000,
    themeColor: 'blue',
    lastDipTime: 'Today, 06:30 AM',
    lastCalibratedDate: '2026-09-15',
  },
  {
    id: 't2',
    name: 'Heavy Transport Diesel Tank',
    code: 'UST-02',
    product: 'Diesel',
    productGradeName: 'Ultra-Low Sulfur Heavy Diesel (10 ppm)',
    tankType: 'UST_DOUBLE_WALL',
    diameterMm: 2750,
    lengthMm: 8000,
    capacityLitres: 40000,
    currentLitres: 28800,
    safeWorkingCapacityLitres: 38000,
    deadstockFloorLitres: 2400,
    ullageAvailableLitres: 9200,
    percentage: 72,
    status: 'Healthy',
    safetyFloorDisplay: '11,200 L',
    waterBottomMm: 3,
    waterBottomDisplay: '3 mm',
    temperatureCelsius: 25.1,
    temperatureDisplay: '25.1°C',
    atgProbeSerial: 'VR-MAG-88219-02',
    atgStatus: 'Online',
    highLevelAlarmLiters: 36000,
    reorderThresholdLiters: 10000,
    themeColor: 'green',
    lastDipTime: 'Today, 06:35 AM',
    lastCalibratedDate: '2026-09-15',
  },
  {
    id: 't3',
    name: 'Domestic Heating Kerosene Tank',
    code: 'UST-03',
    product: 'Kerosene',
    productGradeName: 'Aviation & Domestic Kerosene (Paraffin)',
    tankType: 'UST_COMPOSITE',
    diameterMm: 2000,
    lengthMm: 5000,
    capacityLitres: 15000,
    currentLitres: 3750,
    safeWorkingCapacityLitres: 14250,
    deadstockFloorLitres: 900,
    ullageAvailableLitres: 10500,
    percentage: 25,
    status: 'Low Stock',
    safetyFloorDisplay: '620 mm',
    waterBottomMm: 1,
    waterBottomDisplay: '1 mm',
    temperatureCelsius: 23.8,
    temperatureDisplay: '23.8°C',
    atgProbeSerial: 'VR-MAG-88219-03',
    atgStatus: 'Online',
    highLevelAlarmLiters: 13500,
    reorderThresholdLiters: 4500,
    themeColor: 'amber',
    lastDipTime: 'Today, 06:40 AM',
    lastCalibratedDate: '2026-08-10',
  },
];

const INITIAL_DIPS: EnterpriseDipLog[] = [
  {
    id: 'd1',
    timestamp: 'Today, 06:30 AM',
    tankUnit: 'UST-01',
    tankName: 'Main Forecourt Petrol Tank 1',
    grade: 'Petrol',
    dipHeightMm: 2420,
    dipHeightDisplay: '2,420 mm',
    waterBottomMm: 0,
    waterBottomDisplay: '0 mm (Nil)',
    physicalVolumeLitres: 29750,
    physicalVolumeDisplay: '29,750 L',
    atgVolumeLitres: 29780,
    bookVarianceLitres: -30,
    bookVarianceDisplay: '-30 L',
    temperatureCelsius: 24.5,
    inspector: 'Farhan Ali',
    pasteUsed: 'Kolor Kut Gas',
    compliance: 'Passed',
    remarks: 'Clear & bright. Zero water cut on paste.',
  },
  {
    id: 'd2',
    timestamp: 'Today, 06:35 AM',
    tankUnit: 'UST-02',
    tankName: 'Heavy Transport Diesel Tank',
    grade: 'Diesel',
    dipHeightMm: 1980,
    dipHeightDisplay: '1,980 mm',
    waterBottomMm: 3,
    waterBottomDisplay: '3 mm',
    physicalVolumeLitres: 28800,
    physicalVolumeDisplay: '28,800 L',
    atgVolumeLitres: 28815,
    bookVarianceLitres: -15,
    bookVarianceDisplay: '-15 L',
    temperatureCelsius: 25.1,
    inspector: 'Farhan Ali',
    pasteUsed: 'Kolor Kut Water',
    compliance: 'Passed',
    remarks: 'Water bottom within 5mm tolerance limit.',
  },
  {
    id: 'd3',
    timestamp: 'Today, 06:40 AM',
    tankUnit: 'UST-03',
    tankName: 'Domestic Heating Kerosene Tank',
    grade: 'Kerosene',
    dipHeightMm: 1200,
    dipHeightDisplay: '1,200 mm',
    waterBottomMm: 1,
    waterBottomDisplay: '1 mm',
    physicalVolumeLitres: 3750,
    physicalVolumeDisplay: '3,750 L',
    atgVolumeLitres: 3755,
    bookVarianceLitres: -5,
    bookVarianceDisplay: '-5 L',
    temperatureCelsius: 23.8,
    inspector: 'Ahmed Hassan',
    pasteUsed: 'Kolor Kut Gas',
    compliance: 'Passed',
    remarks: 'Reorder triggered. Recommended offload 10,000 L.',
  },
];

export default function TanksPage() {
  const { toast } = useToast();

  const [tanks, setTanks] = useState<EnterpriseTank[]>(INITIAL_TANKS);
  const [dips, setDips] = useState<EnterpriseDipLog[]>(INITIAL_DIPS);
  const [filterPeriod, setFilterPeriod] = useState<'All' | 'Today' | 'This Week' | 'This Month'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddTankOpen, setIsAddTankOpen] = useState(false);
  const [isNewDipOpen, setIsNewDipOpen] = useState(false);
  const [selectedTank, setSelectedTank] = useState<EnterpriseTank | null>(null);

  // Tank Form Tabs
  const [activeTankTab, setActiveTankTab] = useState<'SPEC' | 'ATG' | 'SAFETY'>('SPEC');

  // Enterprise New Tank Form State
  const [tankForm, setTankForm] = useState({
    name: '',
    code: 'UST-04',
    product: 'Petrol' as 'Petrol' | 'Diesel' | 'Kerosene',
    productGradeName: 'Super Unleaded Petrol 95 RON',
    tankType: 'UST_DOUBLE_WALL' as EnterpriseTank['tankType'],
    diameterMm: 2500,
    lengthMm: 7500,
    capacityLitres: 35000,
    currentLitres: 18000,
    deadstockFloorLitres: 2000,
    atgProbeSerial: 'VR-MAG-88219-04',
    highLevelAlarmLiters: 32000,
    reorderThresholdLiters: 8500,
    initialWaterMm: 0,
    initialTemp: 24.2,
  });

  // Enterprise Dip Stick Log Form State
  const [dipForm, setDipForm] = useState({
    tankId: 't1',
    dipHeightMm: 2430,
    waterBottomMm: 0,
    measuredTemp: 24.5,
    inspectorName: 'Farhan Ali',
    pasteUsed: 'Kolor Kut Gas' as EnterpriseDipLog['pasteUsed'],
    remarks: 'Routine pre-shift wet stock physical dip stick verification',
  });

  // Calculated KPI metrics (Exact match to Mockup Image 1)
  const totalTanksCount = tanks.length;
  const totalFuelVolume = useMemo(() => tanks.reduce((s, t) => s + t.currentLitres, 0), [tanks]);
  const totalCapacity = useMemo(() => tanks.reduce((s, t) => s + t.capacityLitres, 0), [tanks]);
  const avgLevelPct = totalCapacity > 0 ? Math.round((totalFuelVolume / totalCapacity) * 100) : 0;
  const systemHealth = '99.8%';

  // Filtered dip logs
  const filteredDips = useMemo(() => {
    return dips.filter((d) => {
      const q = searchQuery.toLowerCase();
      return (
        d.tankUnit.toLowerCase().includes(q) ||
        d.tankName.toLowerCase().includes(q) ||
        d.grade.toLowerCase().includes(q) ||
        d.inspector.toLowerCase().includes(q) ||
        d.remarks.toLowerCase().includes(q)
      );
    });
  }, [dips, searchQuery]);

  // Handlers
  const handleAddTank = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = Number(tankForm.capacityLitres) || 30000;
    const cur = Number(tankForm.currentLitres) || 15000;
    const pct = Math.round((cur / cap) * 100);

    const newTank: EnterpriseTank = {
      id: `t-${Date.now()}`,
      name: tankForm.name || `${tankForm.product} Forecourt Storage Tank`,
      code: tankForm.code || `UST-0${tanks.length + 1}`,
      product: tankForm.product,
      productGradeName: tankForm.productGradeName,
      tankType: tankForm.tankType,
      diameterMm: Number(tankForm.diameterMm) || 2500,
      lengthMm: Number(tankForm.lengthMm) || 7000,
      capacityLitres: cap,
      currentLitres: cur,
      safeWorkingCapacityLitres: Math.round(cap * 0.95),
      deadstockFloorLitres: Number(tankForm.deadstockFloorLitres) || 2000,
      ullageAvailableLitres: Math.max(0, cap - cur),
      percentage: pct,
      status: pct < 30 ? 'Low Stock' : 'Healthy',
      safetyFloorDisplay: `${Math.round(cap * 0.15).toLocaleString()} L`,
      waterBottomMm: Number(tankForm.initialWaterMm) || 0,
      waterBottomDisplay: `${tankForm.initialWaterMm || 0} mm`,
      temperatureCelsius: Number(tankForm.initialTemp) || 24.0,
      temperatureDisplay: `${tankForm.initialTemp || 24.0}°C`,
      atgProbeSerial: tankForm.atgProbeSerial || `VR-MAG-${Math.floor(10000 + Math.random() * 90000)}`,
      atgStatus: 'Online',
      highLevelAlarmLiters: Number(tankForm.highLevelAlarmLiters) || Math.round(cap * 0.9),
      reorderThresholdLiters: Number(tankForm.reorderThresholdLiters) || Math.round(cap * 0.25),
      themeColor:
        tankForm.product === 'Petrol' ? 'blue' : tankForm.product === 'Diesel' ? 'green' : 'amber',
      lastDipTime: 'Just now',
      lastCalibratedDate: new Date().toISOString().split('T')[0],
    };

    setTanks([...tanks, newTank]);
    setIsAddTankOpen(false);
    toast({
      title: 'Underground Tank Commissioned',
      description: `Tank ${newTank.code} (${newTank.name}) registered with ATG probe ${newTank.atgProbeSerial}.`,
      type: 'success',
    });
  };

  const handleRecordPhysicalDip = (e: React.FormEvent) => {
    e.preventDefault();
    const tank = tanks.find((t) => t.id === dipForm.tankId) || tanks[0];
    const dipMm = Number(dipForm.dipHeightMm) || 2000;
    const waterMm = Number(dipForm.waterBottomMm) || 0;

    // Approximate volumetric calculation based on cylindrical geometry
    const calculatedLitres = Math.round((dipMm / tank.diameterMm) * tank.capacityLitres);
    const variance = calculatedLitres - tank.currentLitres;

    const newDip: EnterpriseDipLog = {
      id: `dip-${Date.now()}`,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tankUnit: tank.code,
      tankName: tank.name,
      grade: tank.product,
      dipHeightMm: dipMm,
      dipHeightDisplay: `${dipMm.toLocaleString()} mm`,
      waterBottomMm: waterMm,
      waterBottomDisplay: waterMm === 0 ? '0 mm (Nil)' : `${waterMm} mm`,
      physicalVolumeLitres: calculatedLitres,
      physicalVolumeDisplay: `${calculatedLitres.toLocaleString()} L`,
      atgVolumeLitres: tank.currentLitres,
      bookVarianceLitres: variance,
      bookVarianceDisplay: `${variance > 0 ? '+' : ''}${variance} L`,
      temperatureCelsius: Number(dipForm.measuredTemp) || 24.5,
      inspector: dipForm.inspectorName || 'Forecourt Inspector',
      pasteUsed: dipForm.pasteUsed,
      compliance: waterMm > 5 || Math.abs(variance) > 100 ? 'Flagged' : 'Passed',
      remarks: dipForm.remarks,
    };

    setDips([newDip, ...dips]);
    setIsNewDipOpen(false);
    toast({
      title: 'Physical Dip Recorded',
      description: `Dip height ${newDip.dipHeightDisplay} recorded for ${tank.code}. Variance: ${newDip.bookVarianceDisplay}.`,
      type: newDip.compliance === 'Passed' ? 'success' : 'warning',
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Timestamp,Tank Unit,Tank Name,Grade,Dip Height (mm),Water Bottom (mm),Physical Volume (L),ATG Volume (L),Book Variance (L),Temp (°C),Inspector,Compliance,Remarks',
    ];
    const rows = dips.map(
      (d) =>
        `"${d.timestamp}","${d.tankUnit}","${d.tankName}","${d.grade}",${d.dipHeightMm},${d.waterBottomMm},${d.physicalVolumeLitres},${d.atgVolumeLitres},${d.bookVarianceLitres},${d.temperatureCelsius},"${d.inspector}","${d.compliance}","${d.remarks}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FuelPro_Physical_Dip_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({
      title: 'Audit Logs Exported',
      description: 'Physical dip records downloaded in CSV format.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. HEADER BANNER (Matching Mockup Image 1)                            */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="6" width="18" height="12" rx="6" />
              <line x1="8" y1="6" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="18" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                Tanks
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                ATG Telemetry Active
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Monitor fuel levels, tank status and ensure smooth operations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export Dips CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewDipOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Log Physical Dip</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTankTab('SPEC');
              setIsAddTankOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Tank</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. TOP 4 KPI METRIC CARDS (Exact Match to Mockup Image 1)              */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tanks */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="6" width="16" height="12" rx="4" />
                <line x1="9" y1="6" x2="9" y2="18" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Tanks
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-gray-900">{totalTanksCount}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 0% vs last month
              </span>
            </div>
          </div>
          {/* Subtle Ambient Curve Wave */}
          <div className="hidden sm:block shrink-0 pr-1 opacity-20">
            <svg className="w-12 h-8 text-blue-600" viewBox="0 0 50 30" fill="currentColor">
              <path d="M0 20 Q 25 5, 50 20 L 50 30 L 0 30 Z" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Fuel */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 fill-emerald-600 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Total Fuel
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">
                  {totalFuelVolume.toLocaleString()} L
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 15% vs last month
              </span>
            </div>
          </div>
          {/* Subtle Ambient Curve Wave */}
          <div className="hidden sm:block shrink-0 pr-1 opacity-20">
            <svg className="w-12 h-8 text-emerald-600" viewBox="0 0 50 30" fill="currentColor">
              <path d="M0 20 Q 25 5, 50 20 L 50 30 L 0 30 Z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Avg. Level */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                Avg. Level
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">{avgLevelPct}%</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 2% vs last month
              </span>
            </div>
          </div>
          {/* Subtle Ambient Curve Wave */}
          <div className="hidden sm:block shrink-0 pr-1 opacity-20">
            <svg className="w-12 h-8 text-amber-600" viewBox="0 0 50 30" fill="currentColor">
              <path d="M0 20 Q 25 5, 50 20 L 50 30 L 0 30 Z" />
            </svg>
          </div>
        </div>

        {/* Card 4: System Health */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight">
                System Health
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-gray-900">{systemHealth}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↑</span> 0.1% vs last month
              </span>
            </div>
          </div>
          {/* Subtle Ambient Curve Wave */}
          <div className="hidden sm:block shrink-0 pr-1 opacity-20">
            <svg className="w-12 h-8 text-emerald-600" viewBox="0 0 50 30" fill="currentColor">
              <path d="M0 20 Q 25 5, 50 20 L 50 30 L 0 30 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. 3 HORIZONTAL 3D CYLINDRICAL TANK CARDS (Exact Match to Image 1)    */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tanks.map((tank) => (
          <div
            key={tank.id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
          >
            {/* Top row: Status Badge & 3-Dots */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  tank.status === 'Healthy'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    tank.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {tank.status}
              </span>

              <button
                type="button"
                onClick={() => {
                  setSelectedTank(tank);
                  toast({
                    title: `${tank.code} - ${tank.name}`,
                    description: `ATG Probe: ${tank.atgProbeSerial} | Ullage Available: ${tank.ullageAvailableLitres.toLocaleString()} L`,
                    type: 'info',
                  });
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Tank Title */}
            <h3 className="text-xs font-bold text-gray-900 tracking-tight mb-2">
              {tank.name}
            </h3>

            {/* Middle: Volume and Horizontal Cylindrical 3D Graphic */}
            <div className="flex items-center justify-between gap-3 my-1">
              {/* Volume stats */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-gray-900">
                    {tank.currentLitres.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    / {tank.capacityLitres.toLocaleString()} L
                  </span>
                </div>

                {/* Horizontal Progress Liquid Gauge */}
                <div className="w-36 bg-gray-100 h-2 rounded-full overflow-hidden mt-2 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tank.themeColor === 'blue'
                        ? 'bg-blue-600'
                        : tank.themeColor === 'green'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${tank.percentage}%` }}
                  />
                </div>
              </div>

              {/* 3D Cylindrical Tank Visualizer */}
              <div className="relative w-28 h-14 shrink-0 flex items-center justify-center">
                {/* 3D Horizontal Cylinder SVG */}
                <svg
                  className="w-full h-full drop-shadow-md"
                  viewBox="0 0 140 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id={`tankGrad-${tank.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="30%" stopColor="#f1f5f9" />
                      <stop offset="70%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                    <linearGradient id={`liquidGrad-${tank.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop
                        offset="0%"
                        stopColor={
                          tank.themeColor === 'blue'
                            ? '#3b82f6'
                            : tank.themeColor === 'green'
                            ? '#10b981'
                            : '#f59e0b'
                        }
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          tank.themeColor === 'blue'
                            ? '#1d4ed8'
                            : tank.themeColor === 'green'
                            ? '#047857'
                            : '#d97706'
                        }
                      />
                    </linearGradient>
                  </defs>

                  {/* Tank Support Saddles */}
                  <rect x="25" y="52" width="12" height="12" rx="2" fill="#64748b" />
                  <rect x="103" y="52" width="12" height="12" rx="2" fill="#64748b" />

                  {/* Main Horizontal Tank Barrel with Rounded Caps */}
                  <rect
                    x="15"
                    y="10"
                    width="110"
                    height="45"
                    rx="22.5"
                    fill={`url(#tankGrad-${tank.id})`}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />

                  {/* Manhole Access Dome & Flange */}
                  <rect x="62" y="5" width="16" height="6" rx="2" fill="#64748b" />

                  {/* Dynamic Internal Liquid Fill Level */}
                  <rect
                    x="20"
                    y={50 - (35 * tank.percentage) / 100}
                    width="100"
                    height={(35 * tank.percentage) / 100}
                    rx="10"
                    fill={`url(#liquidGrad-${tank.id})`}
                    opacity="0.85"
                  />
                </svg>

                {/* Percentage label in center */}
                <span className="absolute right-1 bottom-1 text-[11px] font-black text-gray-500">
                  {tank.percentage}%
                </span>
              </div>
            </div>

            {/* Bottom 3 Forecourt Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 mt-3">
              {/* Safety Floor */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block leading-none">Safety Floor</span>
                  <span className="text-[11px] font-bold text-gray-800 mt-0.5 block">
                    {tank.safetyFloorDisplay}
                  </span>
                </div>
              </div>

              {/* Water Bottom */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M2 12h20M2 16h20M2 8h20" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block leading-none">Water Bottom</span>
                  <span className="text-[11px] font-bold text-gray-800 mt-0.5 block">
                    {tank.waterBottomDisplay}
                  </span>
                </div>
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Thermometer className="w-3 h-3 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block leading-none">Temperature</span>
                  <span className="text-[11px] font-bold text-gray-800 mt-0.5 block">
                    {tank.temperatureDisplay}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* 4. PHYSICAL DIP LOG & CALIBRATION AUDITS TABLE (Exact Match Image 1)   */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Table Card Header with Title & Filter Pills */}
        <div className="p-4 px-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">
                Physical Dip Log & Calibration Audits
              </h2>
              <p className="text-[11px] text-gray-400">
                Track dip records and tank calibrations for compliance.
              </p>
            </div>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200/70">
            {(['All', 'Today', 'This Week', 'This Month'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  filterPeriod === period
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 font-medium'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar inside Table */}
        <div className="p-3 px-5 border-b border-gray-100 bg-gray-50/40">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tank, receipt type or inspector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200/80 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-gray-800"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-5">DIP TIMESTAMP</th>
                <th className="py-3 px-3">TANK UNIT</th>
                <th className="py-3 px-3">GRADE</th>
                <th className="py-3 px-3">DIP HEIGHT</th>
                <th className="py-3 px-3">WATER BOTTOM</th>
                <th className="py-3 px-3">PHYSICAL VOLUME</th>
                <th className="py-3 px-3">BOOK VARIANCE</th>
                <th className="py-3 px-3">INSPECTION</th>
                <th className="py-3 px-4 text-center">COMPLIANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDips.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3.5 px-5 font-semibold text-gray-800 text-xs">
                    {row.timestamp}
                  </td>

                  {/* Tank Unit */}
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-blue-600 hover:underline cursor-pointer">
                      {row.tankUnit}
                    </span>
                  </td>

                  {/* Grade Pill */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                        row.grade === 'Petrol'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : row.grade === 'Diesel'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.grade === 'Petrol'
                            ? 'bg-emerald-500'
                            : row.grade === 'Diesel'
                            ? 'bg-amber-500'
                            : 'bg-purple-500'
                        }`}
                      />
                      {row.grade}
                    </span>
                  </td>

                  {/* Dip Height */}
                  <td className="py-3.5 px-3 font-semibold text-gray-800">
                    {row.dipHeightDisplay}
                  </td>

                  {/* Water Bottom */}
                  <td className="py-3.5 px-3 font-semibold text-gray-500">
                    {row.waterBottomDisplay}
                  </td>

                  {/* Physical Volume */}
                  <td className="py-3.5 px-3 font-black text-gray-900">
                    {row.physicalVolumeDisplay}
                  </td>

                  {/* Book Variance */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${
                        row.bookVarianceLitres < 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}
                    >
                      {row.bookVarianceDisplay}
                    </span>
                  </td>

                  {/* Inspector */}
                  <td className="py-3.5 px-3 font-medium text-gray-700">
                    {row.inspector}
                  </td>

                  {/* Compliance Badge with Checkmark */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.compliance === 'Passed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {row.compliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. MULTI-TAB MODAL: NEW UNDERGROUND STORAGE TANK                       */}
      {/* ===================================================================== */}
      {isAddTankOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Commission Wet Stock Underground Tank</h3>
                <p className="text-xs text-blue-200">
                  Register UST asset, double-wall fiberglass spec, ATG Veeder-Root probe, and safety floors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTankOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-gray-200 bg-slate-50 px-6 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTankTab('SPEC')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTankTab === 'SPEC'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-gray-500'
                }`}
              >
                1. Tank Asset Spec
              </button>
              <button
                type="button"
                onClick={() => setActiveTankTab('ATG')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTankTab === 'ATG'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-gray-500'
                }`}
              >
                2. ATG Telemetry & Probe
              </button>
              <button
                type="button"
                onClick={() => setActiveTankTab('SAFETY')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTankTab === 'SAFETY'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-gray-500'
                }`}
              >
                3. Alarms & Safety Limits
              </button>
            </div>

            <form onSubmit={handleAddTank} className="p-6 space-y-4 flex-1 overflow-y-auto">
              {activeTankTab === 'SPEC' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Tank Code / Identifier *
                      </label>
                      <input
                        type="text"
                        required
                        value={tankForm.code}
                        onChange={(e) => setTankForm({ ...tankForm, code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Fuel Product *
                      </label>
                      <select
                        value={tankForm.product}
                        onChange={(e) =>
                          setTankForm({
                            ...tankForm,
                            product: e.target.value as 'Petrol' | 'Diesel' | 'Kerosene',
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                      >
                        <option value="Petrol">Petrol (Unleaded 95 RON)</option>
                        <option value="Diesel">Heavy Diesel (10 ppm)</option>
                        <option value="Kerosene">Kerosene (Domestic Paraffin)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Descriptive Asset Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Forecourt North Petrol Tank 2"
                      value={tankForm.name}
                      onChange={(e) => setTankForm({ ...tankForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Gross Capacity (L) *
                      </label>
                      <input
                        type="number"
                        required
                        value={tankForm.capacityLitres}
                        onChange={(e) =>
                          setTankForm({ ...tankForm, capacityLitres: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Diameter (mm)
                      </label>
                      <input
                        type="number"
                        value={tankForm.diameterMm}
                        onChange={(e) =>
                          setTankForm({ ...tankForm, diameterMm: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Length (mm)
                      </label>
                      <input
                        type="number"
                        value={tankForm.lengthMm}
                        onChange={(e) =>
                          setTankForm({ ...tankForm, lengthMm: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTankTab === 'ATG' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ATG Probe Serial (Veeder-Root Mag Plus / Dover TLS)
                    </label>
                    <input
                      type="text"
                      value={tankForm.atgProbeSerial}
                      onChange={(e) =>
                        setTankForm({ ...tankForm, atgProbeSerial: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-blue-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Current Initial Stock (L)
                      </label>
                      <input
                        type="number"
                        value={tankForm.currentLitres}
                        onChange={(e) =>
                          setTankForm({ ...tankForm, currentLitres: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Current Fuel Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={tankForm.initialTemp}
                        onChange={(e) =>
                          setTankForm({ ...tankForm, initialTemp: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTankTab === 'SAFETY' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        High-Level Overfill Warning (Liters)
                      </label>
                      <input
                        type="number"
                        value={tankForm.highLevelAlarmLiters}
                        onChange={(e) =>
                          setTankForm({
                            ...tankForm,
                            highLevelAlarmLiters: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-rose-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Low Stock Reorder Trigger (Liters)
                      </label>
                      <input
                        type="number"
                        value={tankForm.reorderThresholdLiters}
                        onChange={(e) =>
                          setTankForm({
                            ...tankForm,
                            reorderThresholdLiters: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-amber-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTankOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Commission Tank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. MODAL: LOG PHYSICAL DIPSTICK GAUGING                                */}
      {/* ===================================================================== */}
      {isNewDipOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Log Physical Dipstick Gauging</h3>
                <p className="text-xs text-emerald-200">
                  Manual wet stock audit verification & water paste inspection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDipOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPhysicalDip} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Target Wet Stock Tank *
                </label>
                <select
                  value={dipForm.tankId}
                  onChange={(e) => setDipForm({ ...dipForm, tankId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                >
                  {tanks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.name} ({t.product})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Dip Height (mm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={dipForm.dipHeightMm}
                    onChange={(e) =>
                      setDipForm({ ...dipForm, dipHeightMm: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-black text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Water Bottom Cut (mm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={dipForm.waterBottomMm}
                    onChange={(e) =>
                      setDipForm({ ...dipForm, waterBottomMm: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-cyan-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dipForm.measuredTemp}
                    onChange={(e) =>
                      setDipForm({ ...dipForm, measuredTemp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Inspector Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={dipForm.inspectorName}
                    onChange={(e) =>
                      setDipForm({ ...dipForm, inspectorName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Chemical Paste Used
                </label>
                <select
                  value={dipForm.pasteUsed}
                  onChange={(e) =>
                    setDipForm({
                      ...dipForm,
                      pasteUsed: e.target.value as EnterpriseDipLog['pasteUsed'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium bg-white"
                >
                  <option value="Kolor Kut Gas">Kolor Kut Gasoline Finding Paste</option>
                  <option value="Kolor Kut Water">Kolor Kut Water Finding Paste</option>
                  <option value="Digital Laser Dip">Digital Laser Dip Sensor Probe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Audit Notes</label>
                <input
                  type="text"
                  value={dipForm.remarks}
                  onChange={(e) => setDipForm({ ...dipForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewDipOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Commit Dip Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
