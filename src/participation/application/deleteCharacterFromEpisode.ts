import { Injectable, NotFoundException } from "@nestjs/common";
import { IParticipationRepository } from "../domain/ports/IParticipationRepository";
import { IRepositoryCharacter } from "src/characters/domain/ports/IRepositoryCharacter";

export class DeleteCharacterFromParticipation {

    constructor(
        private readonly participationRepository: IParticipationRepository,
        private readonly characterRepository: IRepositoryCharacter ) {}

    async execute(characterId: number, episodeId: number): Promise<void> {
        let character = await this.characterRepository.findById(characterId);

        if (!character) {
            throw new NotFoundException(`Character with ID ${characterId} not found`);
        }

        await this.participationRepository.delete(characterId, episodeId);
    }
}