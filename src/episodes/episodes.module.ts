import { Module } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { EpisodesController } from './infrastructure/episodes.controller';
import { GetAllEpisodes } from './application/getAllEpisodes.application';

@Module({
    imports: [],
    providers: [MigrationService,
      GetAllEpisodes,    
    ],
    exports: [MigrationService,
      GetAllEpisodes,

    ],
    controllers:  [EpisodesController]
  })
  export class EpisodesModule {}