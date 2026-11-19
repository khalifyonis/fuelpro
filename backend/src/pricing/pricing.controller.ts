import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('pricing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PricingController {
  constructor(private prisma: PrismaService) {}

  @Get('history/:productId')
  async getProductPriceHistory(@Param('productId') productId: string) {
    return this.prisma.fuelPrice.findMany({
      where: { productId },
      include: { product: true, branch: true },
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager')
  async createPrice(@Body() body: any, @CurrentUser('id') userId: string) {
    return this.prisma.fuelPrice.create({
      data: {
        productId: body.productId,
        branchId: body.branchId,
        costPrice: body.costPrice,
        sellingPrice: body.sellingPrice,
        effectiveFrom: new Date(body.effectiveFrom || Date.now()),
        isApproved: body.isApproved ?? true,
        createdBy: userId,
      },
    });
  }

  @Put(':id/approve')
  @Roles('Super Admin')
  async approvePrice(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.prisma.fuelPrice.update({
      where: { id },
      data: {
        isApproved: true,
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }
}
