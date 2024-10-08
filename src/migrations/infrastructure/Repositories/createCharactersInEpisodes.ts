import { IRespository } from "src/migrations/domain/IRepository";
import { PrismaClient } from "@prisma/client";
import axios from 'axios';

export class createCharactersInEpisodes implements IRespository<PrismaClient> {

    async create(prisma: PrismaClient): Promise<void> {
        // Obtener todos los personajes desde la API
        const charactersResponse = await axios.get('https://rickandmortyapi.com/api/character');
        const characterResponsePages= charactersResponse.data.info.pages;

        for (let i = 1; i <=characterResponsePages; i++) {
        const charactersResponseWithPage = await axios.get(`https://rickandmortyapi.com/api/character?page=${i}`);
        const characters = charactersResponseWithPage.data.results;

        const participations = [];
        const listCount = await prisma.episodeCharacter.count();
        
        if (listCount === 0) {
            for (const characterData of characters) {
            
                for (const episodeUrl of characterData.episode) {
                    // Obtener el ID del episodio desde la URL
                    const episodeId = parseInt(episodeUrl.split('/').pop());

                    // Obtener detalles del episodio desde la API
                    const episodeResponse = await axios.get(episodeUrl);

                    const character = await prisma.character.findFirst({
                        where: { name :  characterData.name},
                    });

                    const episodePrisma = await prisma.episode.findFirst({
                        where: { name :  episodeResponse.data.name},
                    });

                    // Generar tiempos de inicio y finalización aleatorios para la participación
                    const initMinute = Math.floor(Math.random() * 60);
                    const initSecond = Math.floor(Math.random() * 60);
                    const finishMinute = Math.min(initMinute + Math.floor(Math.random() * 10) + 1, 59);
                    const finishSecond = Math.floor(Math.random() * 60);

                    const initTime = `${String(initMinute).padStart(2, '0')}:${String(initSecond).padStart(2, '0')}`;
                    const finishTime = `${String(finishMinute).padStart(2, '0')}:${String(finishSecond).padStart(2, '0')}`;

                    participations.push({
                        episode_id: episodePrisma.id,
                        character_id: character.id,
                        time_init: initTime,
                        time_finished: finishTime
                    });
                }
            }

            // Almacenar las participaciones en la tabla EpisodeCharacter
            await prisma.episodeCharacter.createMany({
                data: participations
            });
        }
    }
 }
}