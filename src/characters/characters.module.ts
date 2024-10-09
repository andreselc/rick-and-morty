import { Module } from '@nestjs/common';
import { CharactersController } from './infrastructure/characters.controller';
import { GetCharacterById } from './application/getCharacterById.application';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { CreateCharacterDto } from './application/Dtos/createCharacter.dto';
import { CharacterDto } from './application/Dtos/characterDto.dto';
import { GetAllCharacters } from './application/getAllCharacters.application';
import { KillACharacter } from './application/killACharacter.application';
import { CharacterRepository } from './infrastructure/Repositories/characterAPIRepository';
import { CharacterRepositoryMethods } from './infrastructure/Repositories/characterRepositoryMethods';


@Module({
    imports: [/*PrismaModule*/],
    providers: [MigrationService, 
        GetCharacterById, 
        GetAllCharacters,
        CreateCharacterDto,
        CharacterRepositoryMethods, 
        CharacterDto,
        KillACharacter,
        {
            provide: 'IRepositoryCharacter',
            useClass: CharacterRepository,
        },
    ],
    exports: [MigrationService, 
        GetCharacterById, 
        GetAllCharacters,
        CreateCharacterDto, 
        CharacterRepositoryMethods,
        CharacterDto,
        KillACharacter],
    controllers:  [CharactersController]
  })
  export class CharactersModule {}
