import { BadRequestException} from "@nestjs/common";
import { IParticipationRepository } from "../domain/ports/IParticipationRepository";
import { IRepositoryCharacter } from "src/characters/domain/ports/IRepositoryCharacter";
import { CharacterToEpisodeDto } from "./Dtos/characterToEpisodeDto.dto";
import { CharacterToEpisode } from "../domain/characterToEpisode";
import { ValidateDuration } from "src/episodes/domain/validateDuration";
import { IRepositoryEpisode } from "src/episodes/domain/ports/IRepositoryEpisode";

export class AddCharacterFromParticipation {

    constructor(
        private readonly participationRepository: IParticipationRepository,
        private readonly characterRepository: IRepositoryCharacter,
        private readonly episodeRepository: IRepositoryEpisode ) {}

    async execute(addCharacterToEpisodeDto: CharacterToEpisodeDto): Promise<void> {
        const { characterId, episodeId, timeInit, timeFinished } = addCharacterToEpisodeDto;

        ValidateDuration.validateTimeOrder(timeInit, timeFinished);
        ValidateDuration.validateDurationInCharactersParticipation(timeInit);
        ValidateDuration.validateDurationInCharactersParticipation(timeFinished);

        let character = await this.characterRepository.findById(characterId);
        let episode = await this.episodeRepository.findById(episodeId);

        if (timeInit>episode.duration || timeFinished>episode.duration){
            throw new BadRequestException(`timeInit and/or timeFinished must be lower than total episode's duration`);
        }
            
        let participation = await this.participationRepository.getParticipation(character, episode);

        if (participation && (timeInit < participation.timeFinished && timeFinished > participation.timeInit)) {
            throw new BadRequestException(
                `Character ${character.name} with ID ${character.id} is already in episode ${episode.name},\n` +
                `and between ${participation.timeInit} and ${participation.timeFinished}`
            );
        }


        const characterToEpisode = new CharacterToEpisode(characterId, episodeId, timeInit, timeFinished);
        await this.participationRepository.create(characterToEpisode);
    }
}