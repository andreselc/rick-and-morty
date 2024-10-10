import { Module } from '@nestjs/common';
import { ParticipationController } from './infrastructure/participation.controller';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { GetParticipationInEpisode } from './application/getParticipationsInEpisode.application';

@Module({
  imports: [],
    providers: [MigrationService,
      GetParticipationInEpisode, 
    ],
    exports: [MigrationService,
      GetParticipationInEpisode,

    ],
  controllers: [ParticipationController]
})
export class ParticipationModule {}
