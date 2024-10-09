import { CharacterDto } from "src/characters/application/Dtos/characterDto.dto";
import { CreateCharacterDto } from "src/characters/application/Dtos/createCharacter.dto";
import { UpdateCharacterDto } from "src/characters/application/Dtos/updateCharacter.dtos";

export interface IRepositoryCharacter  { 
    create(character: CreateCharacterDto): Promise<CharacterDto>;
    update(character: UpdateCharacterDto): void;
    findById(id: number): Promise<CharacterDto>;
}