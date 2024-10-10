import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CharacterParticipationDto {
  @Expose()
  @IsNumber()
  id: number;
  
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  status: string;
}