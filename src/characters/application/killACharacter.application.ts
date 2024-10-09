import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CharacterRepository } from "../infrastructure/Repositories/characterAPIRepository";
import { IRepositoryCharacter } from "../domain/ports/IRepositoryCharacter";

export class KillACharacter {

    constructor(
        private readonly characterRepository: IRepositoryCharacter) {}

    async execute(characterId: number): Promise<void> {
        let character = await this.characterRepository.findById(characterId);

        console.log("Primer personaje: ", character);

        if (!character) {
            throw new NotFoundException(`Character with ID ${characterId} not found`);
        }

        character.status = 'suspended';

        console.log("Segundo personaje: ", character);
        
        await this.characterRepository.update(character);
    }
}