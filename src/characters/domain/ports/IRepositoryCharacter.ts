import { CharacterDto } from "src/characters/application/Dtos/characterDto.dto";
import { UpdateCharacterDto } from "src/characters/application/Dtos/updateCharacter.dtos";

export interface IRepositoryCharacter  { 
    create(): void;
    update(character: UpdateCharacterDto): void;
    findById(id: number): Promise<CharacterDto>;
}