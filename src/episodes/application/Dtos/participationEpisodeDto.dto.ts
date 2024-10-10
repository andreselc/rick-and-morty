import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsArray } from 'class-validator';

export class ParticipationEpisodeDto {
  @Expose()
  @IsString()
  nameEpisode: string;
}
