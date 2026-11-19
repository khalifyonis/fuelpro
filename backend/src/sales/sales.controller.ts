import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(
    @Query('branchId') branchId?: string,
    @Query('cashierId') cashierId?: string,
    @Query('shiftId') shiftId?: string,
    @Query('date') date?: string,
    @Query('take') take = '50',
  ) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (cashierId) where.cashierId = cashierId;
    if (shiftId) where.shiftId = shiftId;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      where.saleDate = { gte: d, lt: nextDay };
    }

    return this.prisma.sale.findMany({
      where,
      include: {
        branch: true,
        cashier: { select: { firstName: true, lastName: true, username: true } },
        customer: true,
        items: { include: { product: true, pump: true, nozzle: true } },
        payments: true,
      },
      orderBy: { saleDate: 'desc' },
      take: Number(take),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        branch: true,
        cashier: { select: { firstName: true, lastName: true, username: true } },
        customer: true,
        items: { include: { product: true, pump: true, nozzle: true } },
        payments: true,
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager', 'Supervisor', 'Cashier')
  async createSale(@Body() body: any, @CurrentUser('id') userId: string) {
    const {
      branchId,
      shiftId,
      customerId,
      items,
      payments,
      discountAmount = 0,
      taxAmount = 0,
      idempotencyKey,
      notes,
    } = body;

    if (!items || items.length === 0) {
      throw new BadRequestException('Sale must contain at least one fuel item');
    }

    // Check idempotency if provided
    if (idempotencyKey) {
      const existing = await this.prisma.sale.findUnique({
        where: { idempotencyKey },
        include: { items: true, payments: true },
      });
      if (existing) return existing;
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, it: any) => sum + Number(it.quantity) * Number(it.unitPrice),
      0,
    );
    const totalAmount = subtotal - Number(discountAmount) + Number(taxAmount);

    const saleNumber = `REC-${Date.now().toString().slice(-8)}`;

    // Execute in Prisma transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Sale record
      const sale = await tx.sale.create({
        data: {
          branchId,
          shiftId,
          cashierId: userId,
          customerId,
          saleNumber,
          subtotal,
          discountAmount,
          taxAmount,
          totalAmount,
          notes,
          idempotencyKey,
          items: {
            create: items.map((it: any) => ({
              productId: it.productId,
              nozzleId: it.nozzleId,
              pumpId: it.pumpId,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              discountAmount: it.discountAmount || 0,
              taxAmount: it.taxAmount || 0,
              totalAmount: Number(it.quantity) * Number(it.unitPrice),
              openingMeter: it.openingMeter,
              closingMeter: it.closingMeter,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Process payments
      if (payments && payments.length > 0) {
        for (const p of payments) {
          await tx.payment.create({
            data: {
              saleId: sale.id,
              customerId,
              branchId,
              method: p.method,
              amount: p.amount,
              netAmount: p.amount,
              reference: p.reference,
              providerReference: p.providerReference,
              status: 'COMPLETED',
              notes: p.notes,
              createdBy: userId,
            },
          });
        }
      }

      // 3. Update nozzle meter readings & tank stock & inventory ledger
      for (const it of items) {
        if (it.nozzleId) {
          await tx.nozzle.update({
            where: { id: it.nozzleId },
            data: {
              currentMeterReading: { increment: it.quantity },
            },
          });
        }

        // Find tank with this product in this branch
        const tank = await tx.tank.findFirst({
          where: { branchId, productId: it.productId, status: 'ACTIVE' },
        });

        if (tank) {
          await tx.tank.update({
            where: { id: tank.id },
            data: {
              currentStock: { decrement: it.quantity },
            },
          });

          await tx.inventoryLedger.create({
            data: {
              branchId,
              productId: it.productId,
              tankId: tank.id,
              date: new Date(),
              movementType: 'SALE',
              quantity: -Number(it.quantity),
              balanceAfter: Number(tank.currentStock) - Number(it.quantity),
              referenceType: 'SALE',
              referenceId: sale.id,
              notes: `POS Sale ${saleNumber}`,
              createdBy: userId,
            },
          });
        }
      }

      // 4. Update Shift if active
      if (shiftId) {
        const cashPaymentTotal = payments
          ?.filter((p: any) => p.method === 'CASH')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
        const momoPaymentTotal = payments
          ?.filter((p: any) => p.method === 'MOBILE_MONEY')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
        const cardPaymentTotal = payments
          ?.filter((p: any) => p.method === 'CARD')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

        await tx.shift.update({
          where: { id: shiftId },
          data: {
            totalSales: { increment: totalAmount },
            totalTransactions: { increment: 1 },
            expectedCash: { increment: cashPaymentTotal },
            mobileMoney: { increment: momoPaymentTotal },
            cardPayments: { increment: cardPaymentTotal },
          },
        });
      }

      // 5. Update Customer credit balance if credit sale
      if (customerId && payments?.some((p: any) => p.method === 'CREDIT')) {
        const creditAmt = payments
          .filter((p: any) => p.method === 'CREDIT')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        await tx.customer.update({
          where: { id: customerId },
          data: { currentBalance: { increment: creditAmt } },
        });
      }

      return tx.sale.findUnique({
        where: { id: sale.id },
        include: {
          items: { include: { product: true, nozzle: true, pump: true } },
          payments: true,
          cashier: { select: { firstName: true, lastName: true } },
          branch: true,
          customer: true,
        },
      });
    });
  }
}
