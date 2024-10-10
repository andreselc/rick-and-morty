import { Module } from '@nestjs/common';
import { ParticipationController } from './infrastructure/participation.controller';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { GetParticipationInEpisode } from './application/getParticipationsInEpisode.application';
import { DeleteCharacterFromParticipation } from './application/deleteCharacterFromEpisode';
import { CharacterRepository } from 'src/characters/infrastructure/Repositories/characterAPIRepository';
import { ParticipationRepository } from './infrastructure/Repository/participationRepository';
import { CharacterRepositoryMethods } from 'src/characters/infrastructure/Repositories/characterRepositoryMethods';

@Module({
  imports: [],
  providers: [
    MigrationService,
    GetParticipationInEpisode, 
    DeleteCharacterFromParticipation,
    {
      provide: 'IParticipationRepository',
      useClass: ParticipationRepository,
    },
    {
      provide: 'IRepositoryCharacter',
      useClass: CharacterRepository,
    },
    ParticipationRepository,
    CharacterRepositoryMethods 
  ],
  exports: [
    MigrationService,
    GetParticipationInEpisode,
    DeleteCharacterFromParticipation,
    ParticipationRepository,
    CharacterRepositoryMethods 
  ],
  controllers: [ParticipationController]
})
export class ParticipationModule {}