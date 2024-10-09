import { Body, 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Param, 
    Query, 
    Delete,
    NotFoundException, } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCharacterById } from '../application/getCharacterById.application';
import { CreateCharacterDto } from '../application/Dtos/createCharacter.dto';
import { CharacterDto } from '../application/Dtos/characterDto.dto';
import { GetAllCharacters } from '../application/getAllCharacters.application';

  
  //NOTA: Recuerda que Session es para manejar los cookies.
  @Controller() //Recuerda que este es como un prefijo para nuestras rutas
  
  @ApiTags("Characters")
  export class CharactersController {

  
   constructor (
    private getCharacterById: GetCharacterById,
    private characterDto: CharacterDto,
    private getAllCharacters: GetAllCharacters,
   )  {}
  
   @Post()
   addCharacter(){
  
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
   suspendCharacter(@Param("id") id: string){
    
   }
  
   @Patch ("/:id")
   updateUser(){

   }

}