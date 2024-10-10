export class CharacterToEpisode {
    characterId: number;
    episodeId: number;
    timeInit: string;
    timeFinished: string;
  
    constructor(characterId: number, episodeId: number, timeInit: string, timeFinished: string) {
      this.characterId = characterId;
      this.episodeId = episodeId;
      this.timeInit = timeInit;
      this.timeFinished = timeFinished;
    }
  }