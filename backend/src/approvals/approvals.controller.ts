import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Roles('Super Admin', 'Station Manager')
  async findAll(@Query('status') status?: any) {
    const where: any = {};
    if (status) where.status = status;
    return this.prisma.approval.findMany({
      where,
      include: { branch: true },
      orderBy: { requestedAt: 'desc' },
    });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager')
  async review(
    @Param('id') id: string,
    @Body() body: { status: any; comments?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.prisma.approval.update({
      where: { id },
      data: {
        status: body.status,
        comments: body.comments,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });
  }
}
