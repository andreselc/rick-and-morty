import { Injectable, NotFoundException } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { CharacterDto } from './Dtos/characterDto.dto';

@Injectable()
export class GetAllCharacters {
  constructor(private prisma: MigrationService) {}

  async getCharacters(filters: { type?: string; species?: string }, page: number = 1, limit: number = 5): Promise<any> {
    const { type, species } = filters;

    const where = {
      ...(type && { type }),
      ...(species && { species }),
    };

    const totalCharacters = await this.prisma.character.count({ where });
    const totalPages = Math.ceil(totalCharacters / limit);
    const offset = (page - 1) * limit;

    const characters = await this.prisma.character.findMany();

    const characterDtos = await Promise.all(
      characters.map(async character => {
        const currentCharacter = await this.prisma.character.findUnique({
          where: { id: character.id },
        });

        if (!currentCharacter) {
          throw new NotFoundException('Character not found');
        }

        const status = await this.prisma.status.findUnique({
          where: { id: currentCharacter.status_id },
        });

        const species = await this.prisma.sub_Category.findUnique({
          where: { id: currentCharacter.sub_category_id },
        });

        const episodes = await this.prisma.episodeCharacter.findMany({
          where: { character_id: currentCharacter.id },
        });

        let episodesArray: string[] = [];

        if (episodes) {
          episodes.forEach(async episode => {

            const episodeName = await this.prisma.episode.findFirst({
                where: { id: episode.episode_id },
              });

            episodesArray.push(episodeName.name);
          });
        }

        const characterDto = new CharacterDto();
        characterDto.id = character.id;
        characterDto.name = character.name;
        characterDto.type = character.type;
        characterDto.status = status.name;
        characterDto.species = species.name;
        characterDto.episodes = episodesArray;
        return characterDto;
      })
    );

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      info: {
        count: totalCharacters,
        pages: totalPages,
        next: nextPage ? `https://rickandmortyapi.com/api/character/?page=${nextPage}&type=${type}&species=${species}` : null,
        prev: prevPage ? `https://rickandmortyapi.com/api/character/?page=${prevPage}&type=${type}&species=${species}` : null,
      },
      results: characterDtos,
    };
  }
}