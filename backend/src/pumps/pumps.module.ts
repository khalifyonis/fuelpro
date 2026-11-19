import { Module } from '@nestjs/common';
import { PumpsController } from './pumps.controller';

@Module({
  controllers: [PumpsController],
})
export class PumpsModule {}
