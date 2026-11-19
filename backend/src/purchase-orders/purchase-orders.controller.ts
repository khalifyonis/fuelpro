import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseOrdersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    return this.prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        branch: true,
        items: { include: { product: true } },
      },
      orderBy: { orderDate: 'desc' },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager', 'Inventory Officer')
  async create(@Body() body: any, @CurrentUser('id') userId: string) {
    const orderNumber = `PO-${Date.now().toString().slice(-6)}`;
    const items = body.items || [];
    const totalAmount = items.reduce(
      (sum: number, it: any) => sum + Number(it.quantity) * Number(it.unitPrice),
      0,
    );

    return this.prisma.purchaseOrder.create({
      data: {
        companyId: body.companyId,
        branchId: body.branchId,
        supplierId: body.supplierId,
        orderNumber,
        orderDate: new Date(),
        expectedDeliveryDate: body.expectedDeliveryDate ? new Date(body.expectedDeliveryDate) : null,
        status: 'SUBMITTED',
        totalAmount,
        notes: body.notes,
        createdBy: userId,
        items: {
          create: items.map((it: any) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            totalPrice: Number(it.quantity) * Number(it.unitPrice),
          })),
        },
      },
      include: { items: true },
    });
  }

  @Put(':id/status')
  @Roles('Super Admin', 'Station Manager')
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    });
  }
}
