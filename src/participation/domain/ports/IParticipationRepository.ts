import { CharacterDto } from "src/characters/application/Dtos/characterDto.dto";
import { CharacterToEpisode } from "../characterToEpisode";
import { EpisodeDto } from "src/episodes/application/Dtos/episodeDto.dto";
import { ParticipationToUpdate } from "../participationToUpdate";

export interface IParticipationRepository  { 
    create(characterToEpisode: CharacterToEpisode): void;
    update(participation : ParticipationToUpdate): void;
    getParticipation(character: CharacterDto, episode: EpisodeDto): Promise<CharacterToEpisode>;
    delete(characterId: number, episodeId: number): Promise<void>;
}