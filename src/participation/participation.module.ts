import { Module } from '@nestjs/common';
import { ParticipationController } from './participation.controller';

@Module({
  controllers: [ParticipationController]
})
export class ParticipationModule {}
