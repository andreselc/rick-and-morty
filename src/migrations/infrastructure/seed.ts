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

    console.log('Proceso seeding completado');
  }

}