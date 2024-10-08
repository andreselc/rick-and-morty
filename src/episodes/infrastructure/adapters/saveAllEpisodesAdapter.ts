import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { SaveAllEpisodesPort } from 'src/episodes/domain/ports/saveAllEpisodes.Port';
import { DurationFormatter } from 'src/episodes/domain/duration';

export class SaveAllEpisodesAdapter implements SaveAllEpisodesPort {

    prisma: PrismaClient;

    constructor(prisma: PrismaClient) {        
        this.prisma = prisma;
    }

    async saveAllEpisodes() {
        // Inserción de datos en SubCategoria
        // Primero se verifica si ya hay datos dentro de la tabla subcategoria
        const episodesCount = await this.prisma.episode.count();

        // Se obtiene el atributo para sacar su ID.
        if (episodesCount === 0) {
            // Llamar a un endpoint para obtener datos de las temporadas
            const episodesResponse = await axios.get('https://rickandmortyapi.com/api/episode');

            // Procesar episodios para obtener todas las temporadas:
            const episodesResponsePages = episodesResponse.data.info.pages;

            for (let i = 1; i <= episodesResponsePages; i++) {
                const episodesResponse = await axios.get(`https://rickandmortyapi.com/api/episode?page=${i}`);
                const episodes = episodesResponse.data.results;

                for (const episode of episodes) {
                    // Obtener la temporada del episodio
                    const seasonCode = episode.episode.split('E')[0]; // Obtener la temporada del campo 'episode'
                    const seasonNumber = parseInt(seasonCode.replace('S', ''), 10); // Extraer el número de la temporada
                    const seasonName = `Season ${seasonNumber}`; // Formatear el nombre de la temporada

                    // Verificar si la temporada ya existe en la base de datos
                    let season = await this.prisma.sub_Category.findFirst({
                        where: { name: seasonName },
                    });

                    // Mapear el estado del episodio
                    let statusMapeado: string;
                    if (episode.status === "Alive") {
                        statusMapeado = "active";
                    } else if (episode.status === "Dead" || episode.status === "unknown") {
                        statusMapeado = "suspended";
                    }

                    // Obtener el estado del episodio
                    const type_status = await this.prisma.status_Types.findFirst({
                        where: { name_type: "episodes" },
                    });

                    // Obtener el estado del episodio
                    const status = await this.prisma.status.findFirst({
                        where: { 
                            name: statusMapeado, 
                            status_type_id: type_status.id,
                        },
                    });

                    

                    // Verificar que tanto la temporada como el estado existan antes de insertar el episodio
                    if (season && status) {
                        const duration = DurationFormatter.formatDuration();
                        await this.prisma.episode.create({
                            data: {
                                name: episode.name,
                                duration: duration,
                                sub_category_id: season.id,
                                status_id: status.id,
                            },
                        });
                    } else {
                        console.log(`Error: No se encontró la temporada o el estado para el episodio ${episode.name}`);
                    }
                }
            }
        }
    }
}