import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Injectable()
export class CreateCharacterDto {

  @IsString()
  @Expose()
  name: string;

  @IsOptional()
  @IsString()
  @Expose()
  type?: string;

  @IsString()
  @Expose()
  species: string;

  @IsString()
  @Expose()
  status: string;
  
}