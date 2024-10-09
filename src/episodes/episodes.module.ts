import { Module } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { EpisodesController } from './infrastructure/episodes.controller';

@Module({
    imports: [],
    providers: [MigrationService     
    ],
    exports: [MigrationService

    ],
    controllers:  [EpisodesController]
  })
  export class EpisodesModule {}