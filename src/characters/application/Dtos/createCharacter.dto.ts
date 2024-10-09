import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';

@Injectable()
export class CreateCharacterDto {
  @Expose()
  name: string;

  @Expose()
  sub_category_id: number;

  @Expose()
  status_id: number;
  
}