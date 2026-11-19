import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Roles('Super Admin', 'Auditor')
  async findAll(@Query('take') take = '100') {
    return this.prisma.auditLog.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Number(take),
    });
  }
}
