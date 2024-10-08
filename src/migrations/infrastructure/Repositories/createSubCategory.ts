import { IRespository } from "src/migrations/domain/IRepository";
import { PrismaClient } from "@prisma/client";
import axios from 'axios';
import { GetAllCharactersAdapter } from "../../../characters/infrastructure/adapters/getAllCharactersAdapter";
import { GetAllCharactersApplication } from "src/characters/application/getAllCharacters.application";
import { SaveAllSeasonsAdapter } from "src/episodes/infrastructure/adapters/saveAllSeasonsAdapter";
import { SaveAllSeasonsApplication } from "src/episodes/application/saveAllSeasons.application";


export class createSubCategory implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {
        
        //Agregar temporadas
        const episodesCount = await prisma.character.count();
        if (episodesCount === 0) {
            const episodesService = new SaveAllSeasonsApplication(new SaveAllSeasonsAdapter(prisma));
            await episodesService.saveAllSeasons();      
                
        }

        //Primero se verifica si ya hay datos dentro de la tabla subcategoria
        const subCategoryCount = await prisma.sub_Category.count();

        //Se obtiene el atributo para sacar su ID.
        if (subCategoryCount === 0) {
            const speciesCharacter = await prisma.category.findFirst({
                where: { name: 'species' },
            });
            const seasonEpisode = await prisma.category.findFirst({
                where: { name : 'season' },
            });

            const charactersService = new GetAllCharactersApplication(new GetAllCharactersAdapter());
            let charactersArray: any[] = await charactersService.getAllCharacters();
            
            for (let i = 0; i < charactersArray.length; i++) {
                const speciesName = charactersArray[i].species;

                // Verificar si la especie ya existe en la base de datos
                const existingSpecies = await prisma.sub_Category.findFirst({
                    where: { name: speciesName, category_id: speciesCharacter.id },
                });

                    // Si la especie no existe, agregarla
                    if (!existingSpecies) {
                        await prisma.sub_Category.create({
                            data: { name: speciesName, category_id: speciesCharacter.id },
                    });
                }   
            }   

        }
    }
}
