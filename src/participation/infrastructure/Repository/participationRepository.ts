import { BadRequestException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CharacterDto } from "src/characters/application/Dtos/characterDto.dto";
import { EpisodeDto } from "src/episodes/application/Dtos/episodeDto.dto";
import { CharacterToEpisode } from "src/participation/domain/characterToEpisode";
import { ParticipationToUpdate } from "src/participation/domain/participationToUpdate";
import { IParticipationRepository } from "src/participation/domain/ports/IParticipationRepository";

export class ParticipationRepository implements IParticipationRepository {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(characterToEpisode: CharacterToEpisode): Promise<void> {
        const { characterId, episodeId, timeInit, timeFinished } = characterToEpisode;

        const overlappingParticipation = await this.prisma.episodeCharacter.findFirst({
            where: {
                character_id: characterId,
                episode_id: episodeId,
                OR: [
                    {
                        time_init: {
                            lte: timeFinished,
                        },
                        time_finished: {
                            gte: timeInit,
                        },
                    },
                ],
            },
        });

        if (overlappingParticipation) {
            throw new BadRequestException(`Character with ID ${characterId} already appears in episode with ID ${episodeId} during the specified time.`);
        }

        await this.prisma.episodeCharacter.create({
            data: {
                character_id: characterId,
                episode_id: episodeId,
                time_init: timeInit,
                time_finished: timeFinished,
            },
        });
    }

    async update(participationToUpdate: ParticipationToUpdate): Promise<void> {

    const participation = await this.prisma.episodeCharacter.findFirst({ 
        where: { id_time: participationToUpdate.participationId }
    });

        if (!participation) {
            throw new BadRequestException(`Participation with ID ${participation.id_time} not found`);
        }

        await this.prisma.episodeCharacter.update({
            where: { episode_id_character_id_id_time: 
                    {   id_time: participation.id_time, 
                        episode_id: participation.episode_id, 
                        character_id: participation.character_id } },
            data: {
                time_init: participationToUpdate.timeInit,
                time_finished: participationToUpdate.timeFinished,
            },
        });
    }

    async getParticipation(character: CharacterDto, episode: EpisodeDto): Promise<CharacterToEpisode> {
        const characterInEpisode = await this.prisma.episodeCharacter.findFirst({
            where : { 
                episode_id: episode.id,
                character_id: character.id
            }
        });

        if (!characterInEpisode) {
            return null;
        }

        return {
            characterId: characterInEpisode.character_id,
            episodeId: characterInEpisode.episode_id,
            timeInit: characterInEpisode.time_init,
            timeFinished: characterInEpisode.time_finished,
        } as CharacterToEpisode;
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