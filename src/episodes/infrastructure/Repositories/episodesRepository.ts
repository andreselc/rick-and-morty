import { PrismaClient} from "@prisma/client";
import { IRespository } from "src/migrations/domain/IRepository";
import { SaveAllSeasonsAdapter } from "../adapters/saveAllSeasonsAdapter";
import { SaveAllSeasonsApplication } from "src/episodes/application/saveAllSeasons.application";

export class EpisodesRepository implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {

        //Inserción de los episodios
        //Primero, se verifica si hay episodios en base de datos
        const episodesCount = await prisma.character.count();
        if (episodesCount === 0) {
            const episodesService = new SaveAllSeasonsApplication(new SaveAllSeasonsAdapter(prisma));
            await episodesService.saveAllSeasons();
                
        }
    }      
}

