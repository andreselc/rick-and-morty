import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Injectable()
export class CreateEpisodeDto {

  @Expose()
  @IsString()
  name: string ;

  @Expose()
  @IsString()
  duration: string ;

  @Expose()
  @IsNumber()
  season: number;

  @Expose()
  @IsString()
  status: string;
}