import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.fuelProduct.findMany({
      include: {
        prices: {
          orderBy: { effectiveFrom: 'desc' },
          take: 1,
        },
        _count: {
          select: { nozzles: true, tanks: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.fuelProduct.findUnique({
      where: { id },
      include: {
        prices: { orderBy: { effectiveFrom: 'desc' } },
        tanks: true,
        nozzles: { include: { pump: true } },
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager')
  async create(@Body() body: any) {
    return this.prisma.fuelProduct.create({
      data: {
        companyId: body.companyId,
        code: body.code,
        name: body.name,
        unit: body.unit || 'litre',
        color: body.color,
        isActive: body.isActive ?? true,
      },
    });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.fuelProduct.update({ where: { id }, data });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.fuelProduct.delete({ where: { id } });
  }
}
