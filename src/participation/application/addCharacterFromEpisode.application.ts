import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IParticipationRepository } from "../domain/ports/IParticipationRepository";
import { IRepositoryCharacter } from "src/characters/domain/ports/IRepositoryCharacter";
import { CharacterToEpisodeDto } from "./Dtos/characterToEpisodeDto.dto";
import { CharacterToEpisode } from "../domain/characterToEpisode";
import { ValidateDuration } from "src/episodes/domain/validateDuration";
import { EpisodesRepositoryMethods } from "src/episodes/infrastructure/Repositories/episodeRepositoryApi";
import { IRepositoryEpisode } from "src/episodes/domain/ports/IRepositoryEpisode";
import { PrismaClient } from "@prisma/client";

export class AddCharacterFromParticipation {

    constructor(
        private readonly participationRepository: IParticipationRepository,
        private readonly characterRepository: IRepositoryCharacter,
        private readonly episodeRepository: IRepositoryEpisode ) {}

    async execute(addCharacterToEpisodeDto: CharacterToEpisodeDto): Promise<void> {
        const { characterId, episodeId, timeInit, timeFinished } = addCharacterToEpisodeDto;

        let character = await this.characterRepository.findById(characterId);
        let episode = await this.episodeRepository.findById(episodeId);
        let participation = await this.participationRepository.getParticipation(character, episode);

        if (participation) {
            throw new BadRequestException(`Character ${character.name} with ID ${character.id} 
                is already in episode ${episode.name}`);
        }

        ValidateDuration.validateDuration(timeInit);
        ValidateDuration.validateDuration(timeFinished);
        ValidateDuration.validateTimeOrder(timeInit, timeFinished);

        const characterToEpisode = new CharacterToEpisode(characterId, episodeId, timeInit, timeFinished);
        await this.participationRepository.create(characterToEpisode);
    }
}