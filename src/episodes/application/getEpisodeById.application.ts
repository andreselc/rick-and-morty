import { Injectable, NotFoundException } from '@nestjs/common';
import { EpisodesRepositoryMethods } from '../infrastructure/Repositories/episodeRepositoryApi';
import { EpisodeDto } from './Dtos/episodeDto.dto';
import { IRepositoryEpisode } from '../domain/ports/IRepositoryEpisode';

export class GetEpisodeById {

  async execute(episodeId: number, repository: IRepositoryEpisode): Promise<EpisodeDto> {
    const episode = await repository.findById(episodeId);

    if (!episode) {
      throw new NotFoundException(`Episode with ID ${episodeId} not found`);
    }

    return episode;
  }
}