import { IRespository } from "src/migrations/domain/IRepository";
import { PrismaClient } from "@prisma/client";
import axios from 'axios';

export class createSubCategory implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {
        //Inserción de datos en SubCategoria

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

            // Llamar a un endpoint para obtener datos de las temporadas y especies de personajes
            const episodesResponse = await axios.get('https://rickandmortyapi.com/api/episode');

            //Procesar episodios para obtener todas las temporadas:

            const seasons = new Set<string>();
            const episodesResponsePages= episodesResponse.data.info.pages;

            for (let i = 1; i <= episodesResponsePages; i++) {
                const episodesResponse = await axios.get(`https://rickandmortyapi.com/api/episode?page=${i}`);
                const episodes = episodesResponse.data.results;

                episodes.forEach((episode: any) => {
                    const seasonCode = episode.episode.split('E')[0]; // Obtener la temporada del campo 'episode'
                    const seasonNumber = parseInt(seasonCode.replace('S', ''), 10); // Extraer el número de la temporada
                    const seasonName = `Season ${seasonNumber}`; // Formatear el nombre de la temporada
                    seasons.add(seasonName);
                });
            }

            // Inserción de datos en sub_Category para temporadas
            for (const season of seasons) {
                await prisma.sub_Category.create({
                data: { name: season, category_id: seasonEpisode.id },
                });
            }

            const charactersResponse = await axios.get('https://rickandmortyapi.com/api/character');

            // Inserción de datos en sub_Category para especies
            const characters = await this.getAllCharacters();
            for (const character of characters) {
                const speciesName = character.species;
                console.log(speciesName);

                
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

    // Función para obtener todos los personajes manejando la paginación
    private async getAllCharacters(): Promise<any[]> {
        let characters: any[] = [];
        let nextUrl = 'https://rickandmortyapi.com/api/character';

        while (nextUrl) {
            const response = await axios.get(nextUrl);
            characters = characters.concat(response.data.results);
            nextUrl = response.data.info.next;
        }

        return characters;
    }

}