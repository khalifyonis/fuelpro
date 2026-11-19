import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('pumps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PumpsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    return this.prisma.pump.findMany({
      where,
      include: {
        branch: true,
        nozzles: {
          include: {
            product: {
              include: {
                prices: {
                  where: { isApproved: true },
                  orderBy: { effectiveFrom: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.pump.findUnique({
      where: { id },
      include: {
        nozzles: { include: { product: true } },
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager')
  async create(@Body() body: any) {
    return this.prisma.pump.create({ data: body });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager', 'Maintenance Technician')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.pump.update({ where: { id }, data });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.pump.delete({ where: { id } });
  }
}
