import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Injectable()
export class EpisodeDto {
  @Expose()
  id: number;

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

  @Expose()
  @IsString()
  characters: string[];
  
}