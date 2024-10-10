import { Module } from '@nestjs/common';
import { ParticipationController } from './infrastructure/participation.controller';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { GetParticipationInEpisode } from './application/getParticipationsInEpisode.application';
import { DeleteCharacterFromParticipation } from './../participation/application/deleteCharacterFromEpisode.application';
import { CharacterRepository } from 'src/characters/infrastructure/Repositories/characterAPIRepository';
import { ParticipationRepository } from './infrastructure/Repository/participationRepository';
import { CharacterRepositoryMethods } from 'src/characters/infrastructure/Repositories/characterRepositoryMethods';
import { AddCharacterFromParticipation } from './application/addCharacterFromEpisode.application';
import { EpisodesRepositoryMethods } from 'src/episodes/infrastructure/Repositories/episodeRepositoryApi';

@Module({
  imports: [],
  providers: [
    MigrationService,
    GetParticipationInEpisode, 
    DeleteCharacterFromParticipation,
    AddCharacterFromParticipation,

    {
      provide: 'IParticipationRepository',
      useClass: ParticipationRepository,
    },
    {
      provide: 'IRepositoryCharacter',
      useClass: CharacterRepository,
    },
    EpisodesRepositoryMethods,
    ParticipationRepository,
    CharacterRepositoryMethods 
  ],
  exports: [
    MigrationService,
    GetParticipationInEpisode,
    DeleteCharacterFromParticipation,
    AddCharacterFromParticipation,
    ParticipationRepository,
    CharacterRepositoryMethods,
    EpisodesRepositoryMethods
  ],
  controllers: [ParticipationController]
})
export class ParticipationModule {}