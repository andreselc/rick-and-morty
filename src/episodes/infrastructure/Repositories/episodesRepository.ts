import { PrismaClient} from "@prisma/client";
import { SaveAllEpisodesApplication } from "src/episodes/application/saveAllEpisodes.application";
import { IRespository } from "src/migrations/domain/IRepository";
import { SaveAllEpisodesAdapter } from "../adapters/saveAllEpisodesAdapter";

export class EpisodesRepository implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {

        //Inserción de los episodios
        //Primero, se verifica si hay episodios en base de datos
        const episodesCount = await prisma.episode.count();
        if (episodesCount === 0) {
            const episodesService = new SaveAllEpisodesApplication(new SaveAllEpisodesAdapter(prisma));
            await episodesService.saveAllEpisodes();   
            
        }
    }      
}

