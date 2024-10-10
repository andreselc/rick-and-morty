import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CharacterParticipationDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  status: string;
}