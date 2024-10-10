import { Injectable, NotFoundException } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';

@Injectable()
export class GetParticipationInEpisode {
  constructor(private prisma: MigrationService) {}

  async getParticipation(filters: { season?: number; characterStatus?: string; episodeStatus?: string }, page: number): Promise<any> {
    const { season, characterStatus, episodeStatus } = filters;
    
    const query: any = {};

    if (season) {
      query.sub_category = { name: `Season ${season}` };

      const seasonCheck = await this.prisma.sub_Category.findFirst({
        where: { name: query.sub_category.name }
      });

      if (!seasonCheck || season <= 0) {
        throw new NotFoundException('Season not found');
      }
    }

    if (characterStatus) query.characters = { some: { character: { status: { name: characterStatus } } } };
    if (episodeStatus) query.status = { name: episodeStatus };

    const limit: number = 5;

    if (!page || page <= 0) page = 1;

    const totalParticipations = await this.prisma.episode.count({ where: query });

    if (totalParticipations === 0) {
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

    const totalPages = Math.ceil(totalParticipations / limit);
    const offset = (page - 1) * limit;

    const participations = await this.prisma.episode.findMany({
      where: query,
      skip: offset,
      take: limit,
      include: {
        characters: {
          include: {
            character: {
              include: {
                status: true,
              },
            },
          },
        },
        status: true,
      },
    });

    if (!participations.length) {
      throw new NotFoundException('No participations found');
    }

    const participationDtos = participations.map(participation => ({
      name: participation.name,
      status: participation.status.name,
      characters: participation.characters.map(character => ({
        name: character.character.name,
        status: character.character.status.name,
      })),
    }));

    const baseUrl = 'http://localhost:3000/api/participations/getParticipationsforEpisodes';

    const nextPage = page < totalPages ? `${baseUrl}?page=${page + 1}` : null;
    const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}` : null;

    return {
      info: {
        count: totalParticipations,
        pages: totalPages,
        next: nextPage,
        prev: prevPage,
      },
      results: participationDtos,
    };
  }
}