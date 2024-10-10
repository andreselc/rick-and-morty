import { Expose, Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { SeasonResultsDto } from "./seasonResultsdto.dto";

export class SeasonDto {
    @Expose()
    @IsNumber()
    season: number;
  
    @Expose()
    @ValidateNested()
    @Type(() => SeasonResultsDto)
    results: SeasonResultsDto;
  }