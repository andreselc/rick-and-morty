import { Body, 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Param, 
    Query, 
    Delete,
    NotFoundException, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCharacterById } from '../application/getCharacterById.application';
import { CreateCharacterDto } from '../application/Dtos/createCharacter.dto';
import { CharacterDto } from '../application/Dtos/characterDto.dto';

  
  //NOTA: Recuerda que Session es para manejar los cookies.
  @Controller() //Recuerda que este es como un prefijo para nuestras rutas
  
  @ApiTags("Characters")
  export class CharactersController {

  
   constructor (
    private getCharacterById: GetCharacterById,
    private characterDto: CharacterDto
   )  {}
  
   @Post()
   addCharacter(){
  
   }
  
   @Get("findCharacterById/:id")
   async findCharacterById(@Param("id") id: number, @Query() query: any) : Promise<CharacterDto>{
    try {
      return await this.getCharacterById.findOne(id, this.characterDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
   }
  
   @Get()
   findAllCharacters(){

   }
  
   @Delete("/:id")
   removeUser(@Param("id") id: string){
   }
  
   @Patch ("/:id")
   updateUser(){

   }

}