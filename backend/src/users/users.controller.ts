import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Roles('Super Admin', 'Station Manager')
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        userBranchRoles: {
          include: {
            role: true,
            branch: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('roles')
  async getRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        status: true,
        userBranchRoles: {
          include: {
            role: true,
            branch: true,
          },
        },
      },
    });
  }

  @Post()
  @Roles('Super Admin')
  async create(@Body() body: any) {
    const passwordHash = await bcrypt.hash(body.password || 'FuelPro@123', 10);
    const user = await this.prisma.user.create({
      data: {
        companyId: body.companyId,
        email: body.email,
        username: body.username,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        status: body.status || 'ACTIVE',
      },
    });

    if (body.roleId && body.branchId) {
      await this.prisma.userBranchRole.create({
        data: {
          userId: user.id,
          branchId: body.branchId,
          roleId: body.roleId,
        },
      });
    }

    return user;
  }

  @Put(':id')
  @Roles('Super Admin')
  async update(@Param('id') id: string, @Body() body: any) {
    const data: any = {
      email: body.email,
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      status: body.status,
    };
    if (body.password) {
      data.passwordHash = await bcrypt.hash(body.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
