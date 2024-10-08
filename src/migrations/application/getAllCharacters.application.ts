import { GetAllCharactersPort } from "../domain/ports/getAllCharactersPort";

export class GetAllCharactersApplication implements GetAllCharactersPort {
    adapter: GetAllCharactersPort;
    characters: string[]

    constructor(adapter: GetAllCharactersPort) {
        this.adapter = adapter;
    }

    async getAllCharacters(): Promise<any[]> {
        this.characters = await this.adapter.getAllCharacters();
        return this.characters   
    }

}