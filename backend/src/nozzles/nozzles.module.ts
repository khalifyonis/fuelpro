import { Module } from '@nestjs/common';
import { NozzlesController } from './nozzles.controller';

@Module({
  controllers: [NozzlesController],
})
export class NozzlesModule {}
