'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Save,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Phone,
  Gauge,
  Cylinder,
  ShieldCheck,
  Fuel,
  Users,
  Compass,
  FileBadge,
  Sparkles,
  ShoppingBag,
  Zap,
} from 'lucide-react';

export default function NewBranchPage() {
  const router = useRouter();

  // Identity state
  const [branchCode, setBranchCode] = useState('BR-WEST');
  const [branchName, setBranchName] = useState('West Highway Travel Plaza');
  const [stationType, setStationType] = useState<'FLAGSHIP' | 'URBAN' | 'HIGHWAY' | 'TERMINAL'>('HIGHWAY');
  const [operatingHours, setOperatingHours] = useState('24_7');
  
  // Location & Geofence
  const [address, setAddress] = useState('Km 18 Afgooye Corridor, West Highway');
  const [city, setCity] = useState('Mogadishu');
  const [latitude, setLatitude] = useState('2.046934');
  const [longitude, setLongitude] = useState('45.318161');

  // Forecourt Infrastructure Assets
  const [islandsCount, setIslandsCount] = useState('4');
  const [pumpsCount, setPumpsCount] = useState('8');
  const [tanksCount, setTanksCount] = useState('4');
  const [hasHGVLane, setHasHGVLane] = useState(true);
  const [hasCarWash, setHasCarWash] = useState(true);
  const [hasConvenienceStore, setHasConvenienceStore] = useState(true);
  const [cStoreSqFt, setCStoreSqFt] = useState('1800');

  // Leadership & Compliance
  const [managerName, setManagerName] = useState('Farhan Nur Farah');
  const [managerPhone, setManagerPhone] = useState('+252 61 777-8899');
  const [hazmatPhone, setHazmatPhone] = useState('+252 61 999-0000');
  const [licenseNumber, setLicenseNumber] = useState('PETRO-LIC-2026-9941');
  const [insurancePolicy, setInsurancePolicy] = useState('AIG-HAZMAT-POL-4412');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/branches');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/branches" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Branches & Multi-Site Forecourts
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Commission New Station Branch</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            Station Branch Commissioning & Forecourt Asset Enrollment
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Register a new multi-island fuel station facility, assign hardware assets, set GPS geofencing, and configure local management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/branches"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Commission Station Branch</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Station Identity & Classification */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Station Identification & Physical Geography</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Site naming, regulatory designation, and GPS geofence boundary coordinates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Station Branch Code</label>
                <input
                  type="text"
                  required
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Station Commercial Facility Name</label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Street Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">GPS Latitude (N)</label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">GPS Longitude (E)</label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Facility Classification</label>
                <select
                  value={stationType}
                  onChange={(e) => setStationType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="FLAGSHIP">Flagship Central Forecourt</option>
                  <option value="HIGHWAY">Highway Travel Plaza (Heavy Truck)</option>
                  <option value="URBAN">Urban Express Forecourt</option>
                  <option value="TERMINAL">Bulk Distribution Terminal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Forecourt Infrastructure & Hardware Assets */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Forecourt Physical Infrastructure & Hardware</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Canopy lanes, dispenser pumps, underground storage tanks, and non-fuel amenities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                <label className="block text-gray-700 font-bold">Forecourt Fuel Islands</label>
                <div className="relative">
                  <Fuel className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={islandsCount}
                    onChange={(e) => setIslandsCount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 bg-white rounded-xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <span className="text-[10px] text-gray-400">Canopy concrete pump pads</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                <label className="block text-gray-700 font-bold">Electronic Dispensers (Pumps)</label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-purple-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={pumpsCount}
                    onChange={(e) => setPumpsCount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 bg-white rounded-xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <span className="text-[10px] text-gray-400">Total forecourt multi-nozzle units</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                <label className="block text-gray-700 font-bold">Underground Storage Tanks (UST)</label>
                <div className="relative">
                  <Cylinder className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={tanksCount}
                    onChange={(e) => setTanksCount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 bg-white rounded-xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <span className="text-[10px] text-gray-400">Double-wall fiberglass wet tanks</span>
              </div>
            </div>

            {/* Forecourt Amenities & Fast Services */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <span className="text-xs font-bold text-gray-700 block">Forecourt Amenities & Commercial Facilities</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHGVLane}
                    onChange={(e) => setHasHGVLane(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">High-Flow HGV Lane</div>
                    <div className="text-[10px] text-gray-500">120 L/min satellite diesel mast</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCarWash}
                    onChange={(e) => setHasCarWash(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Automated Car Wash</div>
                    <div className="text-[10px] text-gray-500">Hydro-spray soft-touch tunnel</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasConvenienceStore}
                    onChange={(e) => setHasConvenienceStore(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Oasis Mart Retail</div>
                    <div className="text-[10px] text-gray-500">24/7 convenience shop</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 3: Leadership & Regulatory Operating License */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Station Leadership & Compliance Certification</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Site general manager, emergency contact, and environmental hazmat licensing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Station General Manager</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Manager Direct Hotline</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={managerPhone}
                    onChange={(e) => setManagerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">National Petroleum Operating License #</label>
                <div className="relative">
                  <FileBadge className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Environmental Hazmat Insurance Policy</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={insurancePolicy}
                    onChange={(e) => setInsurancePolicy(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Station Network Profile & Audit Checklist */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Station Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Station Network Profile
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ACTIVE 24/7
              </span>
            </div>

            {/* Station Mini Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-[11px] font-mono font-bold text-blue-200">
                  {branchCode || 'BR-XXX'}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  {stationType}
                </span>
              </div>

              <div>
                <div className="text-base font-black leading-snug">{branchName || 'Unnamed Station'}</div>
                <div className="text-xs text-blue-200 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{address || 'No address specified'}, {city}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-blue-300">Pumps</div>
                  <div className="text-sm font-black">{pumpsCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-blue-300">Tanks</div>
                  <div className="text-sm font-black">{tanksCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-blue-300">Islands</div>
                  <div className="text-sm font-black">{islandsCount}</div>
                </div>
              </div>
            </div>

            {/* Amenities summary tags */}
            <div className="space-y-2 text-xs">
              <div className="text-gray-500 font-semibold text-[11px]">Facility Configuration:</div>
              <div className="flex flex-wrap gap-1.5">
                {hasHGVLane && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                    HGV High-Flow Bay
                  </span>
                )}
                {hasCarWash && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                    Car Wash Tunnel
                  </span>
                )}
                {hasConvenienceStore && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    Oasis C-Store
                  </span>
                )}
              </div>
            </div>

            {/* GPS Geofence details */}
            <div className="p-3 bg-gray-50 rounded-2xl text-[11px] font-mono text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Lat: {latitude}</span>
                <span>Lng: {longitude}</span>
              </div>
              <div className="text-[10px] text-gray-400">Geofence Fleet Trigger: 150m radius</div>
            </div>
          </div>

          {/* Readiness Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Forecourt Commissioning Readiness
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Unique branch code assigned', valid: branchCode.length >= 4 },
                { label: 'Facility physical address & city', valid: address.length > 5 },
                { label: 'GPS Geofence coordinates entered', valid: latitude.length > 3 && longitude.length > 3 },
                { label: 'Pumps & UST tanks registered', valid: parseInt(pumpsCount) > 0 && parseInt(tanksCount) > 0 },
                { label: 'Designated station manager assigned', valid: managerName.length > 3 },
                { label: 'National regulatory petroleum license valid', valid: licenseNumber.length > 6 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  {item.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className={item.valid ? 'font-medium' : 'text-gray-400 font-normal'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
