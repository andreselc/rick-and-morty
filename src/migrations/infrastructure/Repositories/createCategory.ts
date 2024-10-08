import { IRespository } from "src/migrations/domain/IRepository";
import { PrismaClient } from "@prisma/client";

export class createCategory implements IRespository<PrismaClient> {

    async create (prisma: PrismaClient): Promise<void> {

        //Inserción de datos en categoría

        //Ahora, se debe verificar si existen datos dentro de la tabla Categoría
        const categoryCount = await prisma.category.count();

        if (categoryCount === 0) {
            //Se insertan los datos en la tabla
            await prisma.category.create({
                data: { name: 'species' },
            });
        
            await prisma.category.create({
                data: { name : 'season' },
            });
        }

    }

}