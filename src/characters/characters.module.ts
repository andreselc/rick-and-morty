import { Module } from '@nestjs/common';
import { CharactersController } from './infrastructure/characters.controller';
import { GetCharacterById } from './application/getCharacterById.application';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { CreateCharacterDto } from './application/Dtos/createCharacter.dto';
import { CharacterDto } from './application/Dtos/characterDto.dto';

@Module({
    providers: [MigrationService, GetCharacterById, CreateCharacterDto, CharacterDto],
    exports: [MigrationService, GetCharacterById, CreateCharacterDto, CharacterDto],
    controllers:  [CharactersController]
  })
  export class CharactersModule {}
