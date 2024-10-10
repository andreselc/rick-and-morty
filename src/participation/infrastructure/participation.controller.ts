import { Controller, Post, Body, Res, HttpCode, Get, Query, Delete, Param, Patch, UsePipes, ValidationPipe, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { ParticipationInEpisodeDto } from 'src/episodes/application/Dtos/participationEpisodeDto.dto';
import { GetParticipationInEpisode } from '../application/getParticipationsInEpisode.application';
import { DeleteCharacterFromParticipation } from './../application/deleteCharacterFromEpisode.application';
import { ParticipationRepository } from './Repository/participationRepository';
import { CharacterRepository } from 'src/characters/infrastructure/Repositories/characterAPIRepository';
import { CharacterRepositoryMethods } from 'src/characters/infrastructure/Repositories/characterRepositoryMethods';
import { CharacterToEpisodeDto } from '../application/Dtos/characterToEpisodeDto.dto';
import { AddCharacterFromParticipation } from '../application/addCharacterFromEpisode.application';
import { EpisodesRepositoryMethods } from 'src/episodes/infrastructure/Repositories/episodeRepositoryApi';
import { UpdateCharacterFromEpisode } from '../application/updateCharacterFromEpisode.application';
import { UpdateCharacterToEpisodeDto } from '../application/Dtos/updateParticipationDto.dto';

@Controller()
@ApiTags("Participation")
export class ParticipationController {

  constructor(
    private getParticipationsForEpisode: GetParticipationInEpisode,
    private deleteCharacterFromEpisode: DeleteCharacterFromParticipation,
    private participationRepository: ParticipationRepository,
    private characterRepository: CharacterRepositoryMethods,
    private addCharacterFromEpisode: AddCharacterFromParticipation,
    private episodeRepository: EpisodesRepositoryMethods,
    private updateCharacterFromEpisode: UpdateCharacterFromEpisode,

  ) {
    this.participationRepository = new ParticipationRepository();
    this.characterRepository = new CharacterRepositoryMethods();
    this.deleteCharacterFromEpisode = new DeleteCharacterFromParticipation(this.participationRepository, this.characterRepository);
    this.episodeRepository = new EpisodesRepositoryMethods();
    this.addCharacterFromEpisode = new AddCharacterFromParticipation(this.participationRepository,this.characterRepository,this.episodeRepository);
    this.updateCharacterFromEpisode = new UpdateCharacterFromEpisode(this.participationRepository,this.characterRepository,this.episodeRepository);

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
    async addParticipation(@Body() characterToEpisodeDto: CharacterToEpisodeDto,@Res() res: Response) {
    try {
      await this.addCharacterFromEpisode.execute(characterToEpisodeDto);
      return res.status(201).json({
        statusCode: 201,
        message: `Character with ID ${characterToEpisodeDto.characterId} has been added \n 
        to episode with ID ${characterToEpisodeDto.episodeId} \n
        from ${characterToEpisodeDto.timeInit} to ${characterToEpisodeDto.timeFinished}`,
      });
    } catch (error) {
        throw new BadRequestException(error.message);
    }
  }

  @Patch("updateParticipation/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async updateParticipation(
      @Param("id") id: number,
      @Body() updateParticipationDto: UpdateCharacterToEpisodeDto,
      @Res() res: Response
  ) {
      try {
          updateParticipationDto.timeId= id;
          await this.updateCharacterFromEpisode.execute(updateParticipationDto);
          return res.status(200).json({
              statusCode: 200,
              message: `Participation with ID ${id} has been updated.`,
          });
      } catch (error) {
          throw new BadRequestException(error.message);
      }
  }


    @Delete("deleteCharacterFromParticipation/:characterId/:episodeId")
    @HttpCode(200)
    async deleteCharacterFromParticipation (
      @Param("characterId") characterId: number,
      @Param("episodeId") episodeId: number,
      @Res() res: Response
    ) {
      if (typeof characterId !== 'number' || characterId < 1 || characterId > 2147483647) {
        throw new BadRequestException(`Invalid character ID: ${characterId}`);
      }
      if (typeof episodeId !== 'number' || episodeId < 1 || episodeId > 2147483647) {
        throw new BadRequestException(`Invalid episode ID: ${episodeId}`);
      }
      try {
        await this.deleteCharacterFromEpisode.execute(characterId, episodeId);
        return res.status(200).json({
          statusCode: 200,
          message: `Character with ID ${characterId} has been eliminated from episode with ID ${episodeId}`,
        });
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException(`Character with ID ${characterId} not found`);
        }
        throw error;
      }
    }
}