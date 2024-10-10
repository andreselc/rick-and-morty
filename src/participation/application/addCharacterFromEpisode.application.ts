import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IParticipationRepository } from "../domain/ports/IParticipationRepository";
import { IRepositoryCharacter } from "src/characters/domain/ports/IRepositoryCharacter";
import { CharacterToEpisodeDto } from "./Dtos/characterToEpisodeDto.dto";
import { CharacterToEpisode } from "../domain/characterToEpisode";

export class AddCharacterFromParticipation {

    constructor(
        private readonly participationRepository: IParticipationRepository,
        private readonly characterRepository: IRepositoryCharacter ) {}

    async execute(addCharacterToEpisodeDto: CharacterToEpisodeDto): Promise<void> {
        const { characterId, episodeId, timeInit, timeFinished } = addCharacterToEpisodeDto;

        let character = await this.characterRepository.findById(characterId);
        
        if (character) {
            throw new BadRequestException(`Character with ID ${character.id} and named ${character.name} is already in database`);
        }

        const characterToEpisode = new CharacterToEpisode(characterId, episodeId, timeInit, timeFinished);
        await this.participationRepository.create(characterToEpisode);
    }
}