import { Expose, Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { SeasonDto } from "src/episodes/application/Dtos/seasonsParticipationsDto.dto";

export class CharacterParticipationDto {
    @Expose()
    @IsString()
    nameCharacter: string;
  
    @Expose()
    @IsString()
    status: string;
  
    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SeasonDto)
    seasons: SeasonDto[];
  }