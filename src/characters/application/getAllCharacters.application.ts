import { Injectable, NotFoundException } from '@nestjs/common';
import { MigrationService } from 'src/migrations/infrastructure/migrations.service';
import { CharacterDto } from './Dtos/characterDto.dto';

@Injectable()
export class GetAllCharacters {
  constructor(private prisma: MigrationService) {}

  async getCharacters(filters: { type?: string; species?: string }): Promise<CharacterDto[]> {
    const { type, species } = filters;

    const characters = await this.prisma.character.findMany({
      where: {
        ...(type && { type }),
        ...(species && { species }),
      },
    });

    const characterDtos = await Promise.all(
        characters.map(async character => {

        const currentCharacter = await this.prisma.character.findUnique({
            where: { id:character.id },
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

        let episodesArray = []
        if (episodes) {
            episodes.forEach(episode => {
                episodesArray.push(episode);
            });
        }

      const characterDto = new CharacterDto();
      characterDto.id = character.id;
      characterDto.name = character.name;
      characterDto.status = status.name;
      characterDto.species = species.name;
      characterDto.episodes = episodesArray;
      return characterDto;
    })
    );
    return characterDtos;
  }
}