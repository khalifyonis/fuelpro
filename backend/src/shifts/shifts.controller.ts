import { Controller, Get, Post, Body, Param, Put, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShiftsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('branchId') branchId?: string, @Query('status') status?: any) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (status) where.status = status;

    return this.prisma.shift.findMany({
      where,
      include: {
        cashier: { select: { firstName: true, lastName: true, username: true } },
        branch: true,
        assignments: { include: { pump: true } },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  @Get('active')
  async getActiveShift(@CurrentUser('id') userId: string) {
    return this.prisma.shift.findFirst({
      where: {
        cashierId: userId,
        status: 'OPEN',
      },
      include: {
        branch: true,
        assignments: { include: { pump: { include: { nozzles: true } } } },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.shift.findUnique({
      where: { id },
      include: {
        cashier: { select: { firstName: true, lastName: true, username: true } },
        branch: true,
        sales: {
          include: {
            items: { include: { product: true } },
            payments: true,
          },
          orderBy: { saleDate: 'desc' },
        },
        assignments: { include: { pump: true } },
      },
    });
  }

  @Post('open')
  @Roles('Super Admin', 'Station Manager', 'Supervisor', 'Cashier')
  async openShift(@Body() body: any, @CurrentUser('id') userId: string) {
    // Check if user already has an open shift
    const existing = await this.prisma.shift.findFirst({
      where: { cashierId: userId, status: 'OPEN' },
    });
    if (existing) {
      throw new BadRequestException('You already have an active shift open');
    }

    const shiftNumber = `SHF-${Date.now().toString().slice(-6)}`;
    const openingCash = Number(body.openingCash || 0);

    return this.prisma.shift.create({
      data: {
        branchId: body.branchId,
        cashierId: userId,
        shiftNumber,
        startTime: new Date(),
        status: 'OPEN',
        openingCash,
        expectedCash: openingCash,
        assignments: body.pumpIds?.length
          ? {
              create: body.pumpIds.map((pumpId: string) => ({
                pumpId,
              })),
            }
          : undefined,
      },
      include: { branch: true },
    });
  }

  @Put(':id/close')
  @Roles('Super Admin', 'Station Manager', 'Supervisor', 'Cashier')
  async closeShift(@Param('id') id: string, @Body() body: any) {
    const shift = await this.prisma.shift.findUnique({ where: { id } });
    if (!shift) throw new BadRequestException('Shift not found');
    if (shift.status === 'CLOSED') throw new BadRequestException('Shift is already closed');

    const actualCash = Number(body.actualCash || 0);
    const expectedCash = Number(shift.expectedCash);
    const cashVariance = actualCash - expectedCash;

    return this.prisma.shift.update({
      where: { id },
      data: {
        endTime: new Date(),
        status: 'CLOSED',
        actualCash,
        cashVariance,
        closingNotes: body.closingNotes,
      },
    });
  }

  @Put(':id/reopen')
  @Roles('Super Admin', 'Station Manager')
  async reopenShift(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.prisma.shift.update({
      where: { id },
      data: {
        status: 'REOPENED',
        reopenedBy: userId,
        reopenedAt: new Date(),
        reopenReason: reason,
      },
    });
  }
}
