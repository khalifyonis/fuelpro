import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding FUELPRO Database ---');

  // 1. Company
  const company = await prisma.company.upsert({
    where: { id: 'c1' },
    update: {},
    create: {
      id: 'c1',
      name: 'FuelPro Energy Ltd',
      registrationNumber: 'FP-2026-98124',
      taxId: 'TAX-88776655',
      address: '100 Energy Boulevard, Suite 500',
      city: 'Metro City',
      country: 'United States',
      phone: '+1 (555) 019-2834',
      email: 'contact@fuelpro.com',
      currency: 'USD',
      timezone: 'UTC',
    },
  });

  // 2. Branches
  const centralBranch = await prisma.branch.upsert({
    where: { code: 'BR-CENTRAL' },
    update: {},
    create: {
      companyId: company.id,
      name: 'Central Station',
      code: 'BR-CENTRAL',
      address: '450 Downtown Avenue',
      city: 'Metro City',
      phone: '+1 (555) 019-1111',
      email: 'central@fuelpro.com',
      isActive: true,
    },
  });

  const northBranch = await prisma.branch.upsert({
    where: { code: 'BR-NORTH' },
    update: {},
    create: {
      companyId: company.id,
      name: 'North Station',
      code: 'BR-NORTH',
      address: '12 Expressway North',
      city: 'Metro City',
      phone: '+1 (555) 019-2222',
      email: 'north@fuelpro.com',
      isActive: true,
    },
  });

  const eastBranch = await prisma.branch.upsert({
    where: { code: 'BR-EAST' },
    update: {},
    create: {
      companyId: company.id,
      name: 'East Station',
      code: 'BR-EAST',
      address: '88 Eastern Ring Road',
      city: 'Metro City',
      phone: '+1 (555) 019-3333',
      email: 'east@fuelpro.com',
      isActive: true,
    },
  });

  const westBranch = await prisma.branch.upsert({
    where: { code: 'BR-WEST' },
    update: {},
    create: {
      companyId: company.id,
      name: 'West Station',
      code: 'BR-WEST',
      address: '210 Westside Boulevard',
      city: 'Metro City',
      phone: '+1 (555) 019-4444',
      email: 'west@fuelpro.com',
      isActive: true,
    },
  });

  // 3. Roles
  const roles = [
    { name: 'Super Admin', desc: 'Full company-wide administrative control' },
    { name: 'Station Manager', desc: 'Manage branch operations, staff, and inventory' },
    { name: 'Supervisor', desc: 'Shift leadership and approvals' },
    { name: 'Cashier', desc: 'POS operation and shift transactions' },
    { name: 'Pump Attendant', desc: 'Nozzle meter readings and fuel dispensing' },
    { name: 'Inventory Officer', desc: 'Tank levels, deliveries, and stock ledger' },
    { name: 'Accountant', desc: 'Financial summaries, expenses, and reconciliation' },
    { name: 'Auditor', desc: 'Read-only audit and compliance inspection' },
    { name: 'Maintenance Technician', desc: 'Equipment repair and safety checks' },
  ];

  const roleMap: Record<string, any> = {};
  for (const r of roles) {
    roleMap[r.name] = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name, description: r.desc, isSystem: true },
    });
  }

  // 4. Default Users
  const passwordHash = await bcrypt.hash('FuelPro@2026', 10);

  const usersData = [
    {
      email: 'admin@fuelpro.com',
      username: 'admin',
      firstName: 'Alex',
      lastName: 'Morgan',
      role: 'Super Admin',
    },
    {
      email: 'manager@fuelpro.com',
      username: 'manager',
      firstName: 'David',
      lastName: 'Miller',
      role: 'Station Manager',
    },
    {
      email: 'cashier@fuelpro.com',
      username: 'cashier',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      role: 'Cashier',
    },
    {
      email: 'attendant@fuelpro.com',
      username: 'attendant',
      firstName: 'Marcus',
      lastName: 'Vance',
      role: 'Pump Attendant',
    },
    {
      email: 'inventory@fuelpro.com',
      username: 'inventory',
      firstName: 'Elena',
      lastName: 'Rostova',
      role: 'Inventory Officer',
    },
    {
      email: 'accountant@fuelpro.com',
      username: 'accountant',
      firstName: 'Robert',
      lastName: 'Sterling',
      role: 'Accountant',
    },
  ];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        companyId: company.id,
        email: u.email,
        username: u.username,
        passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        status: 'ACTIVE',
      },
    });

    await prisma.userBranchRole.upsert({
      where: {
        userId_branchId_roleId: {
          userId: user.id,
          branchId: centralBranch.id,
          roleId: roleMap[u.role].id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        branchId: centralBranch.id,
        roleId: roleMap[u.role].id,
      },
    });
  }

  // 5. Fuel Products & Pricing
  const products = [
    { code: 'PETROL', name: 'Petrol', color: '#2563eb', price: 2.15, cost: 1.80 },
    { code: 'DIESEL', name: 'Diesel', color: '#10b981', price: 2.05, cost: 1.70 },
    { code: 'KEROSENE', name: 'Kerosene', color: '#f59e0b', price: 1.50, cost: 1.20 },
  ];

  const productMap: Record<string, any> = {};
  for (const p of products) {
    const prod = await prisma.fuelProduct.upsert({
      where: { code: p.code },
      update: {},
      create: {
        companyId: company.id,
        code: p.code,
        name: p.name,
        color: p.color,
        unit: 'litre',
      },
    });
    productMap[p.code] = prod;

    await prisma.fuelPrice.create({
      data: {
        productId: prod.id,
        branchId: centralBranch.id,
        costPrice: p.cost,
        sellingPrice: p.price,
        effectiveFrom: new Date('2026-01-01'),
        isApproved: true,
        createdBy: 'system',
      },
    });
  }

  // 6. Tanks
  const tanks = [
    { code: 'TK-01', name: 'Central Petrol Tank 1', productCode: 'PETROL', cap: 30000, cur: 25500, min: 5000 },
    { code: 'TK-02', name: 'Central Diesel Tank 1', productCode: 'DIESEL', cap: 25000, cur: 18000, min: 4000 },
    { code: 'TK-03', name: 'Central Kerosene Tank 1', productCode: 'KEROSENE', cap: 15000, cur: 9000, min: 2000 },
  ];

  const tankMap: Record<string, any> = {};
  for (const t of tanks) {
    tankMap[t.code] = await prisma.tank.upsert({
      where: { branchId_code: { branchId: centralBranch.id, code: t.code } },
      update: {},
      create: {
        branchId: centralBranch.id,
        productId: productMap[t.productCode].id,
        name: t.name,
        code: t.code,
        capacity: t.cap,
        currentStock: t.cur,
        minimumLevel: t.min,
        status: 'ACTIVE',
      },
    });
  }

  // 7. Pumps & Nozzles (8 pumps at Central Station: 6 active, 2 offline/maintenance)
  for (let i = 1; i <= 8; i++) {
    const isMaintenance = i === 7;
    const isOffline = i === 8;
    const status = isMaintenance ? 'MAINTENANCE' : isOffline ? 'OUT_OF_SERVICE' : 'ACTIVE';

    const pump = await prisma.pump.upsert({
      where: { branchId_code: { branchId: centralBranch.id, code: `P-${i}` } },
      update: {},
      create: {
        branchId: centralBranch.id,
        name: `Pump ${i}`,
        code: `P-${i}`,
        status,
        manufacturer: 'Wayne Fueling Systems',
        model: 'Ovation LX',
      },
    });

    // Create 2 nozzles per pump
    await prisma.nozzle.upsert({
      where: { id: `noz-${i}-1` },
      update: {},
      create: {
        id: `noz-${i}-1`,
        pumpId: pump.id,
        productId: productMap['PETROL'].id,
        label: `Nozzle ${i}-A (Petrol)`,
        currentMeterReading: 15420.5,
      },
    });

    await prisma.nozzle.upsert({
      where: { id: `noz-${i}-2` },
      update: {},
      create: {
        id: `noz-${i}-2`,
        pumpId: pump.id,
        productId: i % 2 === 0 ? productMap['DIESEL'].id : productMap['KEROSENE'].id,
        label: `Nozzle ${i}-B (${i % 2 === 0 ? 'Diesel' : 'Kerosene'})`,
        currentMeterReading: 8930.2,
      },
    });
  }

  // 8. Suppliers
  const suppliers = [
    { name: 'TotalEnergies Global', email: 'supply@totalenergies.com', phone: '+1 800 555 1200' },
    { name: 'Shell Commercial Distribution', email: 'orders@shell.com', phone: '+1 800 555 3400' },
    { name: 'Oryx Petroleum Supply Ltd', email: 'dispatch@oryx.com', phone: '+1 800 555 6700' },
  ];

  for (const s of suppliers) {
    await prisma.supplier.create({
      data: {
        companyId: company.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        address: 'Port Logistics Hub',
        balance: 15000,
      },
    });
  }

  // 9. Customers
  const customers = [
    { name: 'Metro Rapid Bus Fleet', type: 'COMPANY', creditLimit: 25000, currentBalance: 8400 },
    { name: 'Express Taxi Cooperative', type: 'COMPANY', creditLimit: 15000, currentBalance: 3200 },
    { name: 'John Doe Logistics', type: 'INDIVIDUAL', creditLimit: 5000, currentBalance: 950 },
  ];

  for (const c of customers) {
    await prisma.customer.create({
      data: {
        companyId: company.id,
        name: c.name,
        type: c.type as any,
        creditLimit: c.creditLimit,
        currentBalance: c.currentBalance,
        phone: '+1 (555) 777-8899',
        email: 'billing@fleet.com',
      },
    });
  }

  // 10. Expense Categories
  const categories = ['Utilities & Electricity', 'Equipment Maintenance', 'Petty Cash', 'Staff Wages & Allowances'];
  for (const cat of categories) {
    await prisma.expenseCategory.create({
      data: {
        companyId: company.id,
        name: cat,
      },
    });
  }

  console.log('--- Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
