import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.branch.findMany({
      include: {
        _count: {
          select: { pumps: true, tanks: true, userBranchRoles: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.branch.findUnique({
      where: { id },
      include: {
        pumps: { include: { nozzles: true } },
        tanks: { include: { product: true } },
      },
    });
  }

  @Post()
  @Roles('Super Admin')
  async create(@Body() data: any) {
    return this.prisma.branch.create({ data });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.branch.update({ where: { id }, data });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.branch.delete({ where: { id } });
  }
}
