import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { EpisodeDto } from './Dtos/episodeDto.dto';

@Injectable()
export class GetAllEpisodes {
  constructor(private prisma: MigrationService) {}

  async getEpisodes(filters: { season?: number; }, page: number): Promise<any> {
    let { season } = filters;
    const limit: number = 5;

    // Si la temporada no está definida o es menor que 1, no filtrar por temporada
    let where = {};
    if (season && season >= 1) {
      let seasonSubcategory = `Season ${season}`;

      const checkSeason = await this.prisma.sub_Category.findFirst({
        where: { name: seasonSubcategory },
      });

      if (!checkSeason) {
        throw new NotFoundException('Season not found');
      }

      where = {
        sub_category_id: checkSeason.id,
      };
    }

    const totalEpisodes = await this.prisma.episode.count({ where });

    if (totalEpisodes === 0) {
      return {
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      };
    }

    const totalPages = Math.ceil(totalEpisodes / limit);
    let offset = (page - 1) * limit;

    if (!offset || offset <= 0) {
      offset = 0;
    }

    if (!page || page <= 0) {
      page = 1;
    }

    const episodes = await this.prisma.episode.findMany({
      where,
      skip: offset,
      take: limit,
    });

    const episodeDtos = await Promise.all(
      episodes.map(async episodeValidation => {
        const currentEpisode = await this.prisma.episode.findUnique({
          where: { id: episodeValidation.id },
        });

        if (!currentEpisode) {
          throw new NotFoundException('Episode not found');
        }

        const status = await this.prisma.status.findUnique({
          where: { id: currentEpisode.status_id },
        });

        const seasons = await this.prisma.sub_Category.findUnique({
          where: { id: currentEpisode.sub_category_id },
        });
          const seasonNumberMatch = seasons.name.match(/Season (\d+)/);
          let seasonNumber: number;
        if (seasons && seasons.name) {
          seasonNumber = seasonNumberMatch ? Number(seasonNumberMatch[1]) : null;
        
          if (seasonNumber !== null) {
          
          } else {
            throw new BadRequestException('No se pudo extraer el número de la temporada');
          }
        } else {
          throw new BadRequestException('No se encontró la temporada o el nombre de la temporada es inválido');
        }

        const characters = await this.prisma.episodeCharacter.findMany({
          where: { episode_id: currentEpisode.id },
        });

        let charactersArray: string[] = [];

        if (characters) {
          for (let i = 0; i < characters.length; i++) {
            const character = await this.prisma.character.findUnique({
              where: { id: characters[i].character_id },
            });
            charactersArray.push(character.name);
          }
        }

        const episodeDto = new EpisodeDto();
        episodeDto.id = episodeValidation.id;
        episodeDto.name = episodeValidation.name;
        episodeDto.status = status.name;
        episodeDto.season = seasonNumber;
        episodeDto.characters = charactersArray;
        return episodeDto;
      })
    );

    const baseUrl = 'http://localhost:3000/api/episodes/getAllEpisodes';

    const nextPage = page < totalPages ? `${baseUrl}?page=${page + 1}` : null;
    const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}` : null;

    return {
      info: {
        count: totalEpisodes,
        pages: totalPages,
        next: nextPage,
        prev: prevPage,
      },
      results: episodeDtos,
    };
  }
}