import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested, IsArray } from 'class-validator';
import { CharacterParticipationDto } from './../../../characters/application/Dtos/characterParticipationDto.dto';

export class ParticipationInEpisodeDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterParticipationDto)
  characters: CharacterParticipationDto[];
}