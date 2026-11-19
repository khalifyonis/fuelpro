import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BranchesModule } from './branches/branches.module';
import { ProductsModule } from './products/products.module';
import { PricingModule } from './pricing/pricing.module';
import { PumpsModule } from './pumps/pumps.module';
import { NozzlesModule } from './nozzles/nozzles.module';
import { TanksModule } from './tanks/tanks.module';
import { InventoryModule } from './inventory/inventory.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { SalesModule } from './sales/sales.module';
import { ShiftsModule } from './shifts/shifts.module';
import { CustomersModule } from './customers/customers.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AccountingModule } from './accounting/accounting.module';
import { ReportsModule } from './reports/reports.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 200,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    BranchesModule,
    ProductsModule,
    PricingModule,
    PumpsModule,
    NozzlesModule,
    TanksModule,
    InventoryModule,
    DeliveriesModule,
    SuppliersModule,
    PurchaseOrdersModule,
    SalesModule,
    ShiftsModule,
    CustomersModule,
    ExpensesModule,
    AccountingModule,
    ReportsModule,
    MaintenanceModule,
    AuditModule,
    NotificationsModule,
    ApprovalsModule,
    SettingsModule,
  ],
})
export class AppModule {}
