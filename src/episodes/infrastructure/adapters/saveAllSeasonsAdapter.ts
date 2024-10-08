import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { SaveAllSeasonsPort } from 'src/episodes/domain/ports/saveAllSeasonsPort';

export class SaveAllSeasonsAdapter implements SaveAllSeasonsPort {

    prisma: PrismaClient;

    constructor(prisma: PrismaClient) {        
        this.prisma = prisma;
    }

    async saveAllSeasons() {
        //Inserción de datos en SubCategoria
        const seasonEpisode = await this.prisma.category.findFirst({
            where: { name : 'season' },
        });

        //Primero se verifica si ya hay datos dentro de la tabla subcategoria
        const subCategoryCount = await this.prisma.sub_Category.count();

        //Se obtiene el atributo para sacar su ID.
        if (subCategoryCount === 0) {
            

            // Llamar a un endpoint para obtener datos de las temporada
            const episodesResponse = await axios.get('https://rickandmortyapi.com/api/episode');

            //Procesar episodios para obtener todas las temporadas:

            const seasons : string[] = [];
            const episodesResponsePages= episodesResponse.data.info.pages;

            for (let i = 1; i <= episodesResponsePages; i++) {
                const episodesResponse = await axios.get(`https://rickandmortyapi.com/api/episode?page=${i}`);
                const episodes = episodesResponse.data.results;

                episodes.forEach((episode: any) => {
                    const seasonCode = episode.episode.split('E')[0]; // Obtener la temporada del campo 'episode'
                    const seasonNumber = parseInt(seasonCode.replace('S', ''), 10); // Extraer el número de la temporada
                    const seasonName = `Season ${seasonNumber}`; // Formatear el nombre de la temporada
                    if (!seasons.includes(seasonName))
                    seasons.push(seasonName);
                });
            }

            for (const season of seasons) {
                await this.prisma.sub_Category.create({
                data: { name: season, category_id: seasonEpisode.id },
                });
            }
        }
    }

}