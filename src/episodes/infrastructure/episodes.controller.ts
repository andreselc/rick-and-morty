import { Controller, Post, Body, Res, HttpCode, Get, Query, Delete, Param, Patch, UsePipes, ValidationPipe, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';


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
  async addEpisode(@Body() body, @Res() res: Response) {
    
  }

  @Patch("updateEpisode/:id")
  @UsePipes(new ValidationPipe ({ transform: true}))
  @HttpCode(200)
  async updatePartiallyAnEpisode(@Body() body, @Param("id") id: number,@Res() res: Response) {
     
  }


  @Delete("cancelEpisode/:id")
  @HttpCode(200)
  async cancelAnEpisode(@Param("id") id:  number, @Res() res: Response) {
   
  }
}