import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CharacterDto } from "src/characters/application/Dtos/characterDto.dto";
import { CreateCharacterDto } from "src/characters/application/Dtos/createCharacter.dto";
import { UpdateCharacterDto } from "src/characters/application/Dtos/updateCharacter.dtos";
import { IRepositoryCharacter } from "src/characters/domain/ports/IRepositoryCharacter";

export class CharacterRepositoryMethods implements IRepositoryCharacter {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(key: number ,character: CreateCharacterDto): Promise<CharacterDto> {
        const value = this.findById(key);

        if((await value).id === -1){
            const species = await this.prisma.sub_Category.findFirst({
                where: { name: character.species },
            });
            const characterCondtion = await this.prisma.character.findFirst({
                where: { type: character.type, 
                        name: character.name,
                        sub_category_id: species.id
                },
            });

            if (!characterCondtion) {
                const status = await this.prisma.status.findFirst({
                    where: { name: character.status },
                });
                const newCharacter = await this.prisma.character.create({
                    data: {
                        name: character.name,
                        type: character.type,
                        status_id: status.id,
                        sub_category_id: species.id,
                    },
                
                });
                let characterOutput = new CharacterDto();
                characterOutput.name = newCharacter.name;
                characterOutput.type = newCharacter.type;
                characterOutput.status = status.name;
                characterOutput.species = species.name;

                return characterOutput;

            }
            else {
                throw new BadRequestException("There is already one character with the same name, species and type.");
            }
        }
        else {
            throw new BadRequestException("Character already exists.");
        }
    }

    async update(id_character: number, updateData: UpdateCharacterDto): Promise<void> {
        
        const existingCharacter = await this.prisma.character.findUnique({
            where: { id: id_character },
        });

        if (!existingCharacter) {
            throw new NotFoundException("Character not found.");
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

        if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
            return {
                id: -1,
                name: "Character not found",
                type: "Character not found",
                status: "Character not found",
                species: "Character not found",
                episodes: [],
            };
        }
        const character = await this.prisma.character.findUnique({
            where: { id },
        });

        if (!character) { 
            return {
                id: -1,
                name: "Character not found",
                type: "Character not found",
                status: "Character not found",
                species: "Character not found",
                episodes: [],
            };
        }

        const status = await this.prisma.status.findUnique({
            where: { id: character.status_id },
        });

        //hallar todos los episodios de un personaje
        const episodes = await this.prisma.episodeCharacter.findMany({
            where: { character_id: character.id },
        });

        let episodiosArray: string[] = [];

        for(let i = 0; i < episodes.length; i++) {
            const episode = await this.prisma.episode.findUnique({
                where: { id: episodes[i].episode_id },
            });
            episodiosArray.push(episode.name);
        }

        const characterDto = new CharacterDto();
        characterDto.id = character.id;
        characterDto.name = character.name;
        characterDto.type = character.type;
        characterDto.episodes = episodiosArray;
        characterDto.status = status.name;

        return characterDto;
    }
}