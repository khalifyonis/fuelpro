import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('nozzles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NozzlesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.nozzle.findMany({
      include: {
        pump: { include: { branch: true } },
        product: true,
      },
    });
  }

  @Post()
  @Roles('Super Admin', 'Station Manager')
  async create(@Body() body: any) {
    return this.prisma.nozzle.create({ data: body });
  }

  @Put(':id')
  @Roles('Super Admin', 'Station Manager', 'Maintenance Technician', 'Pump Attendant')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.nozzle.update({ where: { id }, data });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.nozzle.delete({ where: { id } });
  }
}
