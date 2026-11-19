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
  Mail,
  Phone,
  MapPin,
  Truck,
  DollarSign,
  FileText,
  ShieldCheck,
  CreditCard,
  Fuel,
  Sparkles,
} from 'lucide-react';

export default function NewSupplierPage() {
  const router = useRouter();

  // Vendor Identity
  const [vendorCode, setVendorCode] = useState('SUP-HASS');
  const [vendorName, setVendorName] = useState('Hass Petroleum Global Distribution');
  const [businessTaxId, setBusinessTaxId] = useState('TAX-DIST-992014');
  const [depotTerminal, setDepotTerminal] = useState('Port Logistics Terminal, Berth 4');
  const [city, setCity] = useState('Mogadishu Port Corridor');

  // Contact Persons
  const [contactPerson, setContactPerson] = useState('Jean-Luc Dupont (Sales Director)');
  const [email, setEmail] = useState('dispatch@hasspetroleum.so');
  const [phone, setPhone] = useState('+252 61 800-1200');
  const [hazmatDesk, setHazmatDesk] = useState('+252 61 800-9999');

  // Products and Terms
  const [suppliesPMS, setSuppliesPMS] = useState(true);
  const [suppliesAGO, setSuppliesAGO] = useState(true);
  const [suppliesKER, setSuppliesKER] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState('NET_30');
  const [creditLimit, setCreditLimit] = useState('150000');
  const [tankerFleetPartner, setTankerFleetPartner] = useState('Trans-East Petroleum Logistics Ltd');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/suppliers');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/suppliers" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Suppliers & Fuel Procurement
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Register Wholesale Supplier Contract</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            Wholesale Fuel Supplier & Refinery Contract Enrollment
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Enroll petroleum terminal distributors, establish wholesale credit agreements, and configure bulk road tanker offload terms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/suppliers"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enroll Supplier Contract</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Corporate Identity & Terminal Depot */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Refinery Corporate Identity & Terminal Depot</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Official distributor registration, commercial tax identifiers, and physical loading gantry terminal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Vendor Entity Code</label>
                <input
                  type="text"
                  required
                  value={vendorCode}
                  onChange={(e) => setVendorCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Commercial Corporate Entity Name</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Commercial VAT / Tax ID</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={businessTaxId}
                    onChange={(e) => setBusinessTaxId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Loading Gantry Depot / Berth Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={depotTerminal}
                    onChange={(e) => setDepotTerminal(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Commercial Credit & Products Supplied */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Commercial Credit Facility & Fuel Product Lines</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Wholesale payment settlement terms, revolving credit line limit, and fuel grade contracts.
                </p>
              </div>
            </div>

            {/* Supplied Fuel Grade Checkboxes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 block">Authorized Fuel Grade Wholesale Offtakes:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suppliesPMS}
                    onChange={(e) => setSuppliesPMS(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Petrol Unleaded 95</div>
                    <div className="text-[10px] text-gray-500">Euro IV refinery specification</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suppliesAGO}
                    onChange={(e) => setSuppliesAGO(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Diesel (AGO 50ppm)</div>
                    <div className="text-[10px] text-gray-500">Ultra low sulfur automotive</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suppliesKER}
                    onChange={(e) => setSuppliesKER(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Illuminating Kerosene</div>
                    <div className="text-[10px] text-gray-500">Domestic & industrial grade</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Contract Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="NET_15">Net 15 Days from BOL Offload</option>
                  <option value="NET_30">Net 30 Days from BOL Offload</option>
                  <option value="PREPAYMENT">Prepayment / Cash Against Documents</option>
                  <option value="LETTER_OF_CREDIT">Irrevocable Commercial LC</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Revolving Trade Credit Limit ($ USD)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    required
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Approved Tanker Fleet Hauler</label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={tankerFleetPartner}
                    onChange={(e) => setTankerFleetPartner(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Key Personnel & 24/7 Logistics Desk */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Key Personnel & 24/7 Terminal Logistics Desk</h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Direct contacts for urgent road tanker dispatches and hazardous materials response.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Key Account Director</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Central Dispatch Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Gantry Dispatch Telephone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">24/7 Hazmat Safety Response Hotline</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-red-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={hazmatDesk}
                    onChange={(e) => setHazmatDesk(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-red-200 bg-red-50/30 rounded-xl font-mono text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Right 4 Cols: Sticky Live Vendor Profile Card & Compliance Checklist */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Vendor Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Wholesale Supplier Profile
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ACTIVE VENDOR
              </span>
            </div>

            {/* Vendor Simulated Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-blue-300 px-2 py-0.5 rounded bg-white/10">
                  {vendorCode || 'SUP-XXX'}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {paymentTerms.replace('_', ' ')}
                </span>
              </div>

              <div>
                <div className="font-black text-sm text-white">{vendorName || 'Unnamed Supplier'}</div>
                <div className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{depotTerminal}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between text-xs">
                <div>
                  <div className="text-[10px] text-gray-400">Credit Limit</div>
                  <div className="text-emerald-400 font-mono font-black text-sm">
                    ${parseFloat(creditLimit || '0').toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400">Hauler Partner</div>
                  <div className="text-white text-xs font-semibold truncate max-w-[120px]">
                    {tankerFleetPartner}
                  </div>
                </div>
              </div>
            </div>

            {/* Contracted fuel grades pill list */}
            <div className="space-y-1.5 text-xs">
              <span className="text-gray-500 font-semibold text-[11px]">Approved Offtake Grades:</span>
              <div className="flex flex-wrap gap-1.5">
                {suppliesPMS && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                    PMS Unleaded 95
                  </span>
                )}
                {suppliesAGO && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                    AGO Diesel 50ppm
                  </span>
                )}
                {suppliesKER && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold">
                    Kerosene
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Supplier Readiness Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Supplier Contract Vetting Checklist
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Entity code & tax identification valid', valid: vendorCode.length >= 3 && businessTaxId.length >= 4 },
                { label: 'Refinery depot gantry location entered', valid: depotTerminal.length > 5 },
                { label: 'At least one fuel grade selected', valid: suppliesPMS || suppliesAGO || suppliesKER },
                { label: 'Revolving credit limit authorized', valid: parseFloat(creditLimit) > 0 },
                { label: '24/7 Gantry dispatch contact registered', valid: phone.length > 5 },
                { label: 'Dedicated emergency hazmat desk verified', valid: hazmatDesk.length > 5 },
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
