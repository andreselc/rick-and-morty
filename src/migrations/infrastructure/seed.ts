import { PrismaClient } from "@prisma/client";
import { IRespository } from "../domain/IRepository";

export class Seed {    
    private prisma: PrismaClient;
    private categories: IRespository<PrismaClient>;
    private status: IRespository<PrismaClient>;
    private statusType: IRespository<PrismaClient>;
    private subCategory: IRespository<PrismaClient>;
    private charactersApi: IRespository<PrismaClient>;
    private episodesApi: IRespository<PrismaClient>;
    private charactersInEpisode: IRespository<PrismaClient>;
 
    constructor(
      categories: IRespository<PrismaClient>,
      status: IRespository<PrismaClient>,
      statusType: IRespository<PrismaClient>,
      subCategory: IRespository<PrismaClient>,
      charactersApi: IRespository<PrismaClient>,
      episodesApi:IRespository<PrismaClient>,
      charactersInEpisode: IRespository<PrismaClient>
    ) {
      this.prisma = new PrismaClient();
      this.categories = categories;
      this.status = status;
      this.statusType = statusType;
      this.subCategory = subCategory;
      this.charactersApi = charactersApi;
      this.episodesApi = episodesApi;
      this.charactersInEpisode = charactersInEpisode;
    }

  async seed() {

    try {
        await this.statusType.create(this.prisma);
        await this.status.create(this.prisma);
        await this.categories.create(this.prisma);
        await this.subCategory.create(this.prisma);
        await this.charactersApi.create(this.prisma);
        await this.episodesApi.create(this.prisma);
        await this.charactersInEpisode.create(this.prisma);
       

        console.log('Todos los métodos ejecutados exitosamente');
    } catch (error) {
        console.error('Error durante el seeding:', error);
    }

    console.log('Proceso seeding completado');
  }

}