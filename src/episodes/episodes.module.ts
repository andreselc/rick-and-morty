import { Module } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { EpisodesController } from './infrastructure/episodes.controller';
import { GetAllEpisodes } from './application/getAllEpisodes.application';
import { CancellAnEpisode } from './application/cancellAnEpisode.application';
import { EpisodesRepositoryMethods } from './infrastructure/Repositories/episodeRepositoryApi';
import { CreateEpisodeDto } from './application/Dtos/createepisode.dto';
import { EpisodeDto } from './application/Dtos/episodeDto.dto';

@Module({
    imports: [],
    providers: [MigrationService,
      GetAllEpisodes, 
      CancellAnEpisode,
      CreateEpisodeDto, 
      EpisodeDto,
      EpisodesRepositoryMethods,
    ],
    exports: [MigrationService,
      GetAllEpisodes,
      CancellAnEpisode,
      CreateEpisodeDto,
      EpisodeDto,
      EpisodesRepositoryMethods,
    ],
    controllers:  [EpisodesController]
  })
  export class EpisodesModule {}