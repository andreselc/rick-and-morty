import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Injectable()
export class CreateEpisodeDto {
  @Expose()
  @IsString()
  name: string ;

  @Expose()
  @IsString()
  duration: string ;

  @Expose()
  @IsString()
  season: number;

  @Expose()
  @IsString()
  status: string;
}