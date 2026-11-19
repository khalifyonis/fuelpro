import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.supplier.findMany({
      include: {
        _count: {
          select: { purchaseOrders: true, deliveries: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.supplier.findUnique({
      where: { id },
      include: {
        deliveries: { orderBy: { deliveryDate: 'desc' }, take: 10 },
        purchaseOrders: { orderBy: { orderDate: 'desc' }, take: 10 },
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager', 'Accountant')
  async create(@Body() body: any) {
    return this.prisma.supplier.create({ data: body });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager', 'Accountant')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.supplier.update({ where: { id }, data });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.supplier.delete({ where: { id } });
  }
}
