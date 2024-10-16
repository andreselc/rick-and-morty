import { Controller, Post, Body, Res, HttpCode, Get, Query, Delete, Param, Patch, UsePipes, ValidationPipe, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GetAllEpisodes } from '../application/getAllEpisodes.application';
import { EpisodeDto, } from '../application/Dtos/episodeDto.dto';
import { CancellAnEpisode } from '../application/cancellAnEpisode.application';
import { EpisodesRepositoryMethods } from './Repositories/episodeRepositoryApi';
import { UpdateEpisodeDto } from '../application/Dtos/updateEpisode.dto';
import { CreateEpisodeDto } from '../application/Dtos/createepisode.dto';
import { ValidateDuration } from '../domain/validateDuration';


@Controller()
@ApiTags("Episodes")
export class EpisodesController {

  constructor(
    private getAllEpisodes: GetAllEpisodes,
    private cancellAnEpisode: CancellAnEpisode,
    private episodesRepository: EpisodesRepositoryMethods,
  ) {
    this.episodesRepository = new EpisodesRepositoryMethods();
    this.cancellAnEpisode = new CancellAnEpisode(this.episodesRepository);
  }

  @Get("getAllEpisodes")
   @ApiQuery({ name: 'season', required: false, type: Number })
   @ApiQuery({ name: 'page', required: false, type: Number })
   @HttpCode(200)
   findAllEpisodes(
    @Query('season') season?: number,
    @Query('page') page: number = 1,
   ) :Promise<EpisodeDto[]> {
    return this.getAllEpisodes.getEpisodes({ season }, page );
  }

  @Post("addEpisode")
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(201)
  async addEpisode(@Body() body: CreateEpisodeDto, @Res() res: Response) {
    try {
      const prisma = new PrismaClient();

      const seasonName = `Season ${body.season}`;
  
      const seasonValidation = await prisma.sub_Category.findFirst({
        where: { name: seasonName },
      });
  
      if (!seasonValidation) {
        throw new NotFoundException('Season not found');
      }
  
      const episodeValidation = await prisma.episode.findFirst({
        where: { name: body.name, sub_category_id: seasonValidation.id },
      });
  
      if (episodeValidation) {
        throw new BadRequestException('Episode name already exists in this season');
      }

      const episode = await this.episodesRepository.create(seasonValidation.id,body);;
  
      return res.status(201).json({
        statusCode: 201,
        message: 'Episode created successfully',
        data: episode,
      });
    } catch (error) {
      throw new BadRequestException(`Something went wrong: ${error.message}`);
    }
  }

  @Patch("updateEpisode/:id")
@UsePipes(new ValidationPipe({ transform: true }))
@HttpCode(200)
async updatePartiallyAnEpisode(@Body() body: UpdateEpisodeDto, @Param("id") id: number, @Res() res: Response) {
  try {
    const prisma = new PrismaClient();
    const episode = await prisma.episode.findUnique({ where: { id } });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    if (body.duration) {
      ValidateDuration.validateDuration(body.duration);
    }

    if (body.status) {
      const statusValidation = await prisma.status.findFirst({
        where: { name: body.status },
      });

      if (!statusValidation) {
        throw new NotFoundException('Status not found');
      }
    }

    if (body.name) {
      const nameValidation = await prisma.episode.findFirst({
        where: { name: body.name, id: { not: id } },
      });

      if (nameValidation) {
        throw new BadRequestException('Episode name already exists');
      }
    }

    await this.episodesRepository.update(id, body);
    return res.status(200).json({
      statusCode: 200,
      message: 'Episode updated successfully',
      data: body,
    });
  } catch (error) {
    throw new BadRequestException(`Something went wrong: ${error.message}`);
  }
}

  @Delete("cancelEpisode/:id")
  @HttpCode(200)
  async cancelAnEpisode(@Param("id") id:  number, @Res() res: Response) {
    if (typeof id !== 'number' || id < 1 || id > 2147483647) {
      throw new BadRequestException(`Invalid ID: ${id}`);
    }
    try {
      await this.cancellAnEpisode.execute(id);
      return res.status(200).json({
        statusCode: 200,
        message: `Episode with ID ${id} has been cancelled`,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Character with ID ${id} not found`);
      }
      throw error;
    }
  }
}