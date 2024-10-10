import { Expose, Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { EpisodeDto } from "./episodeDto.dto";

export class SeasonResultsDto {
    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EpisodeDto)
    episodes: EpisodeDto[];
  }