import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async getFinancialSummary(@Query('branchId') branchId?: string) {
    const whereBranch = branchId ? { branchId } : {};

    // 1. Total Sales Revenue
    const sales = await this.prisma.sale.aggregate({
      where: { ...whereBranch, status: 'COMPLETED' },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // 2. Payments by Method
    const payments = await this.prisma.payment.groupBy({
      by: ['method'],
      where: { ...whereBranch, status: 'COMPLETED' },
      _sum: { amount: true },
      _count: { id: true },
    });

    // 3. Approved Expenses
    const expenses = await this.prisma.expense.aggregate({
      where: { ...whereBranch, status: 'APPROVED' },
      _sum: { amount: true },
      _count: { id: true },
    });

    // 4. Receivables (Customer Balances)
    const receivables = await this.prisma.customer.aggregate({
      _sum: { currentBalance: true },
      _count: { id: true },
    });

    // 5. Payables (Supplier Balances)
    const payables = await this.prisma.supplier.aggregate({
      _sum: { balance: true },
      _count: { id: true },
    });

    const totalRevenue = Number(sales._sum.totalAmount || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);
    const netProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalTransactions: sales._count.id,
      receivables: Number(receivables._sum.currentBalance || 0),
      payables: Number(payables._sum.balance || 0),
      paymentsByMethod: payments.map((p) => ({
        method: p.method,
        amount: Number(p._sum.amount || 0),
        count: p._count.id,
      })),
    };
  }
}
