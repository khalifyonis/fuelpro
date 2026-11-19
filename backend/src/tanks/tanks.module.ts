import { Module } from '@nestjs/common';
import { TanksController } from './tanks.controller';

@Module({
  controllers: [TanksController],
})
export class TanksModule {}
