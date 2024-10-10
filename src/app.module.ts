import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  
import { CharactersController } from './characters/infrastructure/characters.controller';
import { CharactersModule } from './characters/characters.module';
import { EpisodesController } from './episodes/infrastructure/episodes.controller';
import { EpisodesModule } from './episodes/episodes.module';
import { ParticipationModule } from './participation/participation.module';
import { ParticipationController } from './participation/infrastructure/participation.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CharactersModule,
    EpisodesModule,
    ParticipationModule

  ],
  controllers: [CharactersController,
    EpisodesController,
    ParticipationController
  ],
  providers: [],
})
export class AppModule {}
