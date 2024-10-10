export interface IParticipationRepository  { 
    create(): void;
    update(): void;
    delete(characterId: number, episodeId: number): Promise<void>;
}