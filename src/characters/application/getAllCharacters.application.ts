import { Injectable, NotFoundException } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { CharacterDto } from './Dtos/characterDto.dto';

@Injectable()
export class GetAllCharacters {
  constructor(private prisma: MigrationService) {}

  async getCharacters(filters: { type?: string; species?: string }, page: number): Promise<any> {
    const { type, species } = filters;
    const limit: number = 5

    const checkSpecies = await this.prisma.sub_Category.findFirst({
        where: { name: species },
    });
    
    if(!checkSpecies){
        throw new NotFoundException('Species not found');
    }

    const where = {
      ...(type && { type }),
      ...(species && { sub_category_id: checkSpecies.id }),
    };

    const totalCharacters = await this.prisma.character.count({ where });

    if (totalCharacters === 0) {
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

    const totalPages = Math.ceil(totalCharacters / limit);
    let offset = (page - 1) * limit;

    if (!offset || offset<=0) {
        offset=1;
    }

    const characters = await this.prisma.character.findMany({
      where,
      skip: offset,
      take: limit,
    });

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
      },
      results: characterDtos,
    };
  }
}