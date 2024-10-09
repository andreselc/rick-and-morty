import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateEpisodeDto {
  @Expose()
  @IsString()
  name: string ;

  @Expose()
  @IsString()
  duration: string ;

  @Expose()
  @IsString()
  season: string;

  @Expose()
  @IsString()
  status: string;
}