import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CharacterDto } from "src/characters/application/Dtos/characterDto.dto";
import { UpdateCharacterDto } from "src/characters/application/Dtos/updateCharacter.dtos";
import { IRepositoryCharacter } from "src/characters/domain/ports/IRepositoryCharacter";

export class CharacterRepositoryMethods implements IRepositoryCharacter {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    create(): void {
        throw new Error("Method not implemented.");
    }

    async update(updateData: UpdateCharacterDto): Promise<void> {
        
        const existingCharacter = await this.prisma.character.findUnique({
            where: { id: updateData.id },
        });

        if (!existingCharacter) {
            throw new Error("Character not found.");
        }

        if (updateData.name)
        existingCharacter.name = updateData.name;
        if(updateData.type)
        existingCharacter.type = updateData.type;
        if(updateData.status){
            const status = await this.prisma.status.findFirst({
                where: { name: updateData.status },
            });
        existingCharacter.status_id = status.id;
        }

        if(updateData.species){
            const species = await this.prisma.sub_Category.findFirst({
                where: { name: updateData.species },
            });
        existingCharacter.sub_category_id = species.id;
        }

        await this.prisma.character.update({
            where: { id: existingCharacter.id },
            data: existingCharacter,
        });
}

    async findById(id: number): Promise<CharacterDto> {
        const character = await this.prisma.character.findUnique({
            where: { id },
        });

        if (!character) {
            throw new NotFoundException('Character not found');
        }

        const status = await this.prisma.status.findUnique({
            where: { id: character.status_id },
        });

        const characterDto = new CharacterDto();
        characterDto.id = character.id;
        characterDto.name = character.name;
        characterDto.type = character.type;
        characterDto.status = status.name;

        return characterDto;
    }
}