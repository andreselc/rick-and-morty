import { PrismaClient } from "@prisma/client";
import axios from 'axios';

export class Seed {    
    private prisma: PrismaClient;
    
    constructor() {
      this.prisma = new PrismaClient();
    }

  async seed() {

    //Inserción de datos en status_type

    //Primero se verifica si ya hay datos dentro de la tabla status_type
    const statusTypeCount = await this.prisma.status_Types.count();

    if (statusTypeCount === 0) {
        //Se insertan los datos en la tabla
        await this.prisma.status_Types.create({
            data: { name_type: 'episodes' },
        });
    
        await this.prisma.status_Types.create({
            data: { name_type: 'characters' },
        });
    }

    //Inserción de datos en status

    //Primero se verifica si ya hay datos dentro de la tabla status
    const statusCount = await this.prisma.status.count();

    //Se obtiene el atributo para sacar su ID.
    if (statusCount === 0) {
      const statusTypeCharacter = await this.prisma.status_Types.findFirst({
        where: { name_type: 'characters' },
      });
      const statusTypeEpisode = await this.prisma.status_Types.findFirst({
        where: { name_type : 'episodes' },
      });

    //Inserción de datos en Status
    await this.prisma.status.createMany({
        data: [
          { status_type_id: statusTypeEpisode.id, name: 'active' },
          { status_type_id: statusTypeEpisode.id, name: 'suspended' },
          { status_type_id: statusTypeCharacter.id, name: 'cancelled' },
          { status_type_id: statusTypeCharacter.id, name: 'active' },
        ],
      });
    }

    //Inserción de datos en categoría

    //Ahora, se debe verificar si existen datos dentro de la tabla Categoría
    const categoryCount = await this.prisma.category.count();

    if (categoryCount === 0) {
         //Se insertan los datos en la tabla
         await this.prisma.category.create({
            data: { name: 'species' },
        });
    
        await this.prisma.category.create({
            data: { name : 'season' },
        });
    }

    //Inserción de datos en SubCategoria

    //Primero se verifica si ya hay datos dentro de la tabla subcategoria
    const subCategoryCount = await this.prisma.sub_Category.count();

    //Se obtiene el atributo para sacar su ID.
    if (subCategoryCount === 0) {
      const speciesCharacter = await this.prisma.sub_Category.findFirst({
        where: { name: 'species' },
      });
      const seasonEpisode = await this.prisma.sub_Category.findFirst({
        where: { name : 'season' },
      });


    // Llamar a un endpoint para obtener datos de las temporadas y especies de personajes
    const charactersResponse = await axios.get('https://rickandmortyapi.com/api/character');
    const episodesResponse = await axios.get('https://rickandmortyapi.com/api/episode');

    const characters = charactersResponse.data.results;
    const episodes = episodesResponse.data.results;

    //Procesar episodios para obtener todas las temporadas:

    const seasons = new Set<string>();
    episodes.forEach((episode: any) => {
        const seasonCode = episode.episode.split('E')[0]; // Obtener la temporada del campo 'episode'
        const seasonNumber = parseInt(seasonCode.replace('S', ''), 10); // Extraer el número de la temporada
        const seasonName = `Season ${seasonNumber}`; // Formatear el nombre de la temporada
        seasons.add(seasonName);
    });

    // Inserción de datos en sub_Category para temporadas
    for (const season of seasons) {
        await this.prisma.sub_Category.create({
        data: { name: season, category_id: seasonEpisode.id },
        });
    }


    }
    console.log('Proceso seeding completado');
  }

}