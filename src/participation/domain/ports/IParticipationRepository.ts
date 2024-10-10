import { CharacterToEpisode } from "../characterToEpisode";

export interface IParticipationRepository  { 
    create(characterToEpisode: CharacterToEpisode): void;
    update(): void;
    delete(characterId: number, episodeId: number): Promise<void>;
}