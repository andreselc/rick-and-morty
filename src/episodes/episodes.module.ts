import { Module } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { EpisodesController } from './infrastructure/episodes.controller';
import { GetAllEpisodes } from './application/getAllEpisodes.application';
import { CancellAnEpisode } from './application/cancellAnEpisode.application';
import { EpisodesRepositoryMethods } from './infrastructure/Repositories/episodeRepositoryApi';

@Module({
    imports: [],
    providers: [MigrationService,
      GetAllEpisodes, 
      CancellAnEpisode  ,
      EpisodesRepositoryMethods,
    ],
    exports: [MigrationService,
      GetAllEpisodes,
      CancellAnEpisode,
      EpisodesRepositoryMethods,
    ],
    controllers:  [EpisodesController]
  })
  export class EpisodesModule {}