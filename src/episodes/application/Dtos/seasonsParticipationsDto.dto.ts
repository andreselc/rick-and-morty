import { Expose, Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { ParticipationEpisodeDto } from "./participationEpisodeDto.dto";

export class SeasonDto {
    @Expose()
    @IsNumber()
    season: number;
  
    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ParticipationEpisodeDto)
    episodes: ParticipationEpisodeDto[];
  }