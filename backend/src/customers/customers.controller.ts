import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        vehicles: true,
        _count: { select: { sales: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: true,
        sales: {
          take: 20,
          orderBy: { saleDate: 'desc' },
          include: { items: { include: { product: true } } },
        },
        customerPayments: {
          take: 10,
          orderBy: { paymentDate: 'desc' },
        },
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager', 'Accountant', 'Cashier')
  async create(@Body() body: any) {
    const { vehicles, ...rest } = body;
    return this.prisma.customer.create({
      data: {
        ...rest,
        vehicles: vehicles?.length
          ? {
              create: vehicles.map((v: any) => ({
                plateNumber: v.plateNumber,
                make: v.make,
                model: v.model,
                fuelType: v.fuelType,
              })),
            }
          : undefined,
      },
      include: { vehicles: true },
    });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager', 'Accountant')
  async update(@Param('id') id: string, @Body() body: any) {
    const { vehicles, ...rest } = body;
    return this.prisma.customer.update({
      where: { id },
      data: rest,
    });
  }

  @Post(':id/payments')
  @Roles('Super Admin', 'Station Manager', 'Accountant')
  async recordPayment(
    @Param('id') customerId: string,
    @Body() body: any,
    @CurrentUser('id') userId: string,
  ) {
    const amount = Number(body.amount);

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.customerPayment.create({
        data: {
          customerId,
          branchId: body.branchId,
          paymentDate: new Date(),
          amount,
          method: body.method || 'CASH',
          reference: body.reference,
          notes: body.notes,
          createdBy: userId,
        },
      });

      await tx.customer.update({
        where: { id: customerId },
        data: { currentBalance: { decrement: amount } },
      });

      return payment;
    });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }
}
