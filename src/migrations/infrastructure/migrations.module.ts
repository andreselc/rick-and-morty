import { Injectable } from '@nestjs/common';
import { MigrationService } from './../infrastructure/migrations.service';

@Injectable()
export class GetCharacterById {
  constructor(private prisma: MigrationService) {}

  async findOne(id: number) {
    if (!id) {
      throw new Error('ID is required');
    }

    return this.prisma.character.findUnique({
      where: { id },
    });
  }
}