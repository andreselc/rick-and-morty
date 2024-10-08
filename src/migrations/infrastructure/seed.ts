import { PrismaClient } from "@prisma/client";
import { createCategory } from "./Repositories/createCategory";
import { createStatus } from "./Repositories/createStatus";
import { createStatusType } from "./Repositories/createStatusType";
import { createSubCategory } from "./Repositories/createSubCategory";

export class Seed {    
    private prisma: PrismaClient;
    private categories: createCategory;
    private status: createStatus;
    private statusType: createStatusType;
    private subCategory: createSubCategory;
    
    constructor() {
      this.prisma = new PrismaClient();
      this.categories = new createCategory();
      this.status = new createStatus();
      this.statusType = new createStatusType();
      this.subCategory = new createSubCategory();
    }

  async seed() {

    this.statusType.create(this.prisma);

    this.status.create(this.prisma);

    this.categories.create(this.prisma);
    
    this.subCategory.create(this.prisma);
    
    
    console.log('Proceso seeding completado');
  }

}