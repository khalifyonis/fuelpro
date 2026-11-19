import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    return this.prisma.delivery.findMany({
      where,
      include: {
        supplier: true,
        branch: true,
        items: {
          include: { product: true, tank: true },
        },
      },
      orderBy: { deliveryDate: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.delivery.findUnique({
      where: { id },
      include: {
        supplier: true,
        branch: true,
        purchaseOrder: true,
        items: {
          include: { product: true, tank: true },
        },
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager', 'Inventory Officer')
  async create(@Body() body: any, @CurrentUser('id') userId: string) {
    const deliveryNumber = `DEL-${Date.now().toString().slice(-6)}`;
    const items = body.items || [];

    const totalExpected = items.reduce((sum: number, it: any) => sum + Number(it.expectedQuantity || 0), 0);
    const totalReceived = items.reduce((sum: number, it: any) => sum + Number(it.receivedQuantity || 0), 0);
    const variance = totalReceived - totalExpected;

    return this.prisma.delivery.create({
      data: {
        branchId: body.branchId,
        supplierId: body.supplierId,
        purchaseOrderId: body.purchaseOrderId,
        deliveryNumber,
        deliveryDate: new Date(body.deliveryDate || Date.now()),
        truckNumber: body.truckNumber,
        driverName: body.driverName,
        driverLicense: body.driverLicense,
        sealNumber: body.sealNumber,
        deliveryNoteRef: body.deliveryNoteRef,
        status: body.status || 'RECEIVED',
        totalExpected,
        totalReceived,
        variance,
        notes: body.notes,
        createdBy: userId,
        receivedBy: userId,
        items: {
          create: items.map((it: any) => ({
            productId: it.productId,
            tankId: it.tankId,
            expectedQuantity: it.expectedQuantity,
            receivedQuantity: it.receivedQuantity,
            variance: Number(it.receivedQuantity || 0) - Number(it.expectedQuantity || 0),
            preDeliveryReading: it.preDeliveryReading,
            postDeliveryReading: it.postDeliveryReading,
            notes: it.notes,
          })),
        },
      },
      include: { items: true },
    });
  }

  @Put(':id/approve')
  @Roles('Super Admin', 'Station Manager')
  async approveDelivery(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!delivery) throw new Error('Delivery not found');
    if (delivery.status === 'APPROVED') throw new Error('Already approved');

    // Update each item in the tank and inventory ledger
    for (const item of delivery.items) {
      if (item.tankId && Number(item.receivedQuantity) > 0) {
        await this.prisma.tank.update({
          where: { id: item.tankId },
          data: { currentStock: { increment: item.receivedQuantity } },
        });

        await this.prisma.inventoryLedger.create({
          data: {
            branchId: delivery.branchId,
            productId: item.productId,
            tankId: item.tankId,
            date: new Date(),
            movementType: 'DELIVERY',
            quantity: item.receivedQuantity,
            balanceAfter: 0,
            referenceType: 'DELIVERY',
            referenceId: delivery.id,
            notes: `Delivery ${delivery.deliveryNumber}`,
            createdBy: userId,
          },
        });
      }
    }

    return this.prisma.delivery.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }
}
