import { Controller, Post, Body, Res, HttpCode, Get, Query, Delete, Param, Patch, UsePipes, ValidationPipe, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { ParticipationInEpisodeDto } from 'src/episodes/application/Dtos/participationEpisodeDto.dto';
import { GetParticipationInEpisode } from '../application/getParticipationsInEpisode.application';

@Controller()
@ApiTags("Participation")
export class ParticipationController {

  constructor(
    private getParticipationsForEpisode: GetParticipationInEpisode,

  ) {
 
  }

  @Get("getParticipationsforEpisodes")
  @ApiQuery({ name: 'season', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'characterStatus', required: false, type: String })
  @ApiQuery({ name: 'episodeStatus', required: false, type: String })
  @HttpCode(200)
  async getParticipationsforEpisodes(
    @Query('season') season?: number,
    @Query('page') page?: number,
    @Query('characterStatus') characterStatus?: string,
    @Query('episodeStatus') episodeStatus?: string
  ): Promise<ParticipationInEpisodeDto[]> {
    const filters = { season, characterStatus, episodeStatus };
    return await this.getParticipationsForEpisode.getParticipation(filters, page);
  }

    @Post("addParticipation")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(201)
    async addParticipation(@Body() body, @Res() res: Response) {
    
    }

    @Patch("updateParticipation/:id")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(200)
    async updateParticipation(@Body() body, @Param("id") id: number, @Res() res: Response) {
    
    }

    @Delete("deleteCharacterFromParticipation/:id")
    @HttpCode(200)
    async deleteCharacterFromParticipation (@Param("id") id:  number, @Res() res: Response) {
   
  }
}