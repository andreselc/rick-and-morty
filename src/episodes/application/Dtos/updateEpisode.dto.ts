import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEpisodeDto {

  @Expose()
  @IsOptional()
  @IsString()
  name?: string ;

  @Expose()
  @IsOptional()
  @IsString()
  duration?: string ;

  @Expose()
  @IsOptional()
  @IsNumber()
  season?: number;

  @Expose()
  @IsOptional()
  @IsString()
  status?: string;
}