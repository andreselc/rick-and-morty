import { Controller, Post, Body, Res, HttpCode, Get, Query, Delete, Param, Patch, UsePipes, ValidationPipe, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GetAllCharacters } from './../../characters/application/getAllCharacters.application';
import { KillACharacter } from './../../characters/application/killACharacter.application';
import { CharacterRepositoryMethods } from '../../characters/infrastructure/Repositories/characterRepositoryMethods';
import { CreateCharacterDto } from './../../characters/application/Dtos/createCharacter.dto';
import { CharacterDto } from './../../characters/application/Dtos/characterDto.dto';

@Controller()
@ApiTags("Episodes")
export class EpisodesController {

  constructor(
    
  ) {
    
  }

  @Get("getAllEpisodes")
   @ApiQuery({ name: 'season', required: false, type: Number })
   @ApiQuery({ name: 'page', required: false, type: Number })
   @HttpCode(200)
   findAllEpisodes(
    @Query('season') species?: string,
    @Query('page') page: number = 1,
   )  {
    //return this.getAllEpisodes.getCharacters({ type, species }, page );
  }

  @Post("addEpisode")
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(201)
  async addEpisode(@Body() body: CreateCharacterDto, @Res() res: Response) {
    
  }

  @Patch("updatePartially/:id")
  @UsePipes(new ValidationPipe ({ transform: true}))
  @HttpCode(200)
  async updatePartiallyAnEpisode(@Body() body: UpdateCharacterDto, @Param("id") id: number,@Res() res: Response) {
     
  }


  @Delete("suspendCharacter/:id")
  @HttpCode(200)
  async cancelAnEpisode(@Param("id") id: number, @Res() res: Response) {
   
  }
}