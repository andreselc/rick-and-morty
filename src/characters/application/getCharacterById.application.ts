import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { MigrationService } from "src/migrations/infrastructure/migrations.service";
import { CharacterDto } from "./Dtos/characterDto.dto";

@Injectable()
export class GetCharacterById {

    constructor(private prisma: MigrationService) {}

    async findOne(id: number, characterDto: CharacterDto): Promise<CharacterDto> {
        if (!id) {
            throw new BadRequestException('ID is required');
        }

        const currentCharacter = await this.prisma.character.findUnique({
            where: { id },
        });

        if (!currentCharacter) {
            throw new NotFoundException('Character not found');
        }

        const status = await this.prisma.status.findUnique({
            where: { id: currentCharacter.status_id },
        });

        const species = await this.prisma.sub_Category.findUnique({
            where: { id: currentCharacter.sub_category_id },
        });
        
        characterDto.id = currentCharacter.id;
        characterDto.name = currentCharacter.name;
        characterDto.status = status.name;
        characterDto.species = species.name;
        return characterDto;
    }

} 
