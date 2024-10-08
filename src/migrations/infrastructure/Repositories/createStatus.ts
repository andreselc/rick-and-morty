import { IRespository } from "src/migrations/domain/IRepository";
import { PrismaClient } from "@prisma/client";

export class createStatus implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {
        //Inserción de datos en status

    //Primero se verifica si ya hay datos dentro de la tabla status
    const statusCount = await prisma.status.count();

    //Se obtiene el atributo para sacar su ID.
    if (statusCount === 0) {
        const statusTypeCharacter = await prisma.status_Types.findFirst({
            where: { name_type: 'characters' },
        });
        const statusTypeEpisode = await prisma.status_Types.findFirst({
            where: { name_type : 'episodes' },
        });

        //Inserción de datos en Status
        await prisma.status.createMany({
            data: [
            { status_type_id: statusTypeEpisode.id, name: 'active' },
            { status_type_id: statusTypeEpisode.id, name: 'suspended' },
            { status_type_id: statusTypeCharacter.id, name: 'cancelled' },
            { status_type_id: statusTypeCharacter.id, name: 'active' },
            ],
        });
        }
    }

}