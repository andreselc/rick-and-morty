import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

@Injectable()
export class CreateCharacterDto {
  @IsOptional()
  @Expose()
  id?: number;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  type: string;

  @IsInt()
  @Expose()
  sub_category_id: number;

  @IsInt()
  @Expose()
  status_id: number;
  
}