import { IRespository } from "src/migrations/domain/IRepository";
import { PrismaClient } from "@prisma/client";

export class createStatusType implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {
        //Inserción de datos en status_type
        //Primero se verifica si ya hay datos dentro de la tabla status_type
        const statusTypeCount = await prisma.status_Types.count();
        if (statusTypeCount === 0) {
            //Se insertan los datos en la tabla
            await prisma.status_Types.create({
                data: { name_type: 'episodes' },
            });        
            await prisma.status_Types.create({
                data: { name_type: 'characters' },
            });
        };
    }

}