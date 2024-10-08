import { PrismaClient } from "@prisma/client";
import { GetAllCharactersApplication } from "src/characters/application/getAllCharacters.application";
import { IRespository } from "src/migrations/domain/IRepository";
import { GetAllCharactersAdapter } from "../adapters/getAllCharactersAdapter";


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

                let statusCharacter: any = {};

                if (charactersArray[i].status === "Alive") {
                    statusCharacter = await prisma.status.findFirst({
                        where: { name: "active" },
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
                            status_id: statusCharacter.id
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