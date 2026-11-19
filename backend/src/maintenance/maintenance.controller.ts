import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceController {
  constructor(private prisma: PrismaService) {}

  @Get('equipment')
  async getEquipment(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    return this.prisma.equipment.findMany({
      where,
      include: {
        branch: true,
        workOrders: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  @Post('equipment')
  @Roles('Super Admin', 'Station Manager', 'Maintenance Technician')
  async createEquipment(@Body() body: any) {
    return this.prisma.equipment.create({ data: body });
  }

  @Get('work-orders')
  async getWorkOrders(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    return this.prisma.maintenanceWorkOrder.findMany({
      where,
      include: {
        equipment: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('work-orders')
  @Roles('Super Admin', 'Station Manager', 'Maintenance Technician', 'Pump Attendant')
  async createWorkOrder(@Body() body: any, @CurrentUser('id') userId: string) {
    const orderNumber = `WO-${Date.now().toString().slice(-6)}`;
    return this.prisma.maintenanceWorkOrder.create({
      data: {
        equipmentId: body.equipmentId,
        branchId: body.branchId,
        orderNumber,
        title: body.title,
        description: body.description,
        priority: body.priority || 'MEDIUM',
        status: 'OPEN',
        assignedTo: body.assignedTo,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        createdBy: userId,
      },
    });
  }

  @Put('work-orders/:id')
  @Roles('Super Admin', 'Station Manager', 'Maintenance Technician')
  async updateWorkOrder(@Param('id') id: string, @Body() data: any) {
    return this.prisma.maintenanceWorkOrder.update({
      where: { id },
      data,
    });
  }

  @Get('safety')
  async getSafetyChecklists(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    return this.prisma.safetyChecklist.findMany({
      where,
      include: { branch: true },
      orderBy: { checklistDate: 'desc' },
    });
  }

  @Post('safety')
  @Roles('Super Admin', 'Station Manager', 'Pump Attendant')
  async createSafetyChecklist(@Body() body: any, @CurrentUser('id') userId: string) {
    return this.prisma.safetyChecklist.create({
      data: {
        branchId: body.branchId,
        checklistDate: new Date(),
        completedBy: userId,
        type: body.type || 'DAILY',
        items: body.items || [],
        notes: body.notes,
      },
    });
  }
}
