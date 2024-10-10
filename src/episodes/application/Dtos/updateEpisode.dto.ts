import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEpisodeDto {

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string ;

  @ApiProperty()
  @IsOptional()
  @IsString()
  duration?: string ;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  season?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;
}