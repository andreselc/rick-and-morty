export interface GetAllCharactersPort {
    getAllCharacters(): Promise<string[]>;
}