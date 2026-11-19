import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tanks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TanksController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    return this.prisma.tank.findMany({
      where,
      include: {
        product: true,
        branch: true,
        readings: {
          orderBy: { readingDate: 'desc' },
          take: 5,
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.tank.findUnique({
      where: { id },
      include: {
        product: true,
        branch: true,
        readings: {
          orderBy: { readingDate: 'desc' },
          take: 20,
        },
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager')
  async create(@Body() body: any) {
    return this.prisma.tank.create({ data: body });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager', 'Inventory Officer')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.tank.update({ where: { id }, data });
  }

  @Post(':id/readings')
  @Roles('Super Admin', 'Station Manager', 'Inventory Officer', 'Pump Attendant')
  async recordReading(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('id') userId: string,
  ) {
    const tank = await this.prisma.tank.findUnique({ where: { id } });
    if (!tank) throw new Error('Tank not found');

    const previousStock = Number(tank.currentStock);
    const calculatedVolume = Number(body.calculatedVolume);
    const variance = calculatedVolume - previousStock;

    // Create reading
    const reading = await this.prisma.tankReading.create({
      data: {
        tankId: id,
        readingDate: new Date(),
        dipReading: body.dipReading,
        calculatedVolume,
        previousReading: previousStock,
        variance,
        readBy: userId,
        notes: body.notes,
      },
    });

    // Update current tank stock
    await this.prisma.tank.update({
      where: { id },
      data: { currentStock: calculatedVolume },
    });

    return reading;
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.tank.delete({ where: { id } });
  }
}
