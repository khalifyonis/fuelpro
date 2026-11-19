import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getSettings() {
    const settings = await this.prisma.systemSetting.findMany();
    const company = await this.prisma.company.findFirst();
    return {
      company,
      settings: settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  @Put()
  @Roles('Super Admin')
  async updateSettings(@Body() body: any) {
    const { company, settings } = body;
    if (company && company.id) {
      await this.prisma.company.update({
        where: { id: company.id },
        data: company,
      });
    }

    if (settings && company?.id) {
      for (const [key, value] of Object.entries(settings)) {
        await this.prisma.systemSetting.upsert({
          where: {
            companyId_key: {
              companyId: company.id,
              key,
            },
          },
          update: { value: String(value) },
          create: {
            companyId: company.id,
            key,
            value: String(value),
          },
        });
      }
    }

    return { success: true };
  }
}
