import axios from 'axios';
import { GetAllCharactersPort } from 'src/characters/domain/ports/getAllCharactersPort';

export class GetAllCharactersAdapter implements GetAllCharactersPort {


    async getAllCharacters(): Promise<any[]> {
        let characters: any[] = [];
        let nextUrl = 'https://rickandmortyapi.com/api/character';

        while (nextUrl) {
            const response = await axios.get(nextUrl);
            characters = characters.concat(response.data.results);
            nextUrl = response.data.info.next;
        }

        return characters;
    }
}