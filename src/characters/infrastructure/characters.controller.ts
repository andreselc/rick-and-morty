import { Body, 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Param, 
    Query, 
    Delete,
    NotFoundException,
    BadRequestException, } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCharacterById } from '../application/getCharacterById.application';
import { CreateCharacterDto } from '../application/Dtos/createCharacter.dto';
import { CharacterDto } from '../application/Dtos/characterDto.dto';
import { GetAllCharacters } from '../application/getAllCharacters.application';
import { KillACharacter } from '../application/killACharacter.application';
import { CharacterRepositoryMethods } from './Repositories/characterRepositoryMethods';
import { PrismaClient } from '@prisma/client';
import { find } from 'rxjs';

  
  //NOTA: Recuerda que Session es para manejar los cookies.
  @Controller() //Recuerda que este es como un prefijo para nuestras rutas
  
  @ApiTags("Characters")
  export class CharactersController {

  
   constructor (
    private getAllCharacters: GetAllCharacters,
    private killACharacter: KillACharacter,
    private charactersRepository: CharacterRepositoryMethods,
   )  {
    this.charactersRepository = new CharacterRepositoryMethods();
    this.killACharacter = new KillACharacter(charactersRepository);
   }
  
   @Post("addCharacter")
   addCharacter(@Body() body: CreateCharacterDto){
    return this.charactersRepository.create();

   }
  
   @Get("getAllCharacters")
   @ApiQuery({ name: 'type', required: false, type: String })
   @ApiQuery({ name: 'species', required: false, type: String })
   @ApiQuery({ name: 'page', required: false, type: Number })
   findAllCharacters(
    @Query('type') type?: string,
    @Query('species') species?: string,
    @Query('page') page: number = 1,
   ) :Promise<CharacterDto[]> {
    return this.getAllCharacters.getCharacters({ type, species }, page );
  }
  
  @Delete("suspendCharacter/:id")
  async suspendCharacter(@Param("id") id: number) {
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      throw new BadRequestException(`Invalid ID: ${id}`);
    }

    try {
      await this.killACharacter.execute(id);
      return `Character with ID ${id} has been suspended`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Character with ID ${id} not found`);
      }
      throw error;
    }
  }


   @Patch ("/:id")
   updateUser(){

   }

}