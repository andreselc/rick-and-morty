import { Injectable, BadRequestException } from '@nestjs/common';
import { IParticipationRepository } from 'src/participation/domain/ports/IParticipationRepository';
import { UpdateCharacterToEpisodeDto } from './Dtos/updateParticipationDto.dto';
import { IRepositoryCharacter } from 'src/characters/domain/ports/IRepositoryCharacter';
import { IRepositoryEpisode } from 'src/episodes/domain/ports/IRepositoryEpisode';
import { ParticipationToUpdate } from '../domain/participationToUpdate';
import { PrismaClient } from '@prisma/client';


export class UpdateCharacterFromEpisode {
    constructor(
        private readonly participationRepository: IParticipationRepository,
        private readonly characterRepository: IRepositoryCharacter,
        private readonly episodeRepository: IRepositoryEpisode
    ) {}

    async execute(updateParticipationDto: UpdateCharacterToEpisodeDto): Promise<void> {
        const { timeId, timeInit, timeFinished } = updateParticipationDto;

        const prisma = new PrismaClient();
        const participation = await prisma.episodeCharacter.findFirst({
            where: { id_time: timeId }
        });

        if (!participation) {
            throw new BadRequestException(`Participation with ID ${timeId} not found`);
        }

        const character = await this.characterRepository.findById(participation.character_id);
        const episode = await this.episodeRepository.findById(participation.episode_id);

        if (timeInit > episode.duration || timeFinished > episode.duration) {
            throw new BadRequestException(`timeInit and/or timeFinished must be lower than total episode's duration`);
        }

        const overlappingParticipation = await this.participationRepository.getParticipation(character, episode);
        if (overlappingParticipation && (timeInit < overlappingParticipation.timeFinished && timeFinished > overlappingParticipation.timeInit)) {
            throw new BadRequestException(
                `Character ${character.name} with ID ${character.id} is already in episode ${episode.name}, ` +
                `specifically between ${overlappingParticipation.timeInit} and ${overlappingParticipation.timeFinished}`
            );
        }

        const participationsToUpdate = new ParticipationToUpdate(timeId, timeInit, timeFinished);
        await this.participationRepository.update(participationsToUpdate);
    }
}