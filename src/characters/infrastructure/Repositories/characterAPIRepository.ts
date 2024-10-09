import { PrismaClient } from "@prisma/client";
import { GetAllCharactersApplication } from "src/characters/application/getAllCharactersForMigration.application";
import { IRespository } from "src/migrations/domain/IRepository";
import { GetAllCharactersAdapter } from "../adapters/getAllCharactersAdapter";
import { Injectable } from "@nestjs/common";

export class CharacterRepository implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {

        //Inserción de Personajes
        //Primero, se verifica si hay personajes en base de datos
        const characterCount = await prisma.character.count();
        if (characterCount === 0) {
            const charactersService = new GetAllCharactersApplication(new GetAllCharactersAdapter());
            let charactersArray: any[] = await charactersService.getAllCharacters();
            for (let i = 0; i < charactersArray.length; i++) {
                const characterSpecie = await prisma.sub_Category.findFirst({
                    where: { name : charactersArray[i].species},
                });

                const statusType =  await prisma.status_Types.findFirst({
                    where: { name_type : "characters"},
                });

                let statusCharacter: any = {};

                if (charactersArray[i].status === "Alive") {
                    statusCharacter = await prisma.status.findFirst({
                        where: { name: "active",
                                status_type_id: statusType.id
                        },
                    });
                } else if (charactersArray[i].status === "Dead" || charactersArray[i].status === "unknown") {
                    statusCharacter = await prisma.status.findFirst({
                        where: { name: "suspended" },
                    });
                }

                if (characterSpecie && statusCharacter) {
                    await prisma.character.create({
                        data: {
                            name: charactersArray[i].name,
                            sub_category_id: characterSpecie.id,
                            status_id: statusCharacter.id,
                            type: charactersArray[i].type
                        },
                    });
                }  
                else {
                    console.log ("error al insertar en Personajes");
                }
            }
        }      
    }

}