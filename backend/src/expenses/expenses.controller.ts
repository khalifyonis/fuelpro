import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  constructor(private prisma: PrismaService) {}

  @Get('categories')
  async getCategories() {
    return this.prisma.expenseCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  @Post('categories')
  @Roles('Super Admin', 'Accountant')
  async createCategory(@Body() body: any) {
    return this.prisma.expenseCategory.create({ data: body });
  }

  @Get()
  async findAll(@Query('branchId') branchId?: string, @Query('status') status?: any) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (status) where.status = status;

    return this.prisma.expense.findMany({
      where,
      include: {
        category: true,
        branch: true,
      },
      orderBy: { expenseDate: 'desc' },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager', 'Accountant')
  async create(@Body() body: any, @CurrentUser('id') userId: string) {
    return this.prisma.expense.create({
      data: {
        branchId: body.branchId,
        categoryId: body.categoryId,
        amount: body.amount,
        description: body.description,
        vendor: body.vendor,
        expenseDate: new Date(body.expenseDate || Date.now()),
        status: body.status || 'SUBMITTED',
        createdBy: userId,
      },
    });
  }

  @Put(':id/approve')
  @Roles('Super Admin', 'Station Manager', 'Accountant')
  async approve(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.prisma.expense.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }

  @Put(':id/reject')
  @Roles('Super Admin', 'Station Manager')
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.prisma.expense.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedBy: userId,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }
}
