import { BadRequestException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { IParticipationRepository } from "src/participation/domain/ports/IParticipationRepository";

export class ParticipationRepository implements IParticipationRepository {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(): Promise<void> {
        // Implementation for create
    }

    async update(): Promise<void> {
        // Implementation for update
    }

    async delete(characterId: number, episodeId: number): Promise<void> {
        const deleteCharacter = await this.prisma.episodeCharacter.deleteMany({
            where: {
                character_id: characterId,
                episode_id: episodeId,
            },
        });

        const episode = await this.prisma.episode.findFirst({
            where: { id: episodeId },
        });

        const character = await this.prisma.character.findFirst({
            where: { id: characterId },
        });

        if (!episode) {
            throw new BadRequestException(`Episode with ID ${episodeId} not found`);
        }

        if (!character) {
            throw new BadRequestException(`Character with ID ${characterId} not found`);
        }

        if (deleteCharacter.count === 0) {
            throw new BadRequestException(`Character ${character.name} not found in episode with ID ${episode.name}`);
        }
    }
}