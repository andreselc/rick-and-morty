import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateEpisodeDto {

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
  @IsString()
  season?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;
}