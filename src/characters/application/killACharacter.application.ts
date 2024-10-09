import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CharacterRepository } from "../infrastructure/Repositories/characterAPIRepository";
import { IRepositoryCharacter } from "../domain/ports/IRepositoryCharacter";
import { UpdateCharacterDto } from "./Dtos/updateCharacter.dtos";

export class KillACharacter {

    constructor(
        private readonly characterRepository: IRepositoryCharacter) {}

    async execute(characterId: number): Promise<void> {
        let character = await this.characterRepository.findById(characterId);
        let updateCharacter = new UpdateCharacterDto();

        if (!character) {
            throw new NotFoundException(`Character with ID ${characterId} not found`);
        }

        character.status = 'suspended';

        await this.characterRepository.update(characterId, character);
    }
}