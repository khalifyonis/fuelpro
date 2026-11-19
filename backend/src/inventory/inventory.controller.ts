import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async getSummary(@Query('branchId') branchId?: string) {
    const whereBranch = branchId ? { branchId } : {};

    const tanks = await this.prisma.tank.findMany({
      where: whereBranch,
      include: { product: true, branch: true },
    });

    const products = await this.prisma.fuelProduct.findMany({
      include: {
        tanks: { where: whereBranch },
      },
    });

    return {
      tanks: tanks.map((t) => ({
        id: t.id,
        name: t.name,
        code: t.code,
        productName: t.product.name,
        branchName: t.branch.name,
        capacity: Number(t.capacity),
        currentStock: Number(t.currentStock),
        minimumLevel: Number(t.minimumLevel),
        percentage: Number(t.capacity) > 0 ? (Number(t.currentStock) / Number(t.capacity)) * 100 : 0,
        status: t.status,
      })),
      productTotals: products.map((p) => {
        const totalStock = p.tanks.reduce((sum, t) => sum + Number(t.currentStock), 0);
        const totalCapacity = p.tanks.reduce((sum, t) => sum + Number(t.capacity), 0);
        return {
          productId: p.id,
          productName: p.name,
          color: p.color,
          totalStock,
          totalCapacity,
          percentage: totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0,
        };
      }),
    };
  }

  @Get('ledger')
  async getLedger(
    @Query('branchId') branchId?: string,
    @Query('productId') productId?: string,
    @Query('take') take = '50',
  ) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (productId) where.productId = productId;

    return this.prisma.inventoryLedger.findMany({
      where,
      include: { product: true, branch: true },
      orderBy: { date: 'desc' },
      take: Number(take),
    });
  }

  @Post('adjustments')
  @Roles('Super Admin', 'Station Manager', 'Inventory Officer')
  async createAdjustment(@Body() body: any, @CurrentUser('id') userId: string) {
    const adjustment = await this.prisma.stockAdjustment.create({
      data: {
        branchId: body.branchId,
        productId: body.productId,
        tankId: body.tankId,
        adjustmentDate: new Date(),
        quantity: body.quantity,
        reason: body.reason,
        createdBy: userId,
      },
    });

    // If auto-approved or approved
    if (body.autoApprove) {
      await this.prisma.stockAdjustment.update({
        where: { id: adjustment.id },
        data: {
          approvalStatus: 'APPROVED',
          approvedBy: userId,
          approvedAt: new Date(),
        },
      });

      if (body.tankId) {
        await this.prisma.tank.update({
          where: { id: body.tankId },
          data: { currentStock: { increment: body.quantity } },
        });
      }

      await this.prisma.inventoryLedger.create({
        data: {
          branchId: body.branchId,
          productId: body.productId,
          tankId: body.tankId,
          date: new Date(),
          movementType: 'ADJUSTMENT',
          quantity: body.quantity,
          balanceAfter: 0,
          referenceType: 'ADJUSTMENT',
          referenceId: adjustment.id,
          notes: body.reason,
          createdBy: userId,
        },
      });
    }

    return adjustment;
  }

  @Get('transfers')
  async getTransfers(@Query('branchId') branchId?: string) {
    const where: any = {};
    if (branchId) {
      where.OR = [{ fromBranchId: branchId }, { toBranchId: branchId }];
    }
    return this.prisma.stockTransfer.findMany({
      where,
      include: {
        fromBranch: true,
        toBranch: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('transfers')
  @Roles('Super Admin', 'Station Manager')
  async createTransfer(@Body() body: any, @CurrentUser('id') userId: string) {
    return this.prisma.stockTransfer.create({
      data: {
        fromBranchId: body.fromBranchId,
        toBranchId: body.toBranchId,
        productId: body.productId,
        quantity: body.quantity,
        notes: body.notes,
        createdBy: userId,
      },
    });
  }
}
